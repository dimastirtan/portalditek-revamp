<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { BellOff } from '@lucide/svelte';
	import type { Announcement } from '$lib/types/content';

	let { items }: { items: Announcement[] } = $props();

	const active = $derived(items.filter((a) => a.active));
</script>

<div class="flex h-full flex-col">
	<div class="border-b p-4">
		<h2 class="font-display font-semibold tracking-tight">Pengumuman</h2>
		<p class="text-muted-foreground text-sm">Informasi dan pengumuman terbaru.</p>
	</div>

	<div class="flex-1 overflow-y-auto p-4">
		{#if active.length === 0}
			<div
				class="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12 text-center"
			>
				<BellOff class="size-8 opacity-40" />
				<p class="text-sm">Saat ini tidak ada pengumuman baru.</p>
			</div>
		{:else}
			<ul class="space-y-4">
				{#each active as anc (anc.id)}
					<li class="rounded-lg border p-4">
						<p class="text-muted-foreground text-xs">{formatDate(anc.date)}</p>
						<h3 class="mt-1 text-sm font-semibold">{anc.title}</h3>
						<p class="text-muted-foreground mt-1.5 text-sm leading-relaxed">{anc.body}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
