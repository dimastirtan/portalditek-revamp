<script lang="ts">
	import Breadcrumb from '$lib/components/shared/breadcrumb.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const headline = $derived(data.headline);
</script>

<svelte:head>
	<title>{headline.title} · Headlines · Directorate of Technology</title>
	<meta name="description" content={headline.excerpt} />
</svelte:head>

<article class="border-b">
	<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
		<Breadcrumb items={[{ label: 'Headlines', href: '/berita-utama' }, { label: headline.title }]} />

		<header class="mt-6">
			<p class="text-primary text-sm font-semibold tracking-wider uppercase">
				Headline · {formatDate(headline.date)}
			</p>
			<h1 class="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
				{headline.title}
			</h1>
			{#if headline.story && headline.story !== headline.title}
				<p class="text-muted-foreground mt-2 text-sm">Part of: {headline.story}</p>
			{/if}
		</header>

		{#if headline.image && !data.inlineImage}
			<div class="bg-muted mt-8 overflow-hidden rounded-xl border">
				<img src={headline.image} alt="" class="mx-auto max-h-[28rem] w-auto object-contain" />
			</div>
		{/if}

		<div class="mt-8 text-base">
			<RichContent html={headline.html} />
		</div>

		{#if data.related.length}
			<section class="mt-12 border-t pt-6">
				<h2 class="font-display text-base font-semibold">More from this story</h2>
				<ul class="mt-3 space-y-2">
					{#each data.related as item (item.id)}
						<li>
							<a href={item.url} class="text-primary text-sm hover:underline">{item.title}</a>
							<span class="text-muted-foreground text-xs tabular-nums"> · {formatDate(item.date)}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<nav class="mt-12 grid gap-3 border-t pt-6 sm:grid-cols-2" aria-label="Other headlines">
			{#if data.newer}
				<a href={data.newer.url} class="group hover:border-primary/40 rounded-lg border p-4 transition-colors">
					<span class="text-muted-foreground inline-flex items-center gap-1 text-xs">
						<ArrowLeft class="size-3.5" /> Newer
					</span>
					<span class="group-hover:text-primary mt-1 block text-sm font-medium">{data.newer.title}</span>
				</a>
			{:else}
				<span></span>
			{/if}
			{#if data.older}
				<a
					href={data.older.url}
					class="group hover:border-primary/40 rounded-lg border p-4 text-right transition-colors"
				>
					<span class="text-muted-foreground inline-flex items-center gap-1 text-xs">
						Older <ArrowRight class="size-3.5" />
					</span>
					<span class="group-hover:text-primary mt-1 block text-sm font-medium">{data.older.title}</span>
				</a>
			{/if}
		</nav>
	</div>
</article>
