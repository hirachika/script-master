<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Star, RotateCcw, House, Timer, Zap, ChevronRight } from 'lucide-svelte'; // ChevronRightを追加
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import SpeakButton from '$lib/components/ui/SpeakButton.svelte';

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
	<Header />

	<main class="mx-auto max-w-2xl px-6 py-12">
		<div in:fly={{ y: 20, duration: 600 }} class="text-center">
			<BaseCard className="text-center">
				<h1 class="text-3xl font-black text-gray-900 mb-2">Karuta Result</h1>
				<p class="font-medium">{message}</p>

				<div class="my-4 relative inline-block">
					<div class="text-7xl font-black text-indigo-600">
						{formatTime(result.time)}
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

			<div class="mt-6 grid grid-cols-2 gap-4">
				<CustomButton variant="outline" on:click={() => goto('/games/karuta')}>
					<RotateCcw size={24} class="mr-1" /> もう一度
				</CustomButton>
				<CustomButton variant="primary" on:click={() => goto('/')}>
					<House size={24} class="mr-1" /> ホームに戻る
				</CustomButton>
			</div>
		</div>
	</main>
</div>
