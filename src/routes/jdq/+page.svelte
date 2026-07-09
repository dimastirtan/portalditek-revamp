<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import { FileText } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Job Description Qualification · Direktorat Teknologi</title></svelte:head>

<section class="border-b">
	<div class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Profil · SDM"
			title="Job Description Qualification"
			description="Dokumen JDQ per volume. Semua dokumen dalam format PDF."
		/>

		<div class="mt-8 space-y-4">
			{#each data.volumes as vol (vol.id)}
				<div class="rounded-xl border p-4">
					<h2 class="font-medium">{vol.title}</h2>
					{#if vol.subtitle}
						<p class="text-muted-foreground text-sm">{vol.subtitle}</p>
					{/if}
					{#if vol.files.length}
						<ul class="mt-3 space-y-1.5 border-t pt-3">
							{#each vol.files as f (f.id)}
								<li>
									<span
										class="text-muted-foreground flex items-center gap-2 text-sm"
										title={f.file}
									>
										<FileText class="text-primary size-4 shrink-0" />
										{f.title || f.file}
									</span>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{:else}
				<p class="text-muted-foreground text-sm">Data JDQ belum tersedia.</p>
			{/each}
		</div>

		<p class="text-muted-foreground mt-6 text-xs">
			Berkas PDF belum di-host di portal baru — daftar di atas menampilkan nama file dari basis data.
			Arahkan ke lokasi berkas begitu folder dokumen dipulihkan.
		</p>
	</div>
</section>
