<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { Cake } from '@lucide/svelte';
	import type { BirthdayGroup } from '$lib/types/content';

	let { groups = [] }: { groups?: BirthdayGroup[] } = $props();
</script>

<section id="ulang-tahun" class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Personil"
			title="Ulang tahun Direktorat Teknologi"
			description="Ucapkan selamat kepada rekan yang berulang tahun hari ini dan hari-hari berikutnya."
		/>

		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each groups as group (group.date)}
				<div
					class="rounded-xl border p-5 {group.today
						? 'border-primary/40 bg-primary/5'
						: 'bg-card'}"
				>
					<p class="text-sm font-semibold tracking-tight">{group.label}</p>
					<ul class="mt-4 space-y-3">
						{#each group.people as person (person.nik)}
							<li class="flex items-start gap-2.5">
								<Cake class="text-primary mt-0.5 size-4 shrink-0" />
								<span class="text-sm leading-snug">
									<span class="font-medium">{person.name}</span>
									{#if person.org}
										<span class="text-muted-foreground">({person.org})</span>
									{/if}
								</span>
							</li>
						{:else}
							<li class="text-muted-foreground text-sm italic">Tidak ada</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>
