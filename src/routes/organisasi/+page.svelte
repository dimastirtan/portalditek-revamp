<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { User } from '@lucide/svelte';
	import { imgUrl } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// 'blank.jpg' di database = placeholder (tidak ada foto).
	const hasFoto = (f: string) => !!f && f.toLowerCase() !== 'blank.jpg';

	// Puncak tree = unit pimpinan (C_TYPE_ORG 0); di bawahnya pusat/divisi.
	// Tanpa unit pimpinan (data tidak lengkap) → divisi tampil tanpa garis ke atas.
	const roots = $derived(data.units.filter((u) => u.level === 0));
	const divisions = $derived(data.units.filter((u) => u.level === 1));
	const hasRoot = $derived(roots.length > 0);
</script>

<svelte:head><title>Organization · Directorate of Technology</title></svelte:head>

{#snippet avatar(foto: string, name: string, size: string)}
	<div
		class="bg-muted text-muted-foreground/50 relative grid {size} shrink-0 place-items-center overflow-hidden rounded-full"
	>
		{#if hasFoto(foto)}
			<img
				src={imgUrl(foto, 'org')}
				alt={name}
				loading="lazy"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		{/if}
		<User class="size-1/2" />
	</div>
{/snippet}

<!-- Satu kotak di tree: jabatan (tebal) + nama pejabat. -->
{#snippet node(title: string, head: string, foto: string, size: 'lg' | 'md' | 'sm')}
	<div
		class="bg-card relative flex items-center gap-3 rounded-xl border {size === 'lg'
			? 'border-primary/40 p-4 shadow-sm'
			: size === 'md'
				? 'border-primary/25 p-3'
				: 'p-2.5'}"
	>
		{@render avatar(foto, head || title, size === 'lg' ? 'size-14' : size === 'md' ? 'size-11' : 'size-8')}
		<div class="min-w-0">
			<p class="leading-snug font-semibold {size === 'sm' ? 'text-xs' : 'text-sm'}">{title || head}</p>
			{#if head && title}
				<p class="text-muted-foreground mt-0.5 text-xs">{head}</p>
			{/if}
		</div>
	</div>
{/snippet}

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profile"
			title="Organization structure"
			description="Organization chart of the Directorate of Technology and Development and the head of each unit."
		/>

		{#if data.units.length}
			<div class="mt-10" aria-label="Organization chart">
				{#each roots as root (root.id)}
					<!-- Pimpinan; departemen staf langsung di bawah pimpinan tampil di sampingnya. -->
					<div class="grid items-start gap-4 xl:grid-cols-[1fr_minmax(0,22rem)_1fr] xl:gap-0">
						<!-- Sel pimpinan setinggi baris (kotak staf bisa lebih tinggi) → garis turun tetap menyambung. -->
						<div class="flex flex-col items-center xl:col-start-2 xl:self-stretch">
							<div class="w-full">{@render node(root.title, root.head, root.foto, 'lg')}</div>
							{#if divisions.length}
								<div class="bg-border hidden w-px flex-1 xl:block" aria-hidden="true"></div>
							{/if}
						</div>
						{#if root.departments.length}
							<div
								class="xl:before:border-border relative xl:col-start-3 xl:pl-8 xl:before:absolute xl:before:top-10 xl:before:left-0 xl:before:w-8 xl:before:border-t"
							>
								<div class="rounded-xl border border-dashed p-3">
									<p class="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
										Reports to the director
									</p>
									<ul class="space-y-2">
										{#each root.departments as dep (dep.id)}
											<li>
												{@render node(dep.title, dep.head, dep.foto, 'sm')}
											</li>
										{/each}
									</ul>
								</div>
							</div>
						{/if}
					</div>
					{#if divisions.length}
						<!-- Garis turun dari pimpinan ke baris divisi. -->
						<div class="bg-border ml-6 h-8 w-px xl:mx-auto" aria-hidden="true"></div>
					{/if}
				{/each}

				<!--
					Divisi: < xl pohon vertikal (garis kiri + cabang ke tiap kotak);
					≥ xl berjajar dengan garis horizontal di atas & garis turun ke tiap divisi.
				-->
				<ol
					class="grid gap-6 xl:grid-cols-[repeat(var(--cols),minmax(0,1fr))] xl:gap-4 {hasRoot
						? 'border-border ml-6 border-l pl-6 xl:ml-0 xl:border-l-0 xl:pl-0'
						: 'sm:grid-cols-2'}"
					style="--cols: {Math.max(1, divisions.length)}"
				>
					{#each divisions as unit (unit.id)}
						<li
							class="relative {hasRoot
								? 'before:border-border after:border-border before:absolute before:top-9 before:-left-6 before:w-6 before:border-t xl:pt-8 xl:before:top-0 xl:before:-right-2 xl:before:-left-2 xl:before:w-auto xl:first:before:left-1/2 xl:last:before:right-1/2 xl:after:absolute xl:after:top-0 xl:after:left-1/2 xl:after:h-8 xl:after:border-l'
								: ''}"
						>
							{@render node(unit.title, unit.head, unit.foto, 'md')}
							{#if unit.departments.length}
								<ul class="border-border mt-3 ml-5 space-y-2 border-l pl-4">
									{#each unit.departments as dep (dep.id)}
										<li
											class="before:border-border relative before:absolute before:top-1/2 before:-left-4 before:w-4 before:border-t"
										>
											{@render node(dep.title, dep.head, dep.foto, 'sm')}
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ol>
			</div>
		{:else}
			<p class="text-muted-foreground mt-8 text-sm">No organization data available yet.</p>
		{/if}
	</div>
</section>
