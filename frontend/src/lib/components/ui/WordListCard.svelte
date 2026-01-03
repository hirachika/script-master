<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import BaseCard from './BaseCard.svelte';
	import CustomButton from './CustomButton.svelte';
	import SpeakButton from './SpeakButton.svelte';

	export let title: string = '出題された単語';
	export let words: Array<{ id: string; english: string; japanese: string }> = [];
	export let className: string = '';
</script>

<BaseCard className="text-center my-6 {className}">
	<h2 class="text-lg font-bold text-gray-800 mb-4 pt-2">{title}</h2>
	<div class="flex flex-wrap justify-center gap-2">
		{#each words as word}
			<CustomButton
				variant="outline"
				className="h-16 rounded-2xl bg-white"
				on:click={() => goto(`/vocab/${word.id}`)}
			>
				<div class="flex items-center gap-3">
					<SpeakButton text={word.english} size="sm" color="red" />
					<div class="text-left">
						<div class="font-bold text-gray-800 group-hover:text-indigo-600">
							{word.english}
						</div>
						<div class="text-sm text-gray-500">{word.japanese}</div>
					</div>
				</div>
				<ChevronRight size={18} class="text-gray-300 group-hover:text-indigo-400" />
			</CustomButton>
		{/each}
	</div>
</BaseCard>
