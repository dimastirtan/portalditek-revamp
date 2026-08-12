<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { formatDate } from '$lib/utils';
	import { ChevronLeft, ChevronRight, ArrowRight } from '@lucide/svelte';
	import type { NewsItem } from '$lib/types/content';

	let { news = [] }: { news?: NewsItem[] } = $props();

	const items = $derived(news);
	const featured = $derived(items.find((n) => n.featured) ?? items[0]);
	const rest = $derived(featured ? items.filter((n) => n.id !== featured.id) : []);

	let track = $state<HTMLDivElement | null>(null);

	function scrollByCard(dir: 1 | -1) {
		if (!track) return;
		const amount = track.clientWidth * 0.8 * dir;
		track.scrollBy({ left: amount, behavior: 'smooth' });
	}
</script>

<section id="berita" class="bg-secondary/30 border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading eyebrow="Berita" title="Berita terkini" />

		<div class="mt-8 grid gap-6 lg:grid-cols-2">
			<!-- Berita utama -->
			{#if featured}
				<a href={featured.url} class="group bg-card flex flex-col overflow-hidden rounded-xl border max-w-xxl">
					{#if featured.image}
					<img
						src={featured.image}
						alt=""
						class="aspect-video w-full object-cover"
						loading="lazy"
					/>
				{:else}
					<div
						class="bg-primary/10 text-primary flex aspect-video w-full items-center justify-center"
						aria-hidden="true"
					>
						<span class="font-display text-sm font-medium tracking-wider uppercase"
							>Berita Utama</span
						>
					</div>
				{/if}
				<div class="flex flex-1 flex-col p-6">
					<p class="text-muted-foreground text-xs">{formatDate(featured.publishedAt)}</p>
					<h3
						class="font-display group-hover:text-primary mt-2 text-xl leading-snug font-semibold tracking-tight transition-colors"
					>
						{featured.title}
					</h3>
					<p class="text-muted-foreground mt-2 text-sm leading-relaxed">{featured.excerpt}</p>
					<span class="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
						Baca selengkapnya
						<ArrowRight class="size-4" />
					</span>
				</div>
				</a>
			{/if}

			<!-- Sekilas berita (carousel) -->
			<div class="flex flex-col max-w-4xl">
				<div class="mb-3 flex items-center justify-between max-w-full">
					<h3 class="font-display text-sm font-semibold tracking-wider uppercase">
						Sekilas berita
					</h3>
					<div class="flex gap-1">
						<button
							type="button"
							onclick={() => scrollByCard(-1)}
							aria-label="Berita sebelumnya"
							class="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md border transition-colors"
						>
							<ChevronLeft class="size-4" />
						</button>
						<button
							type="button"
							onclick={() => scrollByCard(1)}
							aria-label="Berita berikutnya"
							class="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md border transition-colors"
						>
							<ChevronRight class="size-4" />
						</button>
					</div>
				</div>

				<div
					bind:this={track}
					class="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
				>
					{#each rest as item (item.id)}
						<a
							href={item.url}
							class="group bg-card hover:border-primary/40 flex w-64 shrink-0 snap-start flex-col rounded-lg border p-4 transition-colors"
						>
							<p class="text-muted-foreground text-xs">{formatDate(item.publishedAt)}</p>
							<h4
								class="group-hover:text-primary mt-1.5 text-sm leading-snug font-semibold transition-colors"
							>
								{item.title}
							</h4>
							<p class="text-muted-foreground mt-2 line-clamp-3 text-xs leading-relaxed">
								{item.excerpt}
							</p>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
