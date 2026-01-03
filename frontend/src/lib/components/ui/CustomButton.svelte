<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'outline' = 'primary';
	export let size: 'md' | 'lg' = 'md';
	export let className: string = '';
	export let disabled: boolean = false;

	const baseStyles =
		'inline-flex items-center justify-center gap-1 font-medium transition-all duration-200 active:scale-95';

	const variants = {
		primary: 'bg-[#FF5555] text-white hover:bg-[#FF3333]',
		secondary: 'bg-[#55D5DD] text-white hover:bg-[#3DBEC8]',
		outline:
			'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#FF5555] hover:text-red-500'
	};

	const sizes = {
		md: 'px-6 py-3 text-[14px] sm:text-[18px] rounded-xl',
		lg: 'px-8 py-4 text-[14px] sm:text-[18px] rounded-2xl w-full'
	};

	$: disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
</script>

<button
	class="{baseStyles} {variants[variant]} {sizes[size]} {className} {disabledStyles}"
	{disabled}
	on:click
>
	<slot />
</button>
