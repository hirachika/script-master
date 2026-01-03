<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { vocabActions } from '$lib/stores/vocabStore';
	import favicon from '$lib/assets/favicon.svg';

	onMount(() => {
		// 起動時に期限切れデータをクリーンアップ
		vocabActions.clearExpired();
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
