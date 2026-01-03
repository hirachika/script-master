import { writable } from 'svelte/store';

// 抽出された単語の型定義（選択前）
export interface ExtractedWord {
	id: string;
	english: string;
	japanese: string;
	pos: string;
	selected: boolean;
}

// 単語の型定義
export interface Word {
	id: string;
	english: string;
	japanese: string;
	pos: string;
	status: 'learning' | 'mastered';
	addedDate: number;
	phonetic?: string;
	example?: string;
	exampleJapanese?: string;
	synonyms?: string;
}

// 解析結果を一時的に保持するストア（結果画面で使用）
export const tempResults = writable<ExtractedWord[]>([]);

// 初期データの読み込み
const isBrowser = typeof window !== 'undefined';
const storedData = isBrowser ? localStorage.getItem('my_vocab_data') : null;
const initialState: Word[] = storedData ? JSON.parse(storedData) : [];

// ストアの作成
export const vocabStore = writable<Word[]>(initialState);

// ストアが更新されるたびにLocalStorageに保存
if (isBrowser) {
	vocabStore.subscribe((value) => {
		localStorage.setItem('my_vocab_data', JSON.stringify(value));
	});
}

// 便利なヘルパー関数
export const vocabActions = {
	addWords: (newWords: Word[]) => {
    vocabStore.update((current) => {
      const TOTAL_LIMIT = 200;
      if (current.length + newWords.length > TOTAL_LIMIT) {
        alert(`登録上限（${TOTAL_LIMIT}単語）を超えるため、一部保存できませんでした。`);
        // 上限に収まる分だけ追加
        const spaceLeft = TOTAL_LIMIT - current.length;
        return [...current, ...newWords.slice(0, spaceLeft)];
      }
      return [...current, ...newWords];
    });
  },
	deleteWord: (id: string) => {
		vocabStore.update((current) => current.filter((w) => w.id !== id));
	},
	toggleMastered: (id: string) => {
		vocabStore.update((current) =>
			current.map((w) => (w.id === id ? { ...w, status: w.status === 'learning' ? 'mastered' : 'learning' } : w))
		);
	},
	// 学習日を今日に更新する（生存期間を伸ばす）
	updateLastLearned: (id: string) => {
		vocabStore.update((current) =>
			current.map((w) => (w.id === id ? { ...w, addedDate: Date.now() } : w))
		);
	},
	// 7日以上経過したデータを削除するロジック
	clearExpired: () => {
		const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
		const now = Date.now();
		vocabStore.update((current) =>
			current.filter((w) => now - w.addedDate < FOURTEEN_DAYS_MS)
		);
	}
};
