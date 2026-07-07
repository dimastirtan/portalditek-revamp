<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<SheetPrimitive.TriggerProps> & {
		children?: import('svelte').Snippet;
	} = $props();
</script>

<SheetPrimitive.Trigger bind:ref data-slot="sheet-trigger" {...restProps}>
	{@render children?.()}
</SheetPrimitive.Trigger>
