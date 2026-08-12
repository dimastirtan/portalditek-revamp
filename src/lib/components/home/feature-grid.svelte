<script lang="ts">
	import { SYSTEMS } from '$lib/data/nav';
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { ArrowUpRight } from '@lucide/svelte';

	// Monogram fallback bila logo aplikasi belum ada.
	function monogram(label: string): string {
		const words = label.trim().split(/\s+/);
		if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
		return label.slice(0, 3).toUpperCase();
	}
</script>

<section id="sistem" class="bg-secondary/30 border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Sistem"
			title="Sistem internal direktorat"
			description="Akses cepat ke aplikasi dan layanan yang digunakan sehari-hari di lingkungan Direktorat Teknologi dan Pengembangan."
		/>

		<div class="mt-8 grid gap-4 grid-cols-5 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{#each SYSTEMS as sys (sys.id)}
				<a
					href={sys.href}
					target={sys.external ? '_blank' : undefined}
					rel={sys.external ? 'noopener' : undefined}
					class="group bg-card hover:border-primary/40 relative items-start gap-4 rounded-xl border p-6 transition-all hover:shadow-sm"
				>
					<!-- Logo aplikasi (fallback ke monogram) -->
					<div
						class="border-primary/15 bg-primary/10 text-primary relative size-20 shrink-0 overflow-hidden rounded-lg border text-sm font-bold tracking-tight min-w-36 min-h-36 flex items-center justify-center"
					>
						{monogram(sys.label)}
						{#if sys.logo}
							<img
								src={sys.logo}
								alt={sys.label}
								loading="lazy"
								onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
								class="absolute inset-0 h-full w-full bg-white object-contain p-1"
							/>
						{/if}
					</div>

					<div class="mt-3">
						<div class="flex items-start justify-center gap-2">
							<h3
								class="font-display group-hover:text-primary text-lg font-semibold leading-tight transition-colors"
							>
								{sys.label}
							</h3>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
