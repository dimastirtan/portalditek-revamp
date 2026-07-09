<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { User } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Struktur Organisasi · Direktorat Teknologi</title></svelte:head>

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
					<h2 class="font-display text-base font-semibold leading-snug">{unit.title}</h2>
					{#if unit.head}
						<p class="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
							<User class="size-3.5" />{unit.head}
						</p>
					{/if}

					{#if unit.departments.length}
						<ul class="mt-4 space-y-2.5 border-t pt-4">
							{#each unit.departments as dep (dep.id)}
								<li class="text-sm">
									<span class="font-medium">{dep.title}</span>
									{#if dep.head}
										<span class="text-muted-foreground block text-xs">{dep.head}</span>
									{/if}
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
