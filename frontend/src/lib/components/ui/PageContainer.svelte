<script lang="ts">
	import Header from './Header.svelte';

	export let showHeader: boolean = true;
	export let maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' = '4xl';
	export let className: string = '';
	export let showUserMenu: boolean = false;

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		'4xl': 'max-w-4xl'
	};
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
	{#if showHeader}
		<Header {showUserMenu} />
	{/if}

	<main class="{maxWidthClasses[maxWidth]} mx-auto px-6 py-10 {className}">
		<slot />
	</main>
</div>
