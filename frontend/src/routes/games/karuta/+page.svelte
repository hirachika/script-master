<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { vocabStore } from '$lib/stores/vocabStore';
	import { X, Timer } from 'lucide-svelte';
	import PageContainer from '$lib/components/ui/PageContainer.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';

	interface Card {
		id: string; // 単語のID（ペア判定用）
		uniqueId: number; // DOM要素識別用
		content: string;
		type: 'en' | 'jp';
		status: 'idle' | 'selected' | 'matched' | 'wrong';
	}

	let cards: Card[] = [];
	let currentCombo = 0;
	let firstSelection: Card | null = null;
	let gameStatus: 'loading' | 'playing' | 'error' = 'loading';
	let gameWords: any[] = []; // 今回のゲームで使う単語
	let matchesCount = 0;
	let maxCombo = 0;
	let secondSelection: Card | null = null;
	let time = 0;
	let timerInterval: any;

	// ゲーム初期化（LocalStorageから取得）
	function initGame() {
		// 1. 最低限の単語チェック（6枚のペアを作るなら最低6単語。調整可能）
		if ($vocabStore.length < 3) {
			gameStatus = 'error';
			return;
		}

		// 2. LocalStorageから最大8単語（16枚）をランダムに選出
		gameWords = [...$vocabStore].sort(() => Math.random() - 0.5).slice(0, 8);

		// 3. カード生成
		const enCards: Card[] = gameWords.map((w, i) => ({
			id: w.id,
			uniqueId: i,
			content: w.english,
			type: 'en',
			status: 'idle'
		}));
		const jpCards: Card[] = gameWords.map((w, i) => ({
			id: w.id,
			uniqueId: i + 100,
			content: w.japanese,
			type: 'jp',
			status: 'idle'
		}));

		// 4. 日本語・英語それぞれの中でシャッフル
		cards = [
			...enCards.sort(() => Math.random() - 0.5),
			...jpCards.sort(() => Math.random() - 0.5)
		];

		matchesCount = 0;
		time = 0;
		gameStatus = 'playing';
		startTimer();
	}

	function startTimer() {
		clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			if (gameStatus === 'playing') time++;
		}, 1000);
	}

	function handleCardClick(card: Card) {
		if (card.status === 'matched' || card.status === 'selected' || secondSelection) return;

		card.status = 'selected';
		cards = [...cards]; // 再描画を促す

		if (!firstSelection) {
			firstSelection = card;
		} else {
			secondSelection = card;
			checkMatch();
		}
	}

	function checkMatch() {
		if (firstSelection && secondSelection) {
			const isMatch =
				firstSelection.id === secondSelection.id && firstSelection.type !== secondSelection.type;

			if (isMatch) {
				// 正解：コンボを増やす
				currentCombo++;
				if (currentCombo > maxCombo) maxCombo = currentCombo;
				firstSelection.status = 'matched';
				secondSelection.status = 'matched';
				matchesCount++;
				resetSelections();

				if (matchesCount === gameWords.length) {
					clearInterval(timerInterval);

					// 単語データを抽出して保存
					sessionStorage.setItem(
						'lastKarutaResult',
						JSON.stringify({
							time: time,
							maxCombo: maxCombo,
							total: gameWords.length,
							// ここを追加！
							words: gameWords.map((w) => ({ id: w.id, english: w.english, japanese: w.japanese }))
						})
					);

					goto(`/games/karuta/result`);
				}
			} else {
				// 不正解：コンボをリセット
				currentCombo = 0;
				firstSelection.status = 'wrong';
				secondSelection.status = 'wrong';
				setTimeout(() => {
					if (firstSelection) firstSelection.status = 'idle';
					if (secondSelection) secondSelection.status = 'idle';
					resetSelections();
				}, 600);
			}
		}
	}

	function resetSelections() {
		firstSelection = null;
		secondSelection = null;
		cards = [...cards];
	}

	onMount(() => {
		initGame();
		return () => clearInterval(timerInterval);
	});

	$: formatTime = (s: number) => {
		const min = Math.floor(s / 60);
		const sec = s % 60;
		return `${min}:${sec.toString().padStart(2, '0')}`;
	};
	$: jpCards = cards.filter((c) => c.type === 'jp');
	$: enCards = cards.filter((c) => c.type === 'en');
</script>

<PageContainer showHeader={true} className="pb-12">
	{#if gameStatus === 'loading'}
		<LoadingSpinner message="カードを並べています..." />
	{:else if gameStatus === 'error'}
		<ErrorState
			title="単語が足りません"
			message="カルタを始めるには最低3単語の登録が必要です。"
			buttonText="単語を抽出する"
			onButtonClick={() => goto('/extract')}
		/>
		{:else}
			<div class="mb-6 flex items-center justify-between">
				<a href="/">
					<X size={24} class="mr-1" />
				</a>
				<div class="flex gap-1">
					<Timer size={24} color="#55D5DD" />
					<span class="text-xl font-bold">{formatTime(time)}</span>
				</div>
				<div class="font-bold text-gray-400">
					Match: <span class="text-xl text-[#55D5DD]">{matchesCount}</span> / {gameWords.length}
				</div>
			</div>

			<div class="space-y-12">
				<section>
					<div class="mb-4 flex items-center gap-3">
						<div class="h-6 w-1 rounded-full bg-[#55D5DD]"></div>
						<h2 class="text-sm font-bold uppercase tracking-widest text-gray-500">Japanese</h2>
					</div>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
						{#each jpCards as card (card.uniqueId)}
							<button
								on:click={() => handleCardClick(card)}
								class="flex h-24 items-center justify-center rounded-2xl border-2 p-3 text-center text-lg font-bold transition-all duration-300
								{card.status === 'idle'
									? 'border-transparent bg-white text-gray-700 hover:border-[#55D5DD]/50'
									: ''}
								{card.status === 'selected' ? 'scale-105 border-[#55D5DD] bg-[#55D5DD] text-white' : ''}
								{card.status === 'matched' ? 'opacity-0 pointer-events-none' : ''}
								{card.status === 'wrong' ? 'animate-shake border-red-400 bg-red-400 text-white' : ''}"
							>
								{card.content}
							</button>
						{/each}
					</div>
				</section>

				<div class="relative py-4">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-dashed border-gray-300"></div>
					</div>
					<div class="relative flex justify-center">
						<span
							class="bg-[#F0F9FA] px-4 text-xs font-black uppercase tracking-widest text-gray-400"
							>Match the pairs</span
						>
					</div>
				</div>

				<section>
					<div class="mb-4 flex items-center gap-3">
						<div class="h-6 w-1 rounded-full bg-[#FF5555]"></div>
						<h2 class="text-sm font-bold uppercase tracking-widest text-gray-500">English</h2>
					</div>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
						{#each enCards as card (card.uniqueId)}
							<button
								on:click={() => handleCardClick(card)}
								class="flex h-24 items-center justify-center rounded-2xl border-2 p-3 text-center text-lg font-bold transition-all duration-300
								{card.status === 'idle'
									? 'border-transparent bg-white text-gray-700 hover:border-[#FF5555]/50'
									: ''}
								{card.status === 'selected' ? 'scale-105 border-[#FF5555] bg-[#FF5555] text-white' : ''}
								{card.status === 'matched' ? 'opacity-0 pointer-events-none' : ''}
								{card.status === 'wrong' ? 'animate-shake border-red-400 bg-red-400 text-white' : ''}"
							>
								{card.content}
							</button>
						{/each}
					</div>
				</section>
			</div>
		{/if}
	</main>
</PageContainer>

<style>
	:global(.animate-shake) {
		animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}

	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}
		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}
		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}
		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}
</style>
