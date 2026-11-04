<script lang="ts">
	let { label, value, hint }: { label: string; value: number | string; hint?: string } = $props();
</script>

<div class="bg-card rounded-xl border p-4">
	<p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">{label}</p>
	<p class="font-display mt-1 text-2xl font-semibold tabular-nums">{value}</p>
	{#if hint}
		<p class="text-muted-foreground mt-0.5 text-xs">{hint}</p>
	{/if}
</div>
