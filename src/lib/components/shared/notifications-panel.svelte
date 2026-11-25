<script lang="ts">
	import { Bell, ExternalLink } from '@lucide/svelte';
	import { LEGACY } from '$lib/config/legacy';
	import type { DoaUpdate } from '$lib/types/content';

	/**
	 * Perubahan dokumen di web DOA 7 hari terakhir (dideteksi portal — lihat
	 * $lib/server/doa/watch). `seenAt` = perubahan terbaru yang sudah dilihat
	 * pengunjung ini; yang lebih baru diberi titik penanda.
	 */
	let { items = [], seenAt = '' }: { items?: DoaUpdate[]; seenAt?: string } = $props();

	const KIND: Record<DoaUpdate['kind'], { label: string; cls: string }> = {
		new: { label: 'New', cls: 'bg-success/15 text-success' },
		revised: { label: 'Revised', cls: 'bg-primary/10 text-primary' },
		updated: { label: 'Updated', cls: 'bg-warning/15 text-warning' }
	};

	// Zona waktu eksplisit: teks sama di server (SSR) & browser.
	const when = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Jakarta',
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	/** "47-FI-DT-201 · Rev A → B" (disusun di sini supaya spasi tidak hilang saat format). */
	function reference(item: DoaUpdate): string {
		const rev = !item.revision
			? ''
			: item.fromRevision
				? `Rev ${item.fromRevision} → ${item.revision}`
				: `Rev ${item.revision}`;
		return [item.number, rev].filter(Boolean).join(' · ');
	}
</script>

<div class="flex h-full flex-col">
	<div class="border-b p-4">
		<h2 class="font-display font-semibold tracking-tight">Notifications</h2>
		<p class="text-muted-foreground text-sm">DOA document updates in the last 7 days.</p>
	</div>

	<div class="flex-1 overflow-y-auto">
		{#if items.length}
			<ul class="divide-y">
				{#each items as item (item.id)}
					<li class="relative px-4 py-3 mx-3 my-4">
						{#if seenAt && item.at > seenAt}
							<span
								class="bg-primary absolute top-4.5 left-1.5 size-1.5 rounded-full"
								aria-label="Unread"
							></span>
						{/if}
						<div class="flex items-center gap-2 text-xs">
							<span class="rounded px-1.5 py-0.5 font-semibold {KIND[item.kind].cls}">
								{KIND[item.kind].label}
							</span>
							<span class="text-muted-foreground">{item.type}</span>
						</div>
						<p class="mt-1.5 text-sm leading-snug font-medium">{item.title || item.number}</p>
						<p class="text-muted-foreground mt-1 text-xs">{reference(item)}</p>
						<p class="text-muted-foreground mt-0.5 text-xs tabular-nums">
							{when.format(new Date(item.at))}
						</p>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="text-muted-foreground flex flex-col items-center gap-3 px-6 py-14 text-center">
				<Bell class="size-8 opacity-50" />
				<p class="text-sm">No DOA document updates in the last 7 days.</p>
			</div>
		{/if}
	</div>

	<div class="border-t p-4">
		<a
			href={LEGACY.doa}
			target="_blank"
			rel="noopener"
			class="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
		>
			Open DOA
			<ExternalLink class="size-3.5" />
		</a>
		<p class="text-muted-foreground mt-1 text-xs">
			Documents can only be read in DOA (login required).
		</p>
	</div>
</div>
