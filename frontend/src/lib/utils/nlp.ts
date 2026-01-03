import nlp from 'compromise';

// 現在の抽出条件:
// 品詞属性: compromise.js が「名詞」「動詞」「形容詞」と判定した単語。
// 除外リスト (STOP_WORDS): the, a, you などの意味を持たない頻出語ではないこと。
// 文字数: 2文字以上であること。
// 記号: 句読点などが除去されていること。
// 頻度の考慮: 現状は、文章の最初の方に出てきた該当単語から順に 15 個（.slice(0, 15)）をピックアップしています。

// 除外したい代名詞や頻出単語のリスト（ストップワード）
const STOP_WORDS = new Set([
	'i', 'me', 'my', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its',
	'we', 'us', 'our', 'they', 'them', 'their', 'this', 'that', 'these', 'those',
	'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
	'do', 'does', 'did', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'as', 'what', 'which',
]);

export async function translateWord(word: string): Promise<string> {
	try {
		// 翻訳ペアを「英語の単語」から「日本語」に限定
		const response = await fetch(
			`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|ja`
		);
		const data = await response.json();
		let translated = data.responseData.translatedText || '';

		// MyMemory特有のノイズ（長い説明文や無関係な日本語）をカットする簡易チェック
		// 単語の翻訳なのに句読点が多い場合は、最初の意味だけを採用する
		if (translated.includes('。') || translated.includes('、')) {
			translated = translated.split(/[。、]/)[0];
		}

		// 特定の誤訳パターン（"澪"など）が含まれていたら再翻訳かフィルタリング
		if (translated.includes('澪')) {
			// 他の翻訳候補（matches）があればそちらを採用するロジック
			if (data.matches && data.matches.length > 1) {
				translated = data.matches[1].translation;
			}
		}

		return translated;
	} catch (error) {
		return '（訳なし）';
	}
}

// 例文を取得して和訳する関数
async function getExampleAndTranslation(word: string) {
	try {
		// 1. 辞書APIから英文の例文を取得
		const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
		const dictData = await dictRes.json();

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

		if (!exampleEn) return { en: "", ja: "" };

		// 2. 取得した英文を和訳
		const jaRes = await fetch(
			`https://api.mymemory.translated.net/get?q=${encodeURIComponent(exampleEn)}&langpair=en|ja`
		);
		const jaData = await jaRes.json();
		const exampleJa = jaData.responseData.translatedText;

		return { en: exampleEn, ja: exampleJa };
	} catch (e) {
		console.error("Example fetch error:", e);
		return { en: "", ja: "" };
	}
}

export async function extractAndTranslate(text: string) {
	const doc = nlp(text);

	// 1. 各品詞を抽出
	const extractSingleWords = (type: 'nouns' | 'verbs' | 'adjectives') => {
		const results: string[] = [];

		// .json()で各チャンクを取得
		doc[type]().json().forEach((chunk: any) => {
			// チャンク内をさらに単語（terms）単位でループ
			chunk.terms.forEach((term: any) => {
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
		// 翻訳。文脈がないと誤訳しやすいため、ヒントを与える
		const japanese = await translateWord(word);

		const wordDoc = nlp(word);
		let pos = 'Word';
		if (wordDoc.nouns().length) pos = '名詞';
		if (wordDoc.verbs().length) pos = '動詞';
		if (wordDoc.adjectives().length) pos = '形容詞';

		return {
			id: crypto.randomUUID(),
			english: word,
			japanese: japanese,
			pos: pos,
			selected: true,
			phonetic: "",
			example: "",
			exampleJapanese: "",
			synonyms: ""
		};
	});

	return await Promise.all(wordPromises);
}
