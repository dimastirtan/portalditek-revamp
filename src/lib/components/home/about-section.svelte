<script lang="ts">
	import { SITE } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ExternalLink } from '@lucide/svelte';
</script>

<section id="perusahaan" class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
			<div class="overflow-hidden rounded-xl border">
				<img
					src="/ptdi.png"
					alt="Kompleks PT Dirgantara Indonesia"
					class="aspect-video w-full object-cover"
					loading="lazy"
				/>
			</div>

			<div>
				<p class="text-primary text-xs font-semibold tracking-wider uppercase">Perusahaan</p>
				<h2 class="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
					Tentang PT Dirgantara Indonesia
				</h2>
				<div class="text-muted-foreground mt-4 space-y-4 text-sm leading-relaxed sm:text-base">
					<p>
						PT Dirgantara Indonesia (Persero) adalah industri pesawat terbang pertama dan
						satu-satunya di Asia Tenggara, dengan pengalaman panjang dalam desain, pengembangan, dan
						produksi pesawat serta komponen kedirgantaraan.
					</p>
					<p>
						Direktorat Teknologi dan Pengembangan menjadi tulang punggung inovasi perusahaan, mulai
						dari rekayasa desain, manajemen data engineering, hingga sertifikasi produk berstandar
						internasional.
					</p>
				</div>
				<div class="mt-6">
					<Button href={SITE.companyUrl} target="_blank" rel="noopener" variant="outline">
						Selengkapnya
						<ExternalLink class="size-4" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</section>
