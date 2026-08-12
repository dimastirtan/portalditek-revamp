<script lang="ts">
	import { SITE } from '$lib/config/site';
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
</script>

<svelte:head>
	<title>Kalender Kerja · {SITE.shortName}</title>
	<meta name="description" content="Kalender kerja dan hari libur Direktorat Teknologi." />
</svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Information"
			title="Kalender kerja"
			description="Hari libur nasional, cuti bersama, dan agenda kerja direktorat. Klik sebuah tanggal untuk melihat detailnya."
		/>

		<div class="bg-card mt-8 overflow-hidden rounded-xl border">
			<div class="relative aspect-[4/3] w-full sm:aspect-[16/9]">
				<iframe
					src={SITE.calendarIframeSrc}
					title="Kalender Kerja Direktorat Teknologi"
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