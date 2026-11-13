<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { Newspaper } from '@lucide/svelte';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Headlines · Directorate of Technology</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Media"
			title="Headlines"
			description="Top stories from the Directorate of Technology, newest first."
		/>

		<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.headlines as item (item.id)}
				<a
					href={item.url}
					class="group bg-card hover:border-primary/40 flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-sm"
				>
					<div class="bg-muted flex aspect-video items-center justify-center overflow-hidden border-b">
						{#if item.image}
							<!-- Gambar lama kecil (± 500 px) → contain, bukan cover, supaya tidak terpotong/pecah. -->
							<img src={item.image} alt="" loading="lazy" class="size-full object-contain" />
						{:else}
							<Newspaper class="text-muted-foreground/40 size-10" aria-hidden="true" />
						{/if}
					</div>
					<div class="flex flex-1 flex-col p-5">
						<p class="text-muted-foreground text-xs tabular-nums">{formatDate(item.date)}</p>
						<h2
							class="font-display group-hover:text-primary mt-1 text-lg leading-snug font-semibold transition-colors"
						>
							{item.title}
						</h2>
						{#if item.excerpt}
							<p class="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
								{item.excerpt}
							</p>
						{/if}
					</div>
				</a>
			{:else}
				<p class="text-muted-foreground text-sm">No headlines yet.</p>
			{/each}
		</div>
	</div>
</section>
