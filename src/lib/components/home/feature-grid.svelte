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
			eyebrow="Systems"
			title="Directorate Systems"
			description="Quick access to the applications and services used every day across the Directorate of Technology and Development."
		/>

		<div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:justify-items-center sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
			{#each SYSTEMS as sys (sys.id)}
				<a
					href={sys.href}
					target={sys.external ? '_blank' : undefined}
					rel={sys.external ? 'noopener' : undefined}
					class="group bg-card hover:border-primary/40 relative flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm sm:flex-col sm:p-6 min-w-40"
				>
					<!-- Logo aplikasi (fallback ke monogram) -->
					<div
						class="border-primary/15 bg-primary/10 text-primary relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border text-sm font-bold tracking-tight sm:size-30"
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

					<div class="min-w-0 sm:mt-3">
						<div class="flex items-start gap-2 sm:justify-center">
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
