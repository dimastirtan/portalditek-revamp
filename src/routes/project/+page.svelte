<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Project N219 · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil · Project"
			title="Project N219"
			description="N219 — pesawat nasional hasil pengembangan PT Dirgantara Indonesia."
		/>

		<div class="mt-8 space-y-10">
			{#each data.sections as sec (sec.id)}
				<div id={sec.slug} class="scroll-mt-28">
					<h2 class="font-display text-primary border-b pb-2 text-xl font-semibold">{sec.title}</h2>
					<div class="mt-4"><RichContent html={sec.html} /></div>
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Data project belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
