<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { RotateCcw, House } from 'lucide-svelte';
	import PageContainer from '$lib/components/ui/PageContainer.svelte';
	import ResultCard from '$lib/components/ui/ResultCard.svelte';
	import WordListCard from '$lib/components/ui/WordListCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';

	let message = '';
	// 初期値に words: [] を追加して undefined エラーを防ぐ
	let result = { time: 0, maxCombo: 0, total: 0, words: [] as any[] };
	let stars = 0;

	// タイムを 0:00 形式に変換
	$: formatTime = (s: number) => {
		const min = Math.floor(s / 60);
		const sec = s % 60;
		return `${min}:${sec.toString().padStart(2, '0')}`;
	};

	onMount(() => {
		const savedResult = sessionStorage.getItem('lastKarutaResult');
		if (savedResult) {
			result = JSON.parse(savedResult);

			// 成績評価：タイムとコンボ率で判定（例：1単語あたり5秒以内なら高評価）
			const timePerWord = result.time / result.total;
			const comboRate = result.maxCombo / result.total;

			if (timePerWord < 4 && comboRate > 0.8) {
				message = '🎉 完璧です！';
				stars = 6;
			} else if (timePerWord < 7) {
				message = '🎉 よくできました！';
				stars = 5;
			} else if (timePerWord < 10) {
				message = '👍 お疲れ様！';
				stars = 4;
			} else {
				message = '💪 次は頑張りましょう！';
				stars = 3;
			}
		} else {
			goto('/games/karuta');
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-[#F0F9FA] to-[#E0F2F4] pb-12">
	<PageContainer maxWidth="2xl" showHeader={true}>
		<div in:fly={{ y: 20, duration: 600 }} class="text-center">
			<ResultCard
				title="Karuta Result"
				{message}
				scoreValue={formatTime(result.time)}
				scoreUnit=""
				{stars}
			/>

			<WordListCard words={result.words} />

			<div class="mt-6 grid grid-cols-2 gap-4">
				<CustomButton variant="outline" on:click={() => goto('/games/karuta')}>
					<RotateCcw size={24} /> もう一度
				</CustomButton>
				<CustomButton variant="primary" on:click={() => goto('/')}>
					<House size={24} /> ホームに戻る
				</CustomButton>
			</div>
		</div>
	</PageContainer>
</div>
