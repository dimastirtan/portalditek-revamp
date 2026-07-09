<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Berita Utama · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Pojok Media"
			title="Indeks berita utama"
			description="Sorotan utama Direktorat Teknologi beserta artikel-artikel terkaitnya."
		/>

		<div class="mt-8 space-y-6">
			{#each data.groups as group (group.id)}
				<article class="rounded-xl border p-5">
					<p class="text-muted-foreground text-xs tabular-nums">{formatDate(group.date)}</p>
					<h2 class="font-display mt-1 text-lg font-semibold">{group.title}</h2>

					{#if group.items.length}
						<div class="mt-3 divide-y border-t">
							{#each group.items as item (item.id)}
								<details class="group/item">
									<summary
										class="hover:text-primary flex cursor-pointer list-none items-center gap-2 py-2.5 text-sm"
									>
										<span class="text-primary">›</span>
										<span class="group-open/item:font-medium">{item.title}</span>
									</summary>
									<div class="pb-4 pl-5">
										<RichContent html={item.html} />
									</div>
								</details>
							{/each}
						</div>
					{/if}
				</article>
			{:else}
				<p class="text-muted-foreground text-center text-sm">Belum ada berita utama.</p>
			{/each}
		</div>
	</div>
</section>
