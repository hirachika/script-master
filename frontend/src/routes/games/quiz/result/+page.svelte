<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { RotateCcw, House } from 'lucide-svelte';
	import PageContainer from '$lib/components/ui/PageContainer.svelte';
	import ResultCard from '$lib/components/ui/ResultCard.svelte';
	import WordListCard from '$lib/components/ui/WordListCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';

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
	<PageContainer maxWidth="2xl" showHeader={true}>
		<div in:fly={{ y: 20, duration: 600 }} class="text-center">
			<ResultCard 
				title="Quiz Result" 
				{message} 
				scoreValue={accuracy} 
				scoreUnit="%" 
				{stars} 
			/>

			<WordListCard words={result.words} />

			<div class="grid grid-cols-2 gap-4">
				<CustomButton variant="outline" on:click={() => goto('/games/quiz')}>
					<RotateCcw size={24} class="mr-1" /> もう一度
				</CustomButton>
				<CustomButton variant="primary" on:click={() => goto('/')}>
					<House size={24} class="mr-1" /> ホームに戻る
				</CustomButton>
			</div>
		</div>
	</PageContainer>
</div>
