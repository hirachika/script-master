<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { Star, RotateCcw, House, ChevronRight } from 'lucide-svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import SpeakButton from '$lib/components/ui/SpeakButton.svelte';

	let accuracy = 0;
	let message = '';
	let result = { score: 0, total: 0, words: [] as any[] };
	let stars = 0;

	onMount(() => {
		const savedResult = sessionStorage.getItem('lastQuizResult');
		if (savedResult) {
			result = JSON.parse(savedResult);
			accuracy = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

			// メッセージの出し分け
			if (accuracy >= 90) message = '🎉 完璧です！';
			else if (accuracy >= 70) message = '🎉 よくできました！';
			else if (accuracy >= 50) message = '👍 お疲れ様！';
			else message = '💪 次は頑張りましょう！';

			// 星評価ロジック
			if (accuracy >= 90) stars = 6;
			else if (accuracy >= 70) stars = 5;
			else if (accuracy >= 50) stars = 4;
			else if (accuracy >= 30) stars = 3;
			else if (accuracy >= 10) stars = 2;
			else stars = 1;
		} else {
			goto('/games/quiz');
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-[#F0F9FA] to-[#E0F2F4] pb-12">
	<Header />

	<main class="mx-auto max-w-2xl px-6 py-12">
		<div in:fly={{ y: 20, duration: 600 }} class="text-center">
			<BaseCard className="text-center">
				<h1 class="text-3xl font-black text-gray-900 mb-2">Quiz Result</h1>
				<p class="font-medium">{message}</p>

				<div class="my-4 relative inline-block">
					<div class="text-7xl font-black text-indigo-600">
						{accuracy}<span class="text-2xl ml-1">%</span>
					</div>
					<div class="mt-4 flex justify-center gap-1">
						{#each Array(6) as _, i}
							<Star
								size={28}
								class={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
							/>
						{/each}
					</div>
				</div>
			</BaseCard>

			<BaseCard className="text-center my-6">
				<h2 class="text-lg font-bold text-gray-800 mb-4 pt-2">出題された単語</h2>
				<div class="flex flex-wrap justify-center gap-2">
					{#each result.words as word}
						<CustomButton
							variant="outline"
							className="h-16 rounded-2xl bg-white"
							on:click={() => goto(`/vocab/${word.id}`)}
						>
							<div class="flex items-center gap-3">
								<SpeakButton text={word.english} size="sm" color="red" />
								<div class="text-left">
									<div class="font-bold text-gray-800 group-hover:text-indigo-600">
										{word.english}
									</div>
									<div class="text-sm text-gray-500">{word.japanese}</div>
								</div>
							</div>
							<ChevronRight size={18} class="text-gray-300 group-hover:text-indigo-400" />
						</CustomButton>
					{/each}
				</div>
			</BaseCard>

			<div class="grid grid-cols-2 gap-4">
				<CustomButton variant="outline" on:click={() => goto('/games/quiz')}>
					<RotateCcw size={24} class="mr-1" /> もう一度
				</CustomButton>
				<CustomButton variant="primary" on:click={() => goto('/')}>
					<House size={24} class="mr-1" /> ホームに戻る
				</CustomButton>
			</div>
		</div>
	</main>
</div>
