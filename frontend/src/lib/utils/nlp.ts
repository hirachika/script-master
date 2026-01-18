import nlp from 'compromise';
import { env } from '$env/dynamic/public';
import type {
	TranslationApiResponse,
	DictionaryApiResponse,
	ApiError
} from './api-types';

// 現在の抽出条件:
// 品詞属性: compromise.js が「名詞」「動詞」「形容詞」と判定した単語。
// 除外リスト (STOP_WORDS): the, a, you などの意味を持たない頻出語ではないこと。
// 文字数: 2文字以上であること。
// 記号: 句読点などが除去されていること。
// 頻度の考慮: 現状は、文章の最初の方に出てきた該当単語から順に 15 個（.slice(0, 15)）をピックアップしています。

// API設定（環境変数から取得、デフォルト値あり）
const API_CONFIG = {
	translationUrl: env.PUBLIC_TRANSLATION_API_URL || 'https://api.mymemory.translated.net/get',
	dictionaryUrl: env.PUBLIC_DICTIONARY_API_URL || 'https://api.dictionaryapi.dev/api/v2/entries',
	timeout: parseInt(env.PUBLIC_API_TIMEOUT || '10000', 10),
	retryCount: parseInt(env.PUBLIC_API_RETRY_COUNT || '3', 10),
	retryDelay: parseInt(env.PUBLIC_API_RETRY_DELAY || '1000', 10)
};

// 除外したい代名詞や頻出単語のリスト（ストップワード）
const STOP_WORDS = new Set([
	'i', 'me', 'my', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its',
	'we', 'us', 'our', 'they', 'them', 'their', 'this', 'that', 'these', 'those',
	'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
	'do', 'does', 'did', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'as', 'what', 'which',
]);

/**
 * タイムアウト付きfetch関数
 */
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, { signal: controller.signal });
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error(`リクエストがタイムアウトしました（${timeout}ms）`);
		}
		throw error;
	}
}

/**
 * リトライ機能付きfetch関数
 */
async function fetchWithRetry(
	url: string,
	maxRetries: number = API_CONFIG.retryCount,
	retryDelay: number = API_CONFIG.retryDelay
): Promise<Response> {
	let lastError: Error | null = null;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const response = await fetchWithTimeout(url, API_CONFIG.timeout);
			
			// HTTP エラーステータスのチェック
			if (!response.ok) {
				// 429 (Too Many Requests) や 503 (Service Unavailable) はリトライ可能
				if (response.status === 429 || response.status === 503) {
					throw new Error(`API一時的エラー: ${response.status} ${response.statusText}`);
				}
				// 404や400などはリトライしない
				throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
			}
			
			return response;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error('不明なエラー');
			
			// 最後の試行でない場合、待機してリトライ
			if (attempt < maxRetries - 1) {
				console.warn(`API呼び出し失敗 (試行 ${attempt + 1}/${maxRetries}): ${lastError.message}`);
				await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
			}
		}
	}

	throw lastError || new Error('APIリクエストが失敗しました');
}

/**
 * 単語を正規化（原形に変換）
 */
function normalizeWord(word: string): string {
	const doc = nlp(word);
	// 動詞を原形に、名詞を単数形に
	if (doc.verbs().length > 0) {
		return doc.verbs().toInfinitive().text() || word;
	}
	if (doc.nouns().length > 0) {
		return doc.nouns().toSingular().text() || word;
	}
	return word;
}

/**
 * 固有名詞かどうかを判定
 */
function isProperNoun(word: string): boolean {
	// 大文字で始まる単語は固有名詞の可能性が高い
	const doc = nlp(word);
	return doc.people().length > 0 || doc.places().length > 0 || /^[A-Z]/.test(word);
}

/**
 * 単語を翻訳する関数（品質改善版）
 */
export async function translateWord(word: string, context?: string): Promise<string> {
	try {
		// 固有名詞の場合はそのまま返す
		if (isProperNoun(word)) {
			console.info(`固有名詞のためスキップ: ${word}`);
			return word;
		}

		// 単語を正規化（原形に変換）
		const normalizedWord = normalizeWord(word);
		
		// 文脈がある場合は文脈付きで翻訳（品質向上）
		const queryText = context 
			? `${normalizedWord} (context: ${context.slice(0, 50)})`
			: normalizedWord;
		
		const url = `${API_CONFIG.translationUrl}?q=${encodeURIComponent(queryText)}&langpair=en|ja`;
		const response = await fetchWithRetry(url);
		const data = await response.json() as TranslationApiResponse;

		// クォータ超過チェック
		if (data.quotaFinished) {
			console.warn('翻訳APIのクォータを超過しました');
			return '（翻訳制限）';
		}

		let translated = data.responseData?.translatedText || '';

		// 翻訳が取得できなかった場合
		if (!translated) {
			console.warn(`翻訳が見つかりませんでした: ${word}`);
			return '（訳なし）';
		}

		// クリーンアップ処理
		// 1. 括弧内のcontext情報を削除
		translated = translated.replace(/\s*\(context:.*?\)/gi, '');
		
		// 2. 句読点や記号（！？など）を削除
		translated = translated.replace(/[！？。、]/g, '');
		
		// 3. 余分な空白を削除
		translated = translated.trim();

		// 4. matches から最も品質の高い翻訳を選択
		if (data.matches && data.matches.length > 0) {
			// match品質が80%以上のものを優先
			const highQualityMatches = data.matches.filter(m => m.match >= 0.8);
			if (highQualityMatches.length > 0) {
				// 最も短くシンプルな翻訳を選択（ノイズが少ない）
				const simplest = highQualityMatches
					.map(m => m.translation.replace(/[！？。、]/g, '').trim())
					.sort((a, b) => a.length - b.length)[0];
				
				if (simplest && simplest.length < translated.length) {
					translated = simplest;
				}
			}
		}

		return translated;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : '不明なエラー';
		console.error(`翻訳エラー (単語: ${word}):`, errorMessage);
		return '（翻訳エラー）';
	}
}

/**
 * 例文を取得して和訳する関数（エラーハンドリング強化版）
 */
export async function getExampleAndTranslation(word: string): Promise<{ en: string; ja: string }> {
	try {
		// 1. 辞書APIから英文の例文を取得
		const dictUrl = `${API_CONFIG.dictionaryUrl}/en/${word}`;
		const dictRes = await fetchWithRetry(dictUrl);
		const dictData = await dictRes.json() as DictionaryApiResponse;

		// 最初の定義の中から例文を探す
		let exampleEn = "";
		const meanings = dictData[0]?.meanings || [];
		for (const meaning of meanings) {
			for (const definition of meaning.definitions) {
				if (definition.example) {
					exampleEn = definition.example;
					break;
				}
			}
			if (exampleEn) break;
		}

		if (!exampleEn) {
			console.info(`例文が見つかりませんでした: ${word}`);
			return { en: "", ja: "" };
		}

		// 2. 取得した英文を和訳
		const transUrl = `${API_CONFIG.translationUrl}?q=${encodeURIComponent(exampleEn)}&langpair=en|ja`;
		const jaRes = await fetchWithRetry(transUrl);
		const jaData = await jaRes.json() as TranslationApiResponse;
		const exampleJa = jaData.responseData?.translatedText || "";

		return { en: exampleEn, ja: exampleJa };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : '不明なエラー';
		console.error(`例文取得エラー (単語: ${word}):`, errorMessage);
		return { en: "", ja: "" };
	}
}

/**
 * 英文から単語を抽出して翻訳する関数
 */
export async function extractAndTranslate(text: string) {
	const doc = nlp(text);

	// 1. 各品詞を抽出
	const extractSingleWords = (type: 'nouns' | 'verbs' | 'adjectives') => {
		const results: string[] = [];

		// .json()で各チャンクを取得
		interface NlpTerm {
			text: string;
		}
		interface NlpChunk {
			terms: NlpTerm[];
		}

		doc[type]().json().forEach((chunk: NlpChunk) => {
			// チャンク内をさらに単語（terms）単位でループ
			chunk.terms.forEach((term: NlpTerm) => {
				// 記号除去、小文字化
				const cleanWord = term.text
					.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()!?]/g, "")
					.trim()
					.toLowerCase();

				// フィルタリング
				if (
					cleanWord.length > 1 &&           // 1文字除外
					!STOP_WORDS.has(cleanWord) &&     // a, the, you等を除外
					isNaN(Number(cleanWord))          // 数字除外
				) {
					results.push(cleanWord);
				}
			});
		});
		return results;
	};

	const nouns = extractSingleWords('nouns');
	const verbs = extractSingleWords('verbs');
	const adjectives = extractSingleWords('adjectives');

	// 重複排除
	const rawWords = Array.from(new Set([...nouns, ...verbs, ...adjectives]))
		.slice(0, 15);

	const wordPromises = rawWords.map(async (word) => {
		// 単語を正規化（原形に変換）
		const normalizedWord = normalizeWord(word);
		
		// 元のテキストを文脈として渡して翻訳品質を向上
		const japanese = await translateWord(normalizedWord, text);

		// 例文と発音記号を取得（並列実行）- 正規化した単語で取得
		const [exampleData, phoneticData] = await Promise.all([
			getExampleAndTranslation(normalizedWord).catch(() => ({ en: "", ja: "" })),
			// 辞書APIから発音記号を取得
			(async () => {
				try {
					const dictUrl = `${API_CONFIG.dictionaryUrl}/en/${normalizedWord}`;
					const dictRes = await fetchWithRetry(dictUrl);
					const dictData = await dictRes.json() as DictionaryApiResponse;
					return dictData[0]?.phonetic || dictData[0]?.phonetics?.[0]?.text || "";
				} catch {
					return "";
				}
			})()
		]);

		const wordDoc = nlp(normalizedWord);
		let pos = 'Word';
		if (wordDoc.nouns().length) pos = '名詞';
		if (wordDoc.verbs().length) pos = '動詞';
		if (wordDoc.adjectives().length) pos = '形容詞';

		return {
			id: crypto.randomUUID(),
			english: normalizedWord, // 正規化された単語を保存
			japanese: japanese,
			pos: pos,
			selected: true,
			phonetic: phoneticData,
			example: exampleData.en,
			exampleJapanese: exampleData.ja,
			synonyms: ""
		};
	});

	return await Promise.all(wordPromises);
}
