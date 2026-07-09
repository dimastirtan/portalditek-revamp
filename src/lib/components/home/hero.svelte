<script lang="ts">
	import { SITE } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ExternalLink } from '@lucide/svelte';
</script>

<section id="beranda" class="relative overflow-hidden border-b">
	<!--
		Portal lama: 6 video pesawat autoplay-loop (puluhan MB) sebagai carousel.
		Diganti poster statis ringan. Untuk pakai video, taruh file di
		/static/hero/showreel.mp4 lalu ganti <img> di bawah dengan <video>
		yang punya atribut poster, muted, loop, playsinline, dan preload="none".
	-->
	<div class="absolute inset-0">
		<img
			src="/ptdi.png"
			alt=""
			aria-hidden="true"
			class="h-full w-full object-cover"
			fetchpriority="high"
		/>
		<div
			class="from-background via-background/85 to-background/40 absolute inset-0 bg-gradient-to-r"
		></div>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
		<div class="max-w-2xl">
			<p class="text-primary text-sm font-semibold tracking-wider uppercase">
				{SITE.company}
			</p>
			<h1 class="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				{SITE.name}
			</h1>
			<p class="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
				{SITE.description}
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button href="#sistem">
					Jelajahi sistem
					<ArrowRight class="size-4" />
				</Button>
			</div>
		</div>
	</div>
</section>
