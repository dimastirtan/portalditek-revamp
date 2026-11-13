<script lang="ts">
	import ProgressBar from './progress-bar.svelte';
	import { Plane } from '@lucide/svelte';
	import { formatPercent } from '$lib/utils';
	import type { ImsProgram } from '$lib/types/content';

	let { program }: { program: ImsProgram } = $props();

	// Gambar gagal dimuat (file tidak ada) → kartu tampil tanpa gambar.
	let imageFailed = $state(false);
</script>

<a
	href="/program/{program.slug}"
	class="group bg-card hover:border-primary/40 flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-sm"
>
	<div class="bg-muted flex aspect-[16/9] items-center justify-center overflow-hidden border-b">
		{#if program.image && !imageFailed}
			<img
				src={program.image}
				alt={program.name}
				loading="lazy"
				decoding="async"
				onerror={() => (imageFailed = true)}
				class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		{:else}
			<Plane class="text-muted-foreground/40 size-10" aria-hidden="true" />
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-5">
		<div class="flex items-start justify-between gap-2">
			<h3
				class="font-display group-hover:text-primary text-lg leading-tight font-semibold transition-colors"
			>
				{program.name}
			</h3>
			{#if program.problem}
				<span
					class="bg-destructive/10 text-destructive shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
				>
					{program.problem} with issues
				</span>
			{/if}
		</div>
		{#if program.description}
			<p class="text-muted-foreground mt-1 line-clamp-1 text-sm">{program.description}</p>
		{/if}

		<div class="mt-auto pt-5">
			{#if program.total}
				<p class="text-sm">
					<span class="font-semibold tabular-nums">{program.total}</span> projects ·
					<span class="tabular-nums">{program.onProgress}</span> in progress
				</p>
				<ProgressBar value={program.avgProgress} class="mt-2" />
				<p class="text-muted-foreground mt-1 text-xs">
					Average progress {formatPercent(program.avgProgress)}%
				</p>
			{:else}
				<p class="text-muted-foreground text-sm">No projects registered yet</p>
			{/if}
		</div>
	</div>
</a>
