<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import RichContent from '$lib/components/shared/rich-content.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Hak Kekayaan Intelektual · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="HKI"
			title="Hak Kekayaan Intelektual"
			description="Pengertian, organisasi, dan daftar kekayaan intelektual PT Dirgantara Indonesia."
		/>

		<div class="mt-8 space-y-3">
			{#each data.sections as sec (sec.id)}
				<details class="group rounded-xl border">
					<summary
						class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4"
					>
						<span class="font-display text-base font-semibold">{sec.title}</span>
						<span class="text-muted-foreground text-sm transition-transform group-open:rotate-90"
							>›</span
						>
					</summary>
					<div class="border-t px-5 py-5">
						<RichContent html={sec.html} />
					</div>
				</details>
			{:else}
				<p class="text-muted-foreground text-sm">Data HKI belum tersedia.</p>
			{/each}
		</div>
	</div>
</section>
