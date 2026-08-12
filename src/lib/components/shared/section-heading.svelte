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
			<span
				class="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase"
			>
				<span class="bg-primary size-1.5 rounded-full"></span>
				{eyebrow}
			</span>
		{/if}
		<h2 class="font-display mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
		<div
			class="from-primary mt-3 h-1 min-w-2xl rounded-full bg-gradient-to-r to-transparent"
			aria-hidden="true"
		></div>
		{#if description}
			<p class="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">{description}</p>
		{/if}
	</div>
	{#if action}
		<div>{@render action()}</div>
	{/if}
</div>
