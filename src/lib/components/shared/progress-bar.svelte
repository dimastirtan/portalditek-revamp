<script lang="ts">
	import { cn } from '$lib/utils';

	/** value: 0–100. */
	let { value, class: className }: { value: number; class?: string } = $props();

	const pct = $derived(Math.min(100, Math.max(0, value)));
</script>

<div
	class={cn('bg-muted h-1.5 overflow-hidden rounded-full', className)}
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={Math.round(pct)}
>
	<div class="bg-primary h-full rounded-full" style="width: {pct}%"></div>
</div>
