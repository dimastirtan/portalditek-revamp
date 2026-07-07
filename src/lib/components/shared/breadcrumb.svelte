<script lang="ts">
	import { ChevronRight, Home } from '@lucide/svelte';

	type Crumb = { label: string; href?: string };
	let { items }: { items: Crumb[] } = $props();
</script>

<nav aria-label="Breadcrumb">
	<ol class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
		<li>
			<a href="/" class="hover:text-foreground inline-flex items-center gap-1 transition-colors">
				<Home class="size-3.5" />
				<span class="sr-only">Beranda</span>
			</a>
		</li>
		{#each items as item, i (item.label)}
			<li aria-hidden="true"><ChevronRight class="size-3.5" /></li>
			<li>
				{#if item.href && i < items.length - 1}
					<a href={item.href} class="hover:text-foreground transition-colors">{item.label}</a>
				{:else}
					<span class="text-foreground font-medium" aria-current="page">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
