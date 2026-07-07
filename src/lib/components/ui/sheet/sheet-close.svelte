<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<SheetPrimitive.CloseProps> & {
		children?: import('svelte').Snippet;
	} = $props();
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" {...restProps}>
	{@render children?.()}
</SheetPrimitive.Close>
