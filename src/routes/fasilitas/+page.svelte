<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Fasilitas · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil"
			title="Fasilitas"
			description="Fasilitas pengujian Direktorat Teknologi dan Pengembangan."
		/>

		<div id="ground-test" class="mt-8 scroll-mt-28">
			<h2 class="font-display text-primary border-b pb-2 text-xl font-semibold">Ground Test</h2>
			<div class="mt-4 space-y-3">
				{#each data.ground as item (item.id)}
					<details class="group rounded-lg border">
						<summary
							class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium"
						>
							{item.title}
							<span class="text-muted-foreground text-xs group-open:rotate-90">›</span>
						</summary>
						<div class="border-t px-4 py-4">
							<RichContent html={item.html} />
						</div>
					</details>
				{:else}
					<p class="text-muted-foreground text-sm">Data Ground Test belum tersedia.</p>
				{/each}
			</div>
		</div>

		<div id="flight-test" class="mt-12 scroll-mt-28">
			<h2 class="font-display text-primary border-b pb-2 text-xl font-semibold">Flight Test</h2>
			<div class="mt-4 space-y-4">
				{#each data.flight as item (item.id)}
					<div>
						<h3 class="font-medium">{item.title}</h3>
						<div class="mt-2"><RichContent html={item.html} /></div>
					</div>
				{:else}
					<p class="text-muted-foreground text-sm">Data Flight Test belum tersedia.</p>
				{/each}
			</div>
		</div>
	</div>
</section>
