<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { Library, ArrowRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Our Library · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Our Library"
			title="Our Library"
			description="Katalog perpustakaan dan dokumentasi Direktorat Teknologi."
		/>

		<div class="mt-8 grid gap-4 sm:grid-cols-2">
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
							<p class="text-muted-foreground mt-2 text-xs tabular-nums">{cat.count} entri</p>
						{/if}
					</div>
					<ArrowRight
						class="text-muted-foreground mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
					/>
				</a>
			{:else}
				<p class="text-muted-foreground text-sm">Katalog belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
