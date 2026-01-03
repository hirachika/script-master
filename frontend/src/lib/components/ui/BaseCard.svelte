<script lang="ts">
	export let glass: boolean = false;
	export let className: string = '';

	const baseStyles = 'rounded-2xl bg-white border-gray-100';
	const glassStyles = 'bg-white/60 backdrop-blur-md border-white/20';
</script>

<div class="{baseStyles} {glass ? glassStyles : baseStyles} p-6 {className}">
	<slot />
</div>
