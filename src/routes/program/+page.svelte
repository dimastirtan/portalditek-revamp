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

<svelte:head><title>Program R&D · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil · Project"
			title="Program R&D"
			description="Progres proyek dan sertifikasi tiap program pesawat, bersumber dari Intelligent Management System (IMS). Data diperbarui tiap 15 menit."
		>
			{#snippet action()}
				<Button href={IMS_URL} target="_blank" rel="noopener" variant="outline">
					Buka IMS
					<ExternalLink class="size-4" />
				</Button>
			{/snippet}
		</SectionHeading>

		{#if data.programs.length}
			<div class="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<StatTile label="Program" value={data.programs.length} />
				<StatTile label="Proyek" value={sum('total')} />
				<StatTile label="Berjalan" value={sum('onProgress')} />
				<StatTile label="Bermasalah" value={sum('problem')} />
			</div>

			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each data.programs as program (program.id)}
					<ProgramCard {program} />
				{/each}
			</div>
		{:else}
			<div class="bg-card mt-8 rounded-xl border p-8 text-center">
				<p class="font-medium">Data IMS belum bisa dimuat</p>
				<p class="text-muted-foreground mt-1 text-sm">
					Coba lagi beberapa saat lagi, atau buka langsung di IMS.
				</p>
			</div>
		{/if}
	</div>
</section>
