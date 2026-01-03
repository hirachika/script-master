<script lang="ts">
	import { FileText, BookOpen, Gamepad2, LayoutGrid, Target } from 'lucide-svelte';
	import ActionCard from '$lib/components/ui/ActionCard.svelte';
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';
	import { goto } from '$app/navigation';
	import { vocabStore } from '$lib/stores/vocabStore';
	// ストアの値をリアクティブに購読
	$: words = $vocabStore;
	$: hasWords = words.length > 0;
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<Header showUserMenu={true} />

	<main class="max-w-4xl mx-auto px-6 py-10">
		<section class="text-center mb-8">
			<h1 class="text-5xl font-bold text-gray-900 mb-4 leading-[1.25]">
				あなたの<span class="text-[#FF5555]">"読みたい"</span>が、
				<br />そのまま<span class="text-[#FF5555]">英語力</span>になる！
			</h1>
			<p class="text-lg">
				映画、ニュース、小説。好きな英文を貼り付けるだけで、
				<br />その中の重要単語をゲーム感覚でマスターできます。
			</p>
		</section>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- <div
			class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12"
			in:fly={{ y: 20, delay: 500, duration: 600 }}
		> -->
			<ActionCard
				variant="red"
				title="新しく単語を抽出"
				description="好きな英文から単語を自動で抽出します"
			>
				<FileText slot="icon" size={32} />
				<div slot="action">
					<CustomButton variant="primary" on:click={() => goto('/extract')}>
						さっそく始める
					</CustomButton>
				</div></ActionCard
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
				<div slot="action" class="flex flex-wrap justify-center gap-3">
					<CustomButton variant="primary" on:click={() => goto('/games/quiz')} disabled={!hasWords}>
						<Target size={16} /> 4択クイズ
					</CustomButton>
					<CustomButton
						variant="secondary"
						on:click={() => goto('/games/karuta')}
						disabled={!hasWords}
					>
						<LayoutGrid size={16} /> 単語カルタ
					</CustomButton>
				</div></ActionCard
			>
		</div>

		<section class="mt-20">
			<h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<FileText size={24} class="mr-1" /> 最近の学習
			</h3>
			<BaseCard glass={true}>
				<p class="text-center">まだ学習履歴がありません。最初のスクリプトを読み込みましょう！</p>
			</BaseCard>
		</section>
	</main>
</div>
