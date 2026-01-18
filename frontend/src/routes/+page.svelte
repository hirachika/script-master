<script lang="ts">
	import { FileText, BookOpen, Gamepad2, LayoutGrid, Target } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { vocabStore } from '$lib/stores/vocabStore';
	import ActionCard from '$lib/components/ui/ActionCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import Header from '$lib/components/ui/Header.svelte';

	// ストアの値をリアクティブに購読
	$: hasWords = words.length > 0;
	$: words = $vocabStore;
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	<Header showUserMenu={true} />

	<main class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
		<section class="text-center leading-tight mb-6">
			<h1 class="text-[32px] sm:text-[48px] font-bold text-gray-900 mb-4">
				あなたの<span class="text-red-500">"読みたい"</span>が、
				<br />そのまま<span class="text-red-500">英語力</span>になる！
			</h1>
			<p class="text-[14px] sm:text-[18px]">
				映画、ニュース、小説。<br class="none sm:block" />好きな英文を貼り付けるだけで、
				<br />その中の重要単語をゲーム感覚でマスターできます。
			</p>
		</section>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
			<ActionCard
				variant="red"
				title="新しく単語を抽出"
				description="映画、ニュース、小説、好きな英文を貼り付けて単語を自動で抽出します"
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
	</main>
</div>
