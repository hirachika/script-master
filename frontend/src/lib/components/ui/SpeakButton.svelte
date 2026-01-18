<script lang="ts">
	import { Volume2 } from 'lucide-svelte';

	export let className: string = '';
	export let color: 'red' | 'gray' = 'gray';
	export let size: 'sm' | 'lg' = 'sm';
	export let text: string; // 再生するテキスト

	const handleSpeak = (e: MouseEvent) => {
		// 親要素のクリックイベント（詳細画面への遷移など）を発火させない
		e.stopPropagation();

		if ('speechSynthesis' in window) {
			// 前の音声をキャンセルして新しく再生
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'en-US';
			utterance.rate = 0.9; // 少し聞き取りやすくゆっくりめに
			window.speechSynthesis.speak(utterance);
		}
	};

	// サイズと形状に応じたスタイル定義
	const sizeStyles = {
		sm: 'p-2',
		lg: 'p-4'
	};

	const colorStyles = {
		gray: 'rounded-full bg-gray-50 text-red-500 hover:scale-110',
		red: 'rounded-full bg-red-50 text-red-500 hover:scale-110'
	};

	const iconSizes = {
		sm: 20,
		lg: 32
	};
</script>

<button
	type="button"
	on:click={handleSpeak}
	class="flex items-center justify-center transition-all active:scale-95 {sizeStyles[
		size
	]} {colorStyles[color]} {className}"
	aria-label="音声再生"
>
	<Volume2 size={iconSizes[size]} />
</button>
