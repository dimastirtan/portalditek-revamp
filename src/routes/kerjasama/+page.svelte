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

		<div class="mt-8 space-y-3">
			{#each data.pages as page, i (page.id)}
				<details id={page.slug} class="group scroll-mt-28 rounded-xl border" open={i === 0}>
					<summary
						class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4"
					>
						<span class="font-display text-base font-semibold">{page.title}</span>
						<span class="text-muted-foreground text-sm transition-transform group-open:rotate-90"
							>›</span
						>
					</summary>
					<div class="border-t px-5 py-5">
						<RichContent html={page.html} />
					</div>
				</details>
			{:else}
				<p class="text-muted-foreground text-sm">Data kerja sama teknologi belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
