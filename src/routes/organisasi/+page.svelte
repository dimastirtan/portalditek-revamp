<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { User } from '@lucide/svelte';
	import { imgUrl } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// 'blank.jpg' di database = placeholder (tidak ada foto).
	const hasFoto = (f: string) => !!f && f.toLowerCase() !== 'blank.jpg';
</script>

<svelte:head><title>Struktur Organisasi · Direktorat Teknologi</title></svelte:head>

{#snippet avatar(foto: string, name: string, size: string)}
	<div class="bg-muted text-muted-foreground/50 relative grid {size} shrink-0 place-items-center overflow-hidden rounded-full">
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

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil"
			title="Struktur organisasi"
			description="Struktur organisasi Direktorat Teknologi dan Pengembangan beserta pejabat pada tiap unit."
		/>

		<div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.units as unit (unit.id)}
				<div class="bg-card flex flex-col rounded-xl border p-5">
					<div class="flex items-start gap-3">
						{@render avatar(unit.foto, unit.head || unit.title, 'size-12')}
						<div class="min-w-0">
							<h2 class="font-display text-base font-semibold leading-snug">{unit.title}</h2>
							{#if unit.head}
								<p class="text-muted-foreground mt-0.5 text-sm">{unit.head}</p>
							{/if}
						</div>
					</div>

					{#if unit.departments.length}
						<ul class="mt-4 space-y-3 border-t pt-4">
							{#each unit.departments as dep (dep.id)}
								<li class="flex items-start gap-2.5">
									{@render avatar(dep.foto, dep.head || dep.title, 'size-8')}
									<div class="min-w-0 text-sm">
										<span class="font-medium">{dep.title}</span>
										{#if dep.head}
											<span class="text-muted-foreground block text-xs">{dep.head}</span>
										{/if}
									</div>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Data organisasi belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
