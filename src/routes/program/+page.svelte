<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import ProgramCard from '$lib/components/shared/program-card.svelte';
	import StatTile from '$lib/components/shared/stat-tile.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ExternalLink } from '@lucide/svelte';
	import { IMS_URL } from '$lib/config/ims';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const sum = (key: 'total' | 'onProgress' | 'problem') =>
		data.programs.reduce((n, p) => n + p[key], 0);
</script>

<svelte:head><title>R&D Programs · Directorate of Technology</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profile · Project"
			title="R&D Programs"
			description="Project and certification progress for each aircraft program, sourced from the Intelligent Management System (IMS). Updated every 15 minutes."
		>
			{#snippet action()}
				<Button href={IMS_URL} target="_blank" rel="noopener" variant="outline">
					Open IMS
					<ExternalLink class="size-4" />
				</Button>
			{/snippet}
		</SectionHeading>

		{#if data.programs.length}
			<div class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<StatTile label="Programs" value={data.programs.length} />
				<StatTile label="Projects" value={sum('total')} />
				<StatTile label="In progress" value={sum('onProgress')} />
				<StatTile label="With issues" value={sum('problem')} />
			</div>

			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.programs as program (program.id)}
					<ProgramCard {program} />
				{/each}
			</div>
		{:else}
			<div class="bg-card mt-8 rounded-xl border p-8 text-center">
				<p class="font-medium">IMS data could not be loaded</p>
				<p class="text-muted-foreground mt-1 text-sm">
					Please try again shortly, or open IMS directly.
				</p>
			</div>
		{/if}
	</div>
</section>
