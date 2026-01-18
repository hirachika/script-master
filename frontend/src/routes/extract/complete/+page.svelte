<script lang="ts">
	import { CircleCheck, BookOpen, Gamepad2, House, LayoutGrid, Target } from 'lucide-svelte';
	import ActionCard from '$lib/components/ui/ActionCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/ui/Header.svelte';
	import { fly, scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { vocabStore } from '$lib/stores/vocabStore';

	export let savedCount = 12;

	// ストアの値をリアクティブに購読
	$: words = $vocabStore;
	$: hasWords = words.length > 0;
</script>

<section class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<Header showUserMenu={true} />

	<main class="max-w-4xl mx-auto px-6 py-10 flex flex-col items-center text-center">
		<section class="text-center mb-8">
			<div in:scale={{ duration: 800, start: 0.5, easing: elasticOut }}>
				<CircleCheck class="w-28 h-28 text-green-500" />
			</div>
		</section>

		<div in:fly={{ y: 20, delay: 300, duration: 600 }}>
			<h1 class="text-4xl font-black text-gray-900 mb-4">登録完了！</h1>
			<p class="text-lg text-gray-600 mb-12">
				<span class="text-red-500 font-bold">{savedCount}個</span> の単語をマスターしましょう。
			</p>
		</div>

		<div
			class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12"
			in:fly={{ y: 20, delay: 500, duration: 600 }}
		>
			<ActionCard
				variant="blue"
				title="マイ単語帳"
				description="登録した単語のリストを確認し、意味や例文をじっくり復習します"
			>
				<BookOpen slot="icon" size={32} />
				<div slot="action">
					<CustomButton variant="primary" on:click={() => goto('/vocab')} disabled={!hasWords}>
						単語帳を見る
					</CustomButton>
				</div></ActionCard
			>

			<ActionCard
				variant="teal"
				title="ゲームで学習"
				description="クイズやカルタ形式で、楽しみながら記憶を定着させます"
			>
				<Gamepad2 slot="icon" size={32} />
				<div slot="action" class="flex justify-center gap-3">
					<CustomButton variant="primary" on:click={() => goto('/games/quiz')}>
						<Target size={24} /> 4択クイズ
					</CustomButton>
					<CustomButton variant="secondary" on:click={() => goto('/games/karuta')}>
						<LayoutGrid size={24} /> 単語カルタ
					</CustomButton>
				</div></ActionCard
			>
		</div>

		<div in:fly={{ y: 20, delay: 700, duration: 600 }}>
			<CustomButton variant="outline" on:click={() => goto('/')}>
				<House size={24} /> ホームに戻る
			</CustomButton>
		</div>
	</main>
</section>
