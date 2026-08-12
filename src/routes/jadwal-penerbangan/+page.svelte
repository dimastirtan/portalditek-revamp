<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import CatalogTable from '$lib/components/shared/catalog-table.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Jadwal Penerbangan · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading eyebrow="Information" title={data.jadwal.title} description={data.jadwal.description} />
		<div class="mt-8">
			<CatalogTable columns={data.jadwal.columns} rows={data.jadwal.rows} pageSize={20} />
		</div>
	</div>
</section>
