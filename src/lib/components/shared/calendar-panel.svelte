<script lang="ts">
	import { CalendarDays, ArrowRight } from '@lucide/svelte';

	// Panel di topbar tidak punya data server sendiri: ambil langsung gambar kalender
	// terbaru (endpoint selalu validasi ulang, jadi unggahan baru langsung tampil).
	let failed = $state(false);
</script>

<div class="flex h-full flex-col">
	<div class="border-b p-4">
		<h2 class="font-display font-semibold tracking-tight">Calendar</h2>
		<p class="text-muted-foreground text-sm">Work calendar and public holidays.</p>
	</div>
	<div class="flex-1 overflow-y-auto p-4">
		{#if failed}
			<div
				class="text-muted-foreground flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center"
			>
				<CalendarDays class="size-8 opacity-50" />
				<p class="text-sm">The work calendar has not been uploaded yet.</p>
			</div>
		{:else}
			<a href="/kalender-kerja/" class="block overflow-hidden rounded-lg border">
				<img
					src="/kalender-kerja/gambar"
					alt="Work calendar of the Directorate of Technology and Development"
					class="h-auto w-full"
					onerror={() => (failed = true)}
				/>
			</a>
			<a
				href="/kalender-kerja/"
				class="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
			>
				Open work calendar
				<ArrowRight class="size-4" />
			</a>
		{/if}
	</div>
</div>
