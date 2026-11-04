<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import Breadcrumb from '$lib/components/shared/breadcrumb.svelte';
	import StatTile from '$lib/components/shared/stat-tile.svelte';
	import ProgressBar from '$lib/components/shared/progress-bar.svelte';
	import StatusBadge from '$lib/components/shared/status-badge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ChevronRight, ExternalLink } from '@lucide/svelte';
	import { IMS_URL, imsProgramUrl, imsProjectUrl } from '$lib/config/ims';
	import { formatPercent } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const program = $derived(data.program);

	// Gambar gagal dimuat (file tidak ada) → banner disembunyikan. Disimpan per URL
	// supaya pindah ke program lain (komponen yang sama) mencoba gambarnya lagi.
	let failedImage = $state('');
</script>

<svelte:head>
	<title>{program?.name ?? 'Program'} · Program R&D · Direktorat Teknologi</title>
</svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
		<Breadcrumb
			items={[{ label: 'Program R&D', href: '/program' }, { label: program?.name ?? 'Program' }]}
		/>

		{#if program}
			<div class="mt-6">
				<SectionHeading eyebrow="Program R&D" title={program.name} description={program.description}>
					{#snippet action()}
						<Button
							href={imsProgramUrl(program.name)}
							target="_blank"
							rel="noopener"
							variant="outline"
						>
							Buka di IMS
							<ExternalLink class="size-4" />
						</Button>
					{/snippet}
				</SectionHeading>
			</div>

			{#if program.image && program.image !== failedImage}
				<div class="bg-muted mt-8 aspect-[2/1] overflow-hidden rounded-xl border sm:aspect-[3/1]">
					<img
						src={program.image}
						alt={program.name}
						decoding="async"
						onerror={() => (failedImage = program.image)}
						class="size-full object-cover"
					/>
				</div>
			{/if}

			<div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<StatTile label="Total proyek" value={program.total} />
				<StatTile label="Berjalan" value={program.onProgress} />
				<StatTile label="Selesai" value={program.completed} />
				<StatTile label="Bermasalah" value={program.problem} />
			</div>

			<div class="bg-card mt-8 overflow-hidden rounded-xl border">
				<div
					class="text-muted-foreground hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)_10rem_13rem] gap-4 border-b px-5 py-3 text-xs font-medium tracking-wider uppercase md:grid"
				>
					<span>Proyek</span>
					<span>Customer · kategori · tahap</span>
					<span>Progres</span>
					<span>Status</span>
				</div>

				{#each program.projects as p (p.id)}
					<details class="group border-b last:border-b-0">
						<summary
							class="hover:bg-accent/50 grid cursor-pointer list-none gap-x-4 gap-y-2 px-5 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_10rem_13rem] md:items-center"
						>
							<span class="flex items-center gap-2 font-semibold">
								<ChevronRight
									class="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90"
								/>
								{p.name}
								{#if p.problem}
									<span
										class="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-medium"
									>
										Bermasalah
									</span>
								{/if}
							</span>
							<span class="text-muted-foreground text-sm">
								{[p.customer, p.category, p.stage].filter(Boolean).join(' · ') ||
									'Belum dilengkapi di IMS'}
							</span>
							<span>
								<ProgressBar value={p.progress} />
								<span class="text-muted-foreground mt-1 block text-xs tabular-nums">
									{formatPercent(p.progress)}%
								</span>
							</span>
							<span><StatusBadge status={p.status} /></span>
						</summary>

						<div class="bg-muted/30 border-t px-5 py-5">
							<p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
								Tahap sertifikasi
							</p>
							{#if p.stages.length}
								<ol class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
									{#each p.stages as s (s.step)}
										<li class="bg-card rounded-lg border p-3">
											<p class="text-muted-foreground text-xs">Tahap {s.step}</p>
											<p class="text-sm leading-snug font-medium">{s.name}</p>
											<ProgressBar value={s.progress} class="mt-2" />
											<p class="text-muted-foreground mt-1 text-xs tabular-nums">
												{formatPercent(s.progress)}%
												{#if s.docsTotal}
													· {s.docsApproved}/{s.docsTotal} dokumen disetujui
												{/if}
											</p>
										</li>
									{/each}
								</ol>
							{:else}
								<p class="text-muted-foreground mt-2 text-sm">Tahap sertifikasi belum diisi di IMS.</p>
							{/if}

							<div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
								{#if p.code && p.code !== p.name}
									<span><span class="text-muted-foreground">Kode:</span> {p.code}</span>
								{/if}
								{#if p.classChange}
									<span>
										<span class="text-muted-foreground">Class change:</span>
										{p.classChange}
									</span>
								{/if}
								<a
									href={imsProjectUrl(p.id)}
									target="_blank"
									rel="noopener"
									class="text-primary inline-flex items-center gap-1 hover:underline"
								>
									Lihat dokumen di IMS
									<ExternalLink class="size-3.5" />
								</a>
							</div>
						</div>
					</details>
				{:else}
					<p class="text-muted-foreground px-5 py-8 text-center text-sm">
						Belum ada proyek di program ini.
					</p>
				{/each}
			</div>

			<p class="text-muted-foreground mt-4 text-xs">
				Daftar dokumen dan penanggung jawab hanya tersedia di IMS (perlu login). Data diperbarui
				tiap 15 menit.
			</p>
		{:else}
			<div class="bg-card mt-8 rounded-xl border p-8 text-center">
				<p class="font-medium">Data IMS belum bisa dimuat</p>
				<p class="text-muted-foreground mt-1 text-sm">
					Coba lagi beberapa saat lagi, atau
					<a href={IMS_URL} target="_blank" rel="noopener" class="text-primary hover:underline"
						>buka langsung di IMS</a
					>.
				</p>
			</div>
		{/if}
	</div>
</section>
