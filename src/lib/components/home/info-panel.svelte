<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import BulletinGallery from './bulletin-gallery.svelte';
	import { Newspaper } from '@lucide/svelte';
	import type { Bulletin } from '$lib/types/content';

	/**
	 * Information center = poster buletin (maks. 3, dari UPLOAD_DIR/buletin).
	 * Kartu Articles / Events / Downloads disembunyikan atas permintaan manager
	 * (2026-11-23) — kodenya ada di riwayat git (commit 2513090) bila dibutuhkan lagi.
	 */
	let { bulletins = [] }: { bulletins?: Bulletin[] } = $props();
</script>

<section id="informasi" class="bg-secondary/30 border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Information"
			title="Information center"
			description="Latest bulletins from the Directorate of Technology and Development."
		/>

		<div class="mt-10">
			{#if bulletins.length}
				<BulletinGallery items={bulletins} />
			{:else}
				<div
					class="text-muted-foreground mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-14 text-center"
				>
					<Newspaper class="size-9 opacity-50" />
					<p class="text-sm">No bulletins have been published yet.</p>
				</div>
			{/if}
		</div>
	</div>
</section>
