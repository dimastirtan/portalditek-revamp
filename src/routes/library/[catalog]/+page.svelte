<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import CatalogTable from '$lib/components/shared/catalog-table.svelte';
	import { ChevronLeft } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{data.catalog.title} · Our Library</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<a
			href="/library"
			class="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm"
		>
			<ChevronLeft class="size-4" /> Our Library
		</a>

		<SectionHeading eyebrow="Our Library" title={data.catalog.title} description={data.catalog.description} />

		<div class="mt-8">
			<CatalogTable columns={data.catalog.columns} rows={data.catalog.rows} />
		</div>
	</div>
</section>
