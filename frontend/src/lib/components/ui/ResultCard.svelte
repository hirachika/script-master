<script lang="ts">
	import { Star } from 'lucide-svelte';
	import BaseCard from './BaseCard.svelte';

	export let title: string = 'Result';
	export let message: string = '';
	export let scoreValue: string | number;
	export let scoreUnit: string = '';
	export let stars: number = 0;
	export let maxStars: number = 6;
</script>

<BaseCard className="text-center">
	<h1 class="text-3xl font-black text-gray-900 mb-2">{title}</h1>
	<p class="font-medium">{message}</p>

	<div class="my-4 relative inline-block">
		<div class="text-7xl font-black text-indigo-600">
			{scoreValue}<span class="text-2xl ml-1">{scoreUnit}</span>
		</div>
		<div class="mt-4 flex justify-center gap-1">
			{#each Array(maxStars) as _, i}
				<Star size={28} class={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
			{/each}
		</div>
	</div>
</BaseCard>
