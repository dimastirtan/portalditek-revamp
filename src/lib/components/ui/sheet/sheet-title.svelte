<script lang="ts">
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChildrenOrChild<SheetPrimitive.TitleProps> & {
		children?: import('svelte').Snippet;
	} = $props();
</script>

<SheetPrimitive.Title
	bind:ref
	data-slot="sheet-title"
	class={cn('text-foreground font-display font-semibold tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</SheetPrimitive.Title>
