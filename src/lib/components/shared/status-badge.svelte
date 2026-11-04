<script lang="ts">
	import { cn } from '$lib/utils';

	/** Status teks bebas dari IMS (mis. 'On Progress Over Target'); kosong → '—'. */
	let { status }: { status: string } = $props();

	// Warna ditentukan dari kata kunci karena IMS tidak punya daftar status baku.
	const tone = $derived(
		!status
			? 'bg-muted text-muted-foreground'
			: /over target|delay|terlambat/i.test(status)
				? 'bg-warning/15 text-warning'
				: /complete|selesai|done/i.test(status)
					? 'bg-success/15 text-success'
					: 'bg-primary/10 text-primary'
	);
</script>

<span
	class={cn(
		'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
		tone
	)}
>
	{status || '—'}
</span>
