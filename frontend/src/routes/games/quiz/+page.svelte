<script lang="ts">
	import { fade } from 'svelte/transition';
	import { generateQuiz } from '$lib/utils/quiz';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { vocabStore } from '$lib/stores/vocabStore';
	import { X, ChevronRight } from 'lucide-svelte';
	import BaseCard from '$lib/components/ui/BaseCard.svelte';
	import CustomButton from '$lib/components/ui/CustomButton.svelte';
	import ErrorState from '$lib/components/ui/ErrorState.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import PageContainer from '$lib/components/ui/PageContainer.svelte';
	import SpeakButton from '$lib/components/ui/SpeakButton.svelte';

	let currentIndex = 0;
	let isAnswered = false;
	let isInitialized = false;
	let questions: any[] = [];
	let score = 0;
	let selectedOption = '';

	// コンポーネント読み込み時にクイズを生成
	onMount(() => {
		if ($vocabStore.length < 4) {
			// 単語が少なすぎるとクイズが成立しない
			isInitialized = true;
			return;
		}
		questions = generateQuiz($vocabStore, 10);
		isInitialized = true;
	});

	$: currentQuestion = questions[currentIndex];
	$: progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

	function handleSelect(option: string) {
		if (isAnswered) return;
		selectedOption = option;
		isAnswered = true;
		if (option === currentQuestion.answer) {
			score++;
		}
	}

	function nextQuestion() {
		if (currentIndex < questions.length - 1) {
			currentIndex++;
			isAnswered = false;
			selectedOption = '';
		} else {
			// questions ごと保存して、結果画面で単語リストを表示できるようにする
			sessionStorage.setItem(
				'lastQuizResult',
				JSON.stringify({
					score,
					total: questions.length,
					words: questions.map((q) => ({ id: q.id, english: q.word, japanese: q.answer }))
				})
			);
			goto('/games/quiz/result');
		}
	}
</script>

<PageContainer showHeader={true} className="pb-12">
	{#if !isInitialized}
		<LoadingSpinner message="クイズを準備しています..." />
	{:else if questions.length === 0}
		<ErrorState
			title="単語が足りません"
			message="クイズを始めるには最低4単語の登録が必要です。"
			buttonText="単語を抽出する"
			onButtonClick={() => goto('/extract')}
		/>
	{:else if currentQuestion}
		<div class="mb-12 flex items-center gap-6">
			<a href="/">
				<X size={24} />
			</a>
			<div class="h-3 flex-grow overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-full bg-[#FF5555] transition-all duration-500"
					style="width: {progress}%"
				></div>
			</div>
			<span class="whitespace-nowrap text-sm font-bold text-gray-500">
				{currentIndex + 1} / {questions.length}
			</span>
		</div>

		<div class="mx-auto max-w-xl">
			{#key currentIndex}
				<BaseCard className="text-center mb-4">
					<SpeakButton text={currentQuestion.word} size="lg" color="red" className="mx-auto" />
					<h2 class="my-2 text-5xl font-black text-gray-900">{currentQuestion.word}</h2>
				</BaseCard>
			{/key}

			<div class="grid grid-cols-1 gap-4">
				{#each currentQuestion.options as option}
					<button
						on:click={() => handleSelect(option)}
						disabled={isAnswered}
						class="group relative w-full rounded-2xl border-2 p-6 text-left text-xl font-bold transition-all
					{isAnswered && option === currentQuestion.answer
							? 'border-green-500 bg-green-50 text-green-700'
							: ''}
					{isAnswered && selectedOption === option && option !== currentQuestion.answer
							? 'border-red-500 bg-red-50 text-red-700'
							: ''}
				{!isAnswered ? 'border-gray-100 bg-white hover:border-[#FF5555] hover:shadow-md' : ''}
					{isAnswered && option !== currentQuestion.answer && selectedOption !== option
							? 'opacity-50 border-gray-100 bg-white'
							: ''}"
					>
						<div class="flex items-center justify-between">
							<span>{option}</span>
							{#if isAnswered && option === currentQuestion.answer}
								<div class="font-bold text-green-500">✓ 正解</div>
							{:else if isAnswered && selectedOption === option && option !== currentQuestion.answer}
								<div class="font-bold text-red-500">✕ 不正解</div>
							{/if}
						</div>
					</button>
				{/each}
			</div>
			{#if isAnswered}
				<div in:fade={{ duration: 200 }} class="mt-8">
					<CustomButton variant="primary" size="lg" on:click={nextQuestion}>
						{currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
						<ChevronRight size={24} />
					</CustomButton>
				</div>
			{/if}
		</div>
	{/if}
</PageContainer>
