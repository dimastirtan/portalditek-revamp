<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import CatalogTable from '$lib/components/shared/catalog-table.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Regulasi · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Regulation"
			title="Regulasi Sertifikasi Indonesia"
			description="Daftar regulasi sertifikasi kelaikan dari Pemerintah dan kementerian terkait. Klik kategori untuk membuka daftarnya."
		/>

		<div class="mt-8 space-y-3">
			{#each data.sections as sec, i (sec.slug)}
				<details id={sec.slug} class="group scroll-mt-28 rounded-xl border" open={i === 0}>
					<summary
						class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4"
					>
						<span class="font-display text-base font-semibold">{sec.title}</span>
						<span class="text-muted-foreground text-xs tabular-nums">{sec.rows.length} regulasi</span>
					</summary>
					<div class="border-t px-5 py-5">
						<CatalogTable columns={sec.columns} rows={sec.rows} />
					</div>
				</details>
			{:else}
				<p class="text-muted-foreground text-sm">Data regulasi belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
