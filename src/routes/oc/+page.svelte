<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { FileText, Download } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Operating Certificate · Directorate of Technology</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="OC"
			title="Operating Certificate"
			description="Certificates and the Operating Certificate of PT Dirgantara Indonesia."
		/>

		<div class="mt-8 space-y-3">
			{#each data.sections as sec, i (sec.title)}
				<details class="group rounded-xl border" open={i === 0}>
					<summary
						class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4"
					>
						<span class="font-display text-base font-semibold">{sec.title}</span>
						<span class="text-muted-foreground text-sm transition-transform group-open:rotate-90"
							>›</span
						>
					</summary>
					<div class="divide-y border-t">
						{#each sec.docs as doc (doc.id)}
							<div class="flex items-start gap-3 px-5 py-4">
								<FileText class="text-primary mt-0.5 size-5 shrink-0" />
								<div class="min-w-0 flex-1">
									<p class="font-medium">{doc.title}</p>
									{#if doc.desc}
										<p class="text-muted-foreground mt-0.5 whitespace-pre-line text-sm">{doc.desc}</p>
									{/if}
									{#if doc.url}
										<a
											href={doc.url}
											class="text-primary mt-2 inline-flex items-center gap-1.5 text-sm hover:underline"
										>
											<Download class="size-3.5" /> Download PDF
										</a>
									{/if}
								</div>
							</div>
						{:else}
							<p class="text-muted-foreground px-5 py-6 text-center text-sm">No documents yet.</p>
						{/each}
					</div>
				</details>
			{:else}
				<p class="text-muted-foreground text-sm">No OC documents available yet.</p>
			{/each}
		</div>
	</div>
</section>
