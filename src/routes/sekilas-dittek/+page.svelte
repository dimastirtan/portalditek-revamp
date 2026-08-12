<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { imgUrl } from '$lib/utils';
	import { ImageOff } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const PAGE_SIZE = 12;
	let page = $state(1);
	const totalPages = $derived(Math.max(1, Math.ceil(data.items.length / PAGE_SIZE)));
	const current = $derived(Math.min(page, totalPages));
	const paged = $derived(data.items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE));
</script>

<svelte:head><title>Sekilas Dittek · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Pojok Media"
			title="Sekilas Dittek"
			description="Dokumentasi kegiatan dan momen Direktorat Teknologi dan Pengembangan."
		/>

		<div class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
			{#each paged as item (item.id)}
				<figure class="bg-card overflow-hidden rounded-xl border">
					<div class="bg-muted text-muted-foreground/40 relative flex aspect-[4/3] items-center justify-center">
						{#if item.file}
							<img
								src={imgUrl(item.file, 'sekilas')}
								alt={item.caption}
								loading="lazy"
								class="absolute inset-0 h-full w-full object-cover"
							/>
						{/if}
						<ImageOff class="size-6" />
					</div>
					<figcaption class="p-3 text-xs leading-snug">{item.caption}</figcaption>
				</figure>
			{:else}
				<p class="text-muted-foreground col-span-full text-sm">Belum ada dokumentasi.</p>
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="mt-8 flex items-center justify-center gap-1">
				<button
					type="button"
					onclick={() => (page = Math.max(1, current - 1))}
					disabled={current === 1}
					class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
				>
					‹ Sebelumnya
				</button>
				<span class="text-muted-foreground px-3 text-sm tabular-nums">{current} / {totalPages}</span>
				<button
					type="button"
					onclick={() => (page = Math.min(totalPages, current + 1))}
					disabled={current === totalPages}
					class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
				>
					Berikutnya ›
				</button>
			</div>
		{/if}
	</div>
</section>
