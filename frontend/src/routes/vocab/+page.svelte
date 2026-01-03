<script lang="ts">
	import { ArrowLeft, Check, Trash2 } from 'lucide-svelte';
	import { fly, fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { vocabStore, vocabActions } from '$lib/stores/vocabStore';
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';

	// ストアの値をリアクティブに購読
	$: words = $vocabStore;

	function handleDelete(id: string) {
		if (confirm('この単語を削除しますか？')) {
			vocabActions.deleteWord(id);
		}
	}

	function toggleStatus(id: string) {
		vocabActions.toggleMastered(id);
	}

	const handleSpeak = (text: string) => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'en-US';
			speechSynthesis.speak(utterance);
		}
	};
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-12">
	<Header />

	<main class="max-w-4xl mx-auto px-6 py-10">
		<div class="mb-8 flex items-center gap-4">
			<a href="/">
				<ArrowLeft size={20} />
			</a>
			<div>
				<h1 class="font-sans text-2xl font-bold text-gray-900">マイ単語帳</h1>
				<p class="mt-2 text-sm">{words.length} 単語登録済み（14日間限定保存）</p>
			</div>
		</div>

		<div class="mx-auto max-w-xl space-y-3">
			{#each words as word (word.id)}
				<BaseCard className="flex items-center justify-between">
					<button on:click={() => goto(`/vocab/${word.id}`)} class="flex-1 text-left outline-none">
						<div class="flex items-center gap-2">
							<span
								class="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors"
							>
								{word.english}
							</span>
							<span
								class="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase"
							>
								{word.pos}
							</span>
						</div>
						<p class="text-gray-600">{word.japanese}</p>
					</button>

					<div class="flex items-center gap-2">
						<button
							on:click={() => toggleStatus(word.id)}
							class="py-2 px-3 flex items-center rounded-full transition-colors {word.status ===
							'mastered'
								? 'text-green-500 bg-green-50'
								: 'text-slate-300 bg-slate-50'}"
						>
							習得済み<Check size={24} />
						</button>

						<button
							on:click={() => handleDelete(word.id)}
							class="py-2 px-3 flex items-center text-slate-300 hover:text-red-500 transition-colors"
						>
							<Trash2 size={24} />
						</button>
					</div>
				</BaseCard>
			{/each}
		</div>
	</main>
</div>
