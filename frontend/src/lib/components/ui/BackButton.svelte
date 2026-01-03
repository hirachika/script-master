<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	export let href: string = '';
	export let text: string = '';
	export let size: number = 20;
	export let className: string = '';
	export let useHistory: boolean = false;

	function handleClick() {
		if (useHistory) {
			history.back();
		} else if (href) {
			goto(href);
		}
	}
</script>

{#if href || useHistory}
	<button
		on:click={handleClick}
		class="flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-indigo-600 {className}"
	>
		<ArrowLeft {size} />
		{#if text}
			<span>{text}</span>
		{/if}
	</button>
{:else}
	<a
		{href}
		class="flex items-center gap-2 font-bold text-slate-500 transition-colors hover:text-indigo-600 {className}"
	>
		<ArrowLeft {size} />
		{#if text}
			<span>{text}</span>
		{/if}
	</a>
{/if}
