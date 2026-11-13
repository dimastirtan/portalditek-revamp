<script lang="ts">
	import { SITE } from '$lib/config/site';
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
</script>

<svelte:head>
	<title>Work Calendar · {SITE.shortName}</title>
	<meta name="description" content="Work calendar and public holidays of the Directorate of Technology." />
</svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Information"
			title="Work calendar"
			description="National holidays, collective leave, and directorate events. Click a date to see its details."
		/>

		<div class="bg-card mt-8 overflow-hidden rounded-xl border">
			<div class="relative aspect-[4/3] w-full sm:aspect-[16/9]">
				<iframe
					src={SITE.calendarIframeSrc}
					title="Directorate of Technology work calendar"
					class="absolute inset-0 h-full w-full"
					style="border:0"
					loading="lazy"
				></iframe>
			</div>
		</div>

		<!-- <p class="text-muted-foreground mt-4 text-sm">
			Kalender ini menampilkan hari libur nasional Indonesia. Bila kalender resmi direktorat sudah
			tersedia, ganti <code>calendarIframeSrc</code> di
			<code>src/lib/config/site.ts</code> dengan Calendar ID direktorat.
		</p> -->
	</div>
</section>