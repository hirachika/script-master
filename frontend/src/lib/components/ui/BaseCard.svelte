<script lang="ts">
	export let glass: boolean = false;
	export let className: string = '';
	export let bgColor: string = '';
	export let textColor: string = '';
	export let borderColor: string = '';

	const baseStyles = 'rounded-2xl border';
	const glassStyles = 'bg-white/60 backdrop-blur-md border-white/20';
	const defaultStyles = 'bg-white border-gray-100';

	// カスタムカラーが指定されている場合はスタイルを生成
	$: customStyles = [
		bgColor ? `background-color: ${bgColor};` : '',
		textColor ? `color: ${textColor};` : '',
		borderColor ? `border-color: ${borderColor};` : ''
	].filter(s => s).join(' ');

	// カスタムカラーが指定されていない場合のデフォルトクラス
	$: colorClasses = !bgColor && !textColor && !borderColor 
		? (glass ? glassStyles : defaultStyles)
		: '';
</script>

<div 
	class="{baseStyles} {colorClasses} p-6 {className}" 
	style={customStyles || undefined}
>
	<slot />
</div>
