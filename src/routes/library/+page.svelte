<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { Library, ArrowRight, FileText, BookOpen } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const totalPublications = $derived(data.categories.reduce((n, c) => n + c.count, 0));
</script>

<svelte:head><title>Library · Directorate of Technology</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Library"
			title="Library"
			description="Library catalogs and online publications of the Directorate of Technology."
		/>

		<nav class="mt-6 flex flex-wrap gap-2" aria-label="Library sections">
			<a href="#catalogs" class="hover:bg-accent rounded-full border px-3 py-1 text-sm">Catalogs</a>
			<a href="#publications" class="hover:bg-accent rounded-full border px-3 py-1 text-sm">
				Online publications
			</a>
		</nav>

		<!-- Katalog (dulu halaman "Our Library") -->
		<div id="catalogs" class="mt-10 scroll-mt-28">
			<h2 class="font-display flex items-center gap-2 text-xl font-semibold">
				<Library class="text-primary size-5" /> Catalogs
			</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				{#each data.catalogs as cat (cat.slug)}
					<a
						href={cat.href ?? `/library/${cat.slug}`}
						class="group bg-card hover:border-primary/40 flex items-start gap-4 rounded-xl border p-5 transition-colors"
					>
						<div class="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg">
							<Library class="size-5" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="font-display font-semibold">{cat.title}</p>
							<p class="text-muted-foreground mt-0.5 text-sm">{cat.description}</p>
							{#if cat.count > 0}
								<p class="text-muted-foreground mt-2 text-xs tabular-nums">{cat.count} entries</p>
							{/if}
						</div>
						<ArrowRight
							class="text-muted-foreground mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
						/>
					</a>
				{:else}
					<p class="text-muted-foreground text-sm">No catalogs available yet.</p>
				{/each}
			</div>
		</div>

		<!-- Online Publication (dulu halaman /online-publication) -->
		<div id="publications" class="mt-14 scroll-mt-28">
			<h2 class="font-display flex items-center gap-2 text-xl font-semibold">
				<BookOpen class="text-primary size-5" /> Online publications
			</h2>
			<p class="text-muted-foreground mt-1 text-sm">
				{#if totalPublications}{totalPublications} publications by field. {/if}Click a category to see
				its publications.
			</p>
			<div class="mt-4 space-y-2">
				{#each data.categories as cat (cat.slug)}
					<details class="group rounded-xl border">
						<summary
							class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5"
						>
							<span class="font-medium">{cat.title}</span>
							<span class="text-muted-foreground text-xs tabular-nums">{cat.count} publications</span>
						</summary>
						<div class="border-t px-5 py-4">
							{#if cat.items.length}
								<ul class="space-y-2">
									{#each cat.items as item (item.id)}
										<li class="text-sm" title={item.file}>
											{#if item.url}
												<a
													href={item.url}
													class="hover:text-primary flex items-start gap-2 hover:underline"
												>
													<FileText class="text-primary mt-0.5 size-4 shrink-0" />
													<span>{item.title}</span>
												</a>
											{:else}
												<span class="text-muted-foreground flex items-start gap-2">
													<FileText class="mt-0.5 size-4 shrink-0" />
													<span>{item.title}</span>
												</span>
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<p class="text-muted-foreground text-sm">No publications yet.</p>
							{/if}
						</div>
					</details>
				{:else}
					<p class="text-muted-foreground text-sm">No publication data available yet.</p>
				{/each}
			</div>
		</div>
	</div>
</section>
