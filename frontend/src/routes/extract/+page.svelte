<script lang="ts">
	import { ArrowLeft, CircleAlert, Sparkles, Settings2 } from 'lucide-svelte';
	import { extractAndTranslate } from '$lib/utils/nlp';
	import { goto } from '$app/navigation';
	import { tempResults } from '$lib/stores/vocabStore';
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';

	const MAX_CHARS = 2000;
	const MIN_CHARS = 30;
	let isExtracting = false;
	let scriptText = '';

	// バリデーションチェック
	$: charCount = scriptText.length;
	$: hasJapanese = /[ぁ-んァ-ヶ亜-熙]/.test(scriptText);
	$: isTooLong = charCount > MAX_CHARS;
	$: isTooShort = charCount > 0 && charCount < MIN_CHARS;

	// ボタンを有効化できるか
	$: isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS && !hasJapanese;

	// エラーメッセージの判定
	$: errorMessage = (() => {
		if (charCount === 0) return '';
		if (hasJapanese) return '日本語が含まれています。英文のみ入力してください。';
		if (isTooShort)
			return `あと ${MIN_CHARS - charCount} 文字入力してください（最低 ${MIN_CHARS} 文字）。`;
		if (isTooLong) return `${MAX_CHARS} 文字以内で入力してください。`;
		return '';
	})();

	// 抽出オプションの定数
	let options = {
		nouns: true,
		verbs: true,
		adjectives: true,
		limit: 20
	};

	async function handleExtract() {
		if (!isValid || isExtracting) return;
		isExtracting = true;

		try {
			const results = await extractAndTranslate(scriptText);
			// データをストアに保存して遷移（URLパラメータだと長すぎるため）
			tempResults.set(results);
			goto('/extract/results');
		} catch (e) {
			alert('解析に失敗しました');
		} finally {
			isExtracting = false;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<Header />

	<main class="max-w-4xl mx-auto px-6 py-10">
		<div class="mb-8 flex items-center gap-4">
			<a href="/">
				<ArrowLeft size={20} />
			</a>
			<div>
				<h1 class="font-sans text-2xl font-bold text-gray-900">スクリプトを読み込む</h1>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="lg:col-span-2">
				<textarea
					bind:value={scriptText}
					class="h-96 w-full rounded-3xl border-2 p-6 transition-all outline-none focus:ring-4
				{errorMessage
						? 'border-red-200 focus:ring-red-50'
						: 'border-white focus:border-blue-400 focus:ring-blue-100/50 shadow-sm'}"
					placeholder="好きな英文を貼り付けてください（例：ニュース記事、SNSの投稿など）"
				></textarea>

				<div class="mt-4 flex items-start justify-between px-2">
					<div
						class="flex flex-1 items-center gap-2 text-sm font-bold {errorMessage
							? 'text-red-500'
							: 'text-slate-400'}"
					>
						{#if errorMessage}
							<CircleAlert size={18} />
							<span class="leading-tight">{errorMessage}</span>
						{:else}
							<span class="text-xs font-medium uppercase tracking-wider">Ready to analyze</span>
						{/if}
					</div>

					<div class="ml-4 text-sm font-medium {isTooLong ? 'text-red-500' : 'text-slate-400'}">
						{charCount} / {MAX_CHARS}
					</div>
				</div>
			</div>

			<div class="space-y-6">
				<BaseCard className="">
					<div class="mb-6 flex items-center gap-2 font-bold text-gray-800">
						<Settings2 class="h-5 w-5 text-gray-400" />
						抽出設定
					</div>

					<div class="space-y-2">
						<label
							class="flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-colors hover:bg-gray-50"
						>
							<span class="font-medium text-gray-700">名詞 (Nouns)</span>
							<input
								type="checkbox"
								bind:checked={options.nouns}
								class="h-5 w-5 accent-[#FF5555]"
							/>
						</label>

						<label
							class="flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-colors hover:bg-gray-50"
						>
							<span class="font-medium text-gray-700">動詞 (Verbs)</span>
							<input
								type="checkbox"
								bind:checked={options.verbs}
								class="h-5 w-5 accent-[#FF5555]"
							/>
						</label>

						<label
							class="flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-colors hover:bg-gray-50"
						>
							<span class="font-medium text-gray-700">形容詞 (Adj)</span>
							<input
								type="checkbox"
								bind:checked={options.adjectives}
								class="h-5 w-5 accent-[#FF5555]"
							/>
						</label>
					</div>

					<div class="mt-8">
						<CustomButton
							variant="primary"
							className="h-16 w-full text-lg shadow-lg shadow-red-100"
							disabled={!isValid || isExtracting}
							on:click={handleExtract}
						>
							{#if isExtracting}
								<span class="flex items-center gap-2">
									<div
										class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
									></div>
									解析中...
								</span>
							{:else}
								<span class="flex items-center gap-2">
									<Sparkles size={20} />
									抽出を開始
								</span>
							{/if}
						</CustomButton>
					</div>
				</BaseCard>

				<div class="rounded-2xl bg-blue-100/50 p-4 text-xs leading-relaxed text-blue-700">
					<p class="font-bold mb-1">💡 ヒント</p>
					長い文章ほど、文脈を考慮した精度の高い抽出が可能です。30文字以上の英文を入力してください。
				</div>
			</div>
		</div>
	</main>
</div>
