<script lang="ts">
	import { BookOpen, PenLine, Lightbulb, Repeat, Trash2, ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { vocabStore, vocabActions } from '$lib/stores/vocabStore';
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import SpeakButton from '$lib/components/ui/SpeakButton.svelte';

	const id = $page.params.id;
	// IDに一致する単語を検索
	$: word = $vocabStore.find((w) => w.id === id);

	onMount(() => {
		if (word) {
			vocabActions.updateLastLearned(word.id);
		}
	});

	function handleDelete() {
		if (confirm('この単語を単語帳から削除しますか？')) {
			vocabActions.deleteWord(id);
			goto('/vocab');
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
	<Header />

	{#if word}
		<main class="max-w-4xl mx-auto px-6 py-10">
			<button
				on:click={() => history.back()}
				class="mb-6 flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-indigo-600"
			>
				<ArrowLeft size={20} /> 戻る
			</button>

			<div class="mx-auto max-w-xl">
				<BaseCard className="text-center mb-4">
					<div class="mb-8">
						<SpeakButton text={word.english} size="lg" color="red" className="mx-auto" />
						<h1 class="my-2 text-4xl font-black tracking-normal text-slate-800 md:text-5xl">
							{word.english}
						</h1>
						{#if word.phonetic}
							<p class="text-xl text-slate-400">{word.phonetic}</p>
						{/if}
					</div>

					<div class="mb-10 w-full border-t border-slate-100"></div>

					<div class="space-y-8 text-left">
						<section>
							<div class="mb-2 flex items-center gap-2 font-bold text-slate-400">
								<BookOpen size={18} />
								<span class="text-sm uppercase tracking-wider">品詞</span>
							</div>
							<p class="text-lg font-bold">
								{word.pos}
							</p>
						</section>

						<section>
							<div class="mb-2 flex items-center gap-2 font-bold text-slate-400">
								<PenLine size={18} />
								<span class="text-sm uppercase tracking-wider">意味</span>
							</div>
							<div class="text-lg font-bold">
								{word.japanese}
							</div>
						</section>

						{#if word.example}
							<section class="rounded-2xl bg-slate-50 p-6">
								<div class="mb-3 flex items-center gap-2 font-bold text-slate-400">
									<Lightbulb size={18} />
									<span class="text-sm uppercase tracking-wider">例文</span>
								</div>
								<p class="mb-2 text-lg italic text-slate-700">"{word.example}"</p>
								{#if word.exampleJapanese}
									<p class="text-sm text-slate-500">{word.exampleJapanese}</p>
								{/if}
							</section>
						{/if}

						{#if word.synonyms}
							<section>
								<div class="mb-2 flex items-center gap-2 font-bold text-slate-400">
									<Repeat size={18} />
									<span class="text-sm uppercase tracking-wider">類義語</span>
								</div>
								<p class="text-lg font-medium text-indigo-600">
									{word.synonyms}
								</p>
							</section>
						{/if}
					</div>

					<div class="mt-12 pt-8 border-t border-slate-100">
						<CustomButton variant="primary" on:click={handleDelete}>
							単語帳から削除する<Trash2 size={20} />
						</CustomButton>
					</div></BaseCard
				>
			</div>
		</main>
	{:else}
		<div class="flex h-screen items-center justify-center">
			<p class="text-slate-400">単語が見つかりませんでした。</p>
		</div>
	{/if}
</div>
