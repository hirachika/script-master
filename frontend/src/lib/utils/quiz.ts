import type { Word } from '$lib/stores/vocabStore';

export function generateQuiz(allWords: Word[], limit: number = 10) {
	// 学習中の単語を優先してシャッフル
	const pool = [...allWords].sort(() => Math.random() - 0.5).slice(0, limit);

	return pool.map((word) => {
		// 他の単語の意味をダミーとして取得
		const otherMeanings = allWords
			.filter((w) => w.id !== word.id)
			.map((w) => w.japanese);

		// ダミーをシャッフルして3つ選ぶ
		const dummies = otherMeanings
			.sort(() => Math.random() - 0.5)
			.slice(0, 3);

		// 正解と混ぜてシャッフル
		const options = [word.japanese, ...dummies].sort(() => Math.random() - 0.5);

		return {
			id: word.id,
			word: word.english,
			options: options,
			answer: word.japanese
		};
	});
}
