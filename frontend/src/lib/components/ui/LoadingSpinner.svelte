<script lang="ts">
	import { Dog } from 'lucide-svelte';

	export let message: string = '読み込み中...';
	export let size: number = 32;
	export let color: string = '#55D5DD';
	export let className: string = '';
</script>

<div class="flex flex-col items-center justify-center py-40 {className}">
	<Dog {size} {color} class="animate-spin" />
	<p class="mt-4 font-bold" style="color: {color}">{message}</p>
</div>
