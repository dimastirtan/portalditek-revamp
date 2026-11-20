<script lang="ts">
	import { SITE } from '$lib/config/site';
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { CalendarDays, Expand } from '@lucide/svelte';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
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
			description="Working days, national holidays, and collective leave of the Directorate of Technology and Development."
		/>

		{#if data.calendar}
			<!-- Gambar kalender dari unggahan admin (UPLOAD_DIR/kalender, berkas terbaru). -->
			<figure class="mt-8">
				<a
					href={data.calendar.src}
					target="_blank"
					rel="noopener"
					class="group bg-card relative block overflow-hidden rounded-xl border"
					title="Open full size"
				>
					<img
						src={data.calendar.src}
						alt="Work calendar of the Directorate of Technology and Development"
						class="mx-auto h-auto w-full max-w-5xl"
					/>
					<span
						class="bg-background/85 absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
					>
						<Expand class="size-3.5" />
						Full size
					</span>
				</a>
				<figcaption class="text-muted-foreground mt-3 text-sm">
					Updated {formatDate(data.calendar.updated)} · Click the calendar to open it at full size.
				</figcaption>
			</figure>
		{:else}
			<div
				class="text-muted-foreground mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center"
			>
				<CalendarDays class="size-10 opacity-50" />
				<p class="text-sm">The work calendar has not been uploaded yet.</p>
			</div>
		{/if}
	</div>
</section>
