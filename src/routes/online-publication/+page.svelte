<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { FileText } from '@lucide/svelte';
	import { docUrl } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Online Publication · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Online Publication"
			title="Online Publication"
			description="Katalog publikasi teknologi berdasarkan bidang. Klik kategori untuk melihat daftar publikasinya."
		/>

		<div class="mt-8 space-y-2">
			{#each data.categories as cat (cat.slug)}
				<details class="group rounded-xl border">
					<summary
						class="hover:bg-accent/50 flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5"
					>
						<span class="font-medium">{cat.title}</span>
						<span class="text-muted-foreground text-xs tabular-nums">{cat.count} publikasi</span>
					</summary>
					<div class="border-t px-5 py-4">
						{#if cat.items.length}
							<ul class="space-y-2">
								{#each cat.items as item (item.id)}
									<li class="text-sm" title={item.file}>
										{#if item.file}
											<a
												href={docUrl(item.file)}
												download
												class="hover:text-primary flex items-start gap-2 hover:underline"
											>
												<FileText class="text-primary mt-0.5 size-4 shrink-0" />
												<span>{item.title}</span>
											</a>
										{:else}
											<span class="text-muted-foreground flex items-start gap-2">
												<FileText class="mt-0.5 size-4 shrink-0" />
												<span>{item.title}</span>
											</span>
										{/if}
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-muted-foreground text-sm">Belum ada publikasi.</p>
						{/if}
					</div>
				</details>
			{:else}
				<p class="text-muted-foreground text-sm">Data publikasi belum tersedia.</p>
			{/each}
		</div>

		<p class="text-muted-foreground mt-6 text-xs">
			Tautan unduh mengarah ke <code>/dokumen/&lt;nama-file&gt;</code>. Letakkan berkas publikasi (PDF)
			di <code>static/dokumen/</code> agar bisa diunduh.
		</p>
	</div>
</section>
