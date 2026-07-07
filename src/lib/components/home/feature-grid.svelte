<script lang="ts">
	import { SYSTEMS } from '$lib/data/nav';
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { ArrowUpRight } from '@lucide/svelte';
</script>

<section id="sistem" class="bg-secondary/30 border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Sistem"
			title="Sistem internal direktorat"
			description="Akses cepat ke aplikasi dan layanan yang digunakan sehari-hari di lingkungan Direktorat Teknologi dan Pengembangan."
		/>

		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each SYSTEMS as sys (sys.id)}
				<a
					href={sys.href}
					target={sys.external ? '_blank' : undefined}
					rel={sys.external ? 'noopener' : undefined}
					class="group bg-card hover:border-primary/40 relative flex flex-col rounded-xl border p-6 transition-all hover:shadow-sm"
				>
					<div class="flex items-start justify-between">
						<h3
							class="font-display group-hover:text-primary text-lg font-semibold transition-colors"
						>
							{sys.label}
						</h3>
						<ArrowUpRight
							class="text-muted-foreground group-hover:text-primary size-5 transition-colors"
						/>
					</div>
					<p class="text-muted-foreground mt-2 text-sm leading-relaxed">{sys.description}</p>
				</a>
			{/each}
		</div>
	</div>
</section>
