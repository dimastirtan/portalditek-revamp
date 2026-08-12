<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { ExternalLink } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Link / Taut · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Link"
			title="Link / Taut"
			description="Tautan ke situs eksternal dan sistem internal PT Dirgantara Indonesia."
		/>

		<div class="mt-8 space-y-8">
			{#each data.groups as group (group.title)}
				<div>
					<h2 class="font-display text-primary border-b pb-2 text-lg font-semibold">
						{group.title}
					</h2>
					<ul class="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
						{#each group.items as item (item.id)}
							<li>
								<a
									href={item.url}
									target={item.external ? '_blank' : undefined}
									rel={item.external ? 'noopener' : undefined}
									class="text-primary inline-flex items-center gap-1.5 py-1 text-sm hover:underline"
								>
									{item.desc}
									{#if item.external}
										<ExternalLink class="size-3 opacity-60" />
									{/if}
								</a>
							</li>
						{:else}
							<li class="text-muted-foreground text-sm">Belum ada tautan.</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<p class="text-muted-foreground mt-8 text-xs">
			Tautan <b>Internal PT DI</b> mengarah ke host jaringan kantor (mis. <code>dittek</code>,
			<code>10.1.x</code>) sehingga hanya dapat dibuka dari dalam jaringan PT DI.
		</p>
	</div>
</section>
