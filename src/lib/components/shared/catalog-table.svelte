<script lang="ts">
	import { Search } from '@lucide/svelte';

	let {
		columns = [],
		rows = [],
		pageSize = 25
	}: { columns?: string[]; rows?: string[][]; pageSize?: number } = $props();

	let query = $state('');
	let page = $state(1);

	const filtered = $derived(
		query.trim()
			? rows.filter((r) => r.join(' ').toLowerCase().includes(query.trim().toLowerCase()))
			: rows
	);
	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / pageSize)));
	const current = $derived(Math.min(page, totalPages));
	const paged = $derived(filtered.slice((current - 1) * pageSize, current * pageSize));

	$effect(() => {
		query;
		page = 1;
	});
</script>

<div class="relative max-w-md">
	<Search class="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
	<input
		type="search"
		bind:value={query}
		placeholder="Cari…"
		class="border-input bg-background focus:ring-ring w-full rounded-md border py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2"
	/>
</div>

<p class="text-muted-foreground mt-3 text-xs">
	{filtered.length} entri{query ? ' (terfilter)' : ''} · halaman {current} dari {totalPages}
</p>

<div class="mt-2 overflow-x-auto rounded-lg border">
	<table class="w-full text-sm">
		<thead class="bg-muted/50 text-muted-foreground text-left text-xs uppercase tracking-wide">
			<tr>
				{#each columns as col (col)}
					<th class="px-3 py-2 font-medium">{col}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each paged as row, i (current + '-' + i)}
				<tr class="border-t align-top">
					{#each row as cell, j (j)}
						<td class="px-3 py-2 {j === 0 ? 'font-medium' : 'text-muted-foreground'}">
							{cell || '–'}
						</td>
					{/each}
				</tr>
			{:else}
				<tr>
					<td colspan={columns.length} class="text-muted-foreground px-3 py-8 text-center">
						Tidak ada entri yang cocok.
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
			onclick={() => (page = Math.max(1, current - 1))}
			disabled={current === 1}
			class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
		>
			‹ Sebelumnya
		</button>
		<span class="text-muted-foreground px-3 text-sm tabular-nums">{current} / {totalPages}</span>
		<button
			type="button"
			onclick={() => (page = Math.min(totalPages, current + 1))}
			disabled={current === totalPages}
			class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
		>
			Berikutnya ›
		</button>
	</div>
{/if}
