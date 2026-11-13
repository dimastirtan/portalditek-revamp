<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>News · Directorate of Technology</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Media"
			title="News"
			description="News about the Directorate of Technology and PT Dirgantara Indonesia. Click a title to read the full story."
		/>

		<div class="mt-8 divide-y rounded-xl border">
			{#each data.berita as item (item.id)}
				<details class="group">
					<summary
						class="hover:bg-accent/50 flex cursor-pointer list-none items-start gap-3 px-4 py-3.5"
					>
						<span class="text-muted-foreground mt-0.5 shrink-0 text-xs tabular-nums"
							>{formatDate(item.date)}</span
						>
						<span class="font-medium group-open:text-primary">{item.title}</span>
					</summary>
					<div class="border-t px-4 py-4">
						<RichContent html={item.html} />
					</div>
				</details>
			{:else}
				<p class="text-muted-foreground px-4 py-8 text-center text-sm">No news yet.</p>
			{/each}
		</div>
	</div>
</section>
