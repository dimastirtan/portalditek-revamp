<script lang="ts">
	import type { PersonRow } from '$lib/types/content';
	import { Search } from '@lucide/svelte';

	let { people = [] }: { people?: PersonRow[] } = $props();

	const PAGE_SIZE = 25;
	let query = $state('');
	let orgFilter = $state('');
	let page = $state(1);

	const orgs = $derived([...new Set(people.map((p) => p.org).filter(Boolean))].sort());

	const filtered = $derived(
		people.filter((p) => {
			const q = query.trim().toLowerCase();
			const matchQ =
				!q || p.name.toLowerCase().includes(q) || p.nik.toLowerCase().includes(q);
			const matchOrg = !orgFilter || p.org === orgFilter;
			return matchQ && matchOrg;
		})
	);

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const pageClamped = $derived(Math.min(page, totalPages));
	const paged = $derived(
		filtered.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE)
	);

	// Reset ke halaman 1 setiap kali filter berubah.
	$effect(() => {
		query;
		orgFilter;
		page = 1;
	});
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
	<div class="relative flex-1">
		<Search class="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
		<input
			type="search"
			bind:value={query}
			placeholder="Cari nama atau NIK…"
			class="border-input bg-background focus:ring-ring w-full rounded-md border py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2"
		/>
	</div>
	<select
		bind:value={orgFilter}
		class="border-input bg-background focus:ring-ring rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2"
	>
		<option value="">Semua Unit Org</option>
		{#each orgs as o (o)}
			<option value={o}>{o}</option>
		{/each}
	</select>
</div>

<p class="text-muted-foreground mt-3 text-xs">
	{filtered.length} personil{query || orgFilter ? ' (terfilter)' : ''} · halaman {pageClamped} dari {totalPages}
</p>

<div class="mt-2 overflow-x-auto rounded-lg border">
	<table class="w-full text-sm">
		<thead class="bg-muted/50 text-muted-foreground text-left text-xs uppercase tracking-wide">
			<tr>
				<th class="px-3 py-2 font-medium">NIK</th>
				<th class="px-3 py-2 font-medium">Nama</th>
				<th class="px-3 py-2 font-medium">Org.</th>
				<th class="hidden px-3 py-2 font-medium sm:table-cell">Telepon</th>
				<th class="hidden px-3 py-2 font-medium md:table-cell">Email</th>
				<th class="px-3 py-2 font-medium">Gol. Darah</th>
			</tr>
		</thead>
		<tbody>
			{#each paged as p (p.nik + p.name)}
				<tr class="border-t">
					<td class="text-muted-foreground px-3 py-2 tabular-nums">{p.nik || '–'}</td>
					<td class="px-3 py-2 font-medium">{p.name}</td>
					<td class="px-3 py-2">{p.org || '–'}</td>
					<td class="hidden px-3 py-2 sm:table-cell">{p.tlp || '–'}</td>
					<td class="hidden px-3 py-2 md:table-cell">{p.email || '–'}</td>
					<td class="px-3 py-2">{p.goldar || '–'}</td>
				</tr>
			{:else}
				<tr>
					<td colspan="6" class="text-muted-foreground px-3 py-8 text-center">
						Tidak ada personil yang cocok.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

{#if totalPages > 1}
	<div class="mt-4 flex items-center justify-center gap-1">
		<button
			type="button"
			onclick={() => (page = Math.max(1, pageClamped - 1))}
			disabled={pageClamped === 1}
			class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
		>
			‹ Sebelumnya
		</button>
		<span class="text-muted-foreground px-3 text-sm tabular-nums">
			{pageClamped} / {totalPages}
		</span>
		<button
			type="button"
			onclick={() => (page = Math.min(totalPages, pageClamped + 1))}
			disabled={pageClamped === totalPages}
			class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
		>
			Berikutnya ›
		</button>
	</div>
{/if}
