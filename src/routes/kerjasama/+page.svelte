<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Kerja Sama Teknologi · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil"
			title="Kerja sama teknologi"
			description="Pengalaman dan bentuk kerja sama teknologi Direktorat Teknologi dengan berbagai institusi."
		/>

		<div class="mt-8 space-y-10">
			{#each data.pages as page (page.id)}
				<div id={page.slug} class="scroll-mt-28">
					<h2 class="font-display text-primary border-b pb-2 text-xl font-semibold">
						{page.title}
					</h2>
					<div class="mt-4">
						<RichContent html={page.html} />
					</div>
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Data kerja sama teknologi belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
