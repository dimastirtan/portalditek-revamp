<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		eyebrow?: string;
		title: string;
		description?: string;
		/** Konten aksi di kanan (mis. link "Lihat semua"). */
		action?: Snippet;
	};

	let { eyebrow, title, description, action }: Props = $props();
</script>

<div class="flex flex-wrap items-end justify-between gap-4">
	<div class="max-w-2xl">
		{#if eyebrow}
			<p class="text-primary text-xs font-semibold tracking-wider uppercase">{eyebrow}</p>
		{/if}
		<h2 class="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
		{#if description}
			<p class="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">{description}</p>
		{/if}
	</div>
	{#if action}
		<div>{@render action()}</div>
	{/if}
</div>
