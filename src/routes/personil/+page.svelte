<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import PersonilTable from '$lib/components/shared/personil-table.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Personil · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil · SDM"
			title="Personil Direktorat Teknologi"
			description="Direktori personil Direktorat Teknologi dan Pengembangan. Cari berdasarkan nama atau NIK, atau saring per unit organisasi."
		/>
		<div class="mt-8">
			<PersonilTable people={data.people} />
		</div>
	</div>
</section>
