<script lang="ts">
	import { CircleAlert } from 'lucide-svelte';
	import BaseCard from './BaseCard.svelte';
	import CustomButton from './CustomButton.svelte';

	export let title: string = 'エラーが発生しました';
	export let message: string = '';
	export let buttonText: string = 'ホームに戻る';
	export let buttonHref: string = '/';
	export let iconSize: number = 60;
	export let iconColor: string = '#FF5555';
	export let onButtonClick: (() => void) | null = null;
</script>

<BaseCard className="text-center">
	<CircleAlert size={iconSize} color={iconColor} class="mx-auto" />
	<h2 class="my-4 text-2xl font-bold text-slate-800">{title}</h2>
	{#if message}
		<p class="mb-8 text-slate-500">{message}</p>
	{/if}
	<CustomButton
		variant="primary"
		on:click={onButtonClick ? onButtonClick : () => (window.location.href = buttonHref)}
	>
		{buttonText}
	</CustomButton>
</BaseCard>
