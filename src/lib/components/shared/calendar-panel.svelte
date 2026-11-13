<script lang="ts">
	import { SITE } from '$lib/config/site';
</script>

<div class="flex h-full flex-col">
	<div class="border-b p-4">
		<h2 class="font-display font-semibold tracking-tight">Calendar</h2>
		<p class="text-muted-foreground text-sm">Work calendar and public holidays.</p>
	</div>
	<div class="flex-1 overflow-hidden">
		<iframe
			src={SITE.calendarIframeSrc}
			title="Directorate calendar"
			class="h-full w-full border-0"
			loading="lazy"
		></iframe>
	</div>
</div>
