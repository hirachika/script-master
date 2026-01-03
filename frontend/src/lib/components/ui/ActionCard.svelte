<script lang="ts">
	import { fade } from 'svelte/transition';

	// デザインのバリエーション（色）を受け取れるようにします
	export let variant: 'red' | 'blue' | 'teal' = 'red';
	export let title: string;
	export let description: string;

	const borderColors = {
		red: 'hover:border-red-200',
		blue: 'hover:border-blue-200',
		teal: 'hover:border-teal-200'
	};

	const iconBgColors = {
		red: 'bg-red-50 text-[#FF5555]',
		blue: 'bg-blue-50 text-blue-500',
		teal: 'bg-teal-50 text-[#55D5DD]'
	};
</script>

<div
	in:fade={{ duration: 400 }}
	class="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 md:p-8 text-center shadow-sm transition-all hover:shadow-md {borderColors[
		variant
	]}"
>
	<div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full {iconBgColors[variant]}">
		<slot name="icon" />
	</div>

	<h2 class="mb-3 text-2xl font-black text-gray-900">{title}</h2>
	<p class="mb-8 flex-grow text-gray-500">{description}</p>

	<slot name="action" />
</div>
