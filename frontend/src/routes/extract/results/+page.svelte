<script lang="ts">
	import { ArrowLeft, Check, Volume2, Save, Info } from 'lucide-svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import SpeakButton from '$lib/components/ui/SpeakButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import { fly } from 'svelte/transition';
	import { vocabActions, tempResults, type ExtractedWord } from '$lib/stores/vocabStore';
	import { goto } from '$app/navigation';

	let extractedWords: ExtractedWord[] = [];
	tempResults.subscribe((v: ExtractedWord[]) => (extractedWords = v));

	$: selectedCount = extractedWords.filter((w) => w.selected).length;

	function toggleWord(id: string) {
		extractedWords = extractedWords.map((w) => (w.id === id ? { ...w, selected: !w.selected } : w));
	}

	const handleSpeak = (text: string) => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'en-US';
			speechSynthesis.speak(utterance);
		}
	};

	function handleSave() {
		const selectedWords = extractedWords
			.filter((w) => w.selected)
			.map((w) => ({
				...w,
				status: 'learning' as const,
				addedDate: Date.now() // ここで7日間のカウントダウン開始
			}));

		vocabActions.addWords(selectedWords);
		goto('/extract/complete');
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<Header />

	<main class="max-w-4xl mx-auto px-6 py-8">
		<div class="flex items-center justify-between mb-8">
			<div class="flex items-center gap-4">
				<a href="/extract" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
					<ArrowLeft class="w-6 h-6 text-gray-600" />
				</a>
				<h1 class="text-2xl font-bold text-gray-900">抽出結果</h1>
			</div>
			<div
				class="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
			>
				Step 2 / 2: 単語の選択
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<div class="lg:col-span-3 space-y-4">
				<div class="flex items-center justify-between mb-2 px-2">
					<p class="text-gray-600">{extractedWords.length} 個の単語が見つかりました</p>
					<button
						on:click={() =>
							(extractedWords = extractedWords.map((w) => ({ ...w, selected: true })))}
						class="text-sm text-red-500 font-semibold hover:underline"
					>
						すべて選択
					</button>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each extractedWords as word, i (word.id)}
						<div
							role="button"
							tabindex="0"
							in:fly={{ y: 20, delay: i * 50, duration: 400 }}
							class="group relative bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4
							{word.selected
								? 'border-[#FF5555] shadow-md'
								: 'border-transparent shadow-sm hover:border-gray-200'}"
							on:click={() => toggleWord(word.id)}
							on:keydown={(e) => (e.key === 'Enter' || e.key === ' ' ? toggleWord(word.id) : null)}
						>
							<div
								class="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
								{word.selected ? 'bg-[#FF5555] border-[#FF5555]' : 'border-gray-300'}"
							>
								{#if word.selected}
									<Check class="w-4 h-4 text-white" />
								{/if}
							</div>

							<div class="flex-grow">
								<div class="flex items-center gap-2">
									<span class="text-lg font-bold text-gray-800">{word.english}</span>
									<span
										class="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 font-bold uppercase tracking-wider"
										>{word.pos}</span
									>
								</div>
								<p class="text-sm text-gray-500 truncate">{word.japanese}</p>
							</div>

							<SpeakButton text={word.english} size="lg" color="red" />
						</div>
					{/each}
				</div>
			</div>

			<div class="lg:col-span-1">
				<div class="sticky top-24 space-y-6">
					<div class="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
						<h2 class="text-lg font-bold text-gray-900 mb-4">選択中の単語</h2>

						<div class="flex items-end gap-2 mb-6">
							<span class="text-5xl font-black text-red-500">{selectedCount}</span>
							<span class="text-gray-400 font-medium mb-2">/ {extractedWords.length}</span>
						</div>

						<CustomButton
							variant="primary"
							size="lg"
							on:click={handleSave}
							className={selectedCount === 0 ? 'opacity-50 pointer-events-none' : ''}
						>
							<Save class="w-5 h-5 mr-2" />
							単語帳に登録
						</CustomButton>

						<p class="mt-4 text-xs text-center text-gray-400">
							登録した単語は「マイ単語帳」から、いつでも確認・学習できます。
						</p>
					</div>

					<div class="bg-blue-100 p-5 rounded-2xl border border-blue-300">
						<div class="flex items-start gap-3">
							<Info class="w-5 h-5 text-gray-500 mt-0.5" />
							<p class="text-sm text-gray-600 leading-relaxed">
								意味が複数ある場合は、この文脈に最も近いものが自動選択されています。
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
