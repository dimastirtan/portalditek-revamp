<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { Phone } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Telepon Penting · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Information"
			title="Daftar telepon penting"
			description="Nomor telepon penting internal PT DI, area Bandung, dan nasional."
		/>

		<div class="mt-8 grid gap-6 md:grid-cols-3">
			{#each data.groups as group (group.title)}
				<div class="bg-card overflow-hidden rounded-xl border">
					<div class="bg-muted/60 flex items-center gap-2 px-4 py-2.5">
						<Phone class="text-primary size-4" />
						<h2 class="font-display text-sm font-semibold">{group.title}</h2>
					</div>
					<ul class="divide-y">
						{#each group.items as item (item.id)}
							<li class="flex items-start justify-between gap-3 px-4 py-2.5 text-sm">
								<span>{item.title}</span>
								<span class="text-muted-foreground shrink-0 font-medium tabular-nums">{item.no}</span>
							</li>
						{:else}
							<li class="text-muted-foreground px-4 py-6 text-center text-sm">Belum ada data.</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
