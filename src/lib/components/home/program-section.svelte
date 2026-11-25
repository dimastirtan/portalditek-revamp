<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import ProgramCard from '$lib/components/shared/program-card.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import type { ImsProgram } from '$lib/types/content';

	let { programs }: { programs: ImsProgram[] } = $props();
</script>

<!-- Disembunyikan bila IMS belum dikonfigurasi / tidak terjangkau. -->
{#if programs.length}
	<section id="program" class="border-b">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
			<SectionHeading
				eyebrow="R&D Programs"
				title="Aircraft Program Progress"
				description="Project and certification summary for each program, sourced from the Intelligent Management System (IMS)."
			>
				{#snippet action()}
					<a
						href="/program"
						class="text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline"
					>
						View all
						<ArrowRight class="size-4" />
					</a>
				{/snippet}
			</SectionHeading>

			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{#each programs as program (program.id)}
					<ProgramCard {program} />
				{/each}
			</div>
		</div>
	</section>
{/if}
