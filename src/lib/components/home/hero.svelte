<script lang="ts">
	import { onMount } from 'svelte';
	import { SITE } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { formatDate } from '$lib/utils';
	import type { HeroSlide } from '$lib/types/content';

	/** Headline terbaru. Kosong (DB tidak terjangkau) → hero statis. */
	let { slides = [] }: { slides?: HeroSlide[] } = $props();

	/** Latar slide yang gambarnya kecil / tidak ada (lihat heroSlide di queries.ts). */
	const DEFAULT_BACKDROP = '/ptdi.webp';
	const INTERVAL = 6000;
	const count = $derived(slides.length);

	let active = $state(0);
	/** Slide yang sedang keluar (-1 = belum pernah pindah → tanpa animasi). */
	let prev = $state(-1);
	/** Arah gerak: 1 = maju (masuk dari kanan), -1 = mundur (masuk dari kiri). */
	let dir = $state<1 | -1>(1);
	let paused = $state(false);
	let reducedMotion = $state(false);

	function go(i: number, d: 1 | -1 = i > active ? 1 : -1) {
		const next = (i + count) % count;
		if (next === active) return;
		prev = active;
		dir = d;
		active = next;
	}

	/**
	 * Slide aktif & tetangganya (maju/mundur) memuat gambarnya lebih dulu. Gambar
	 * `lazy` di slide tersembunyi baru diunduh saat slide tampil → foto telat muncul
	 * di tengah animasi geser.
	 */
	const near = (i: number) =>
		count <= 3 || i === active || i === (active + 1) % count || i === (active - 1 + count) % count;

	/** Nilai data-motion → animasi slide (lihat blok style di bawah). */
	function motionOf(i: number): string | undefined {
		if (reducedMotion || prev < 0) return undefined;
		const side = dir > 0 ? 'next' : 'prev';
		if (i === active) return `in-${side}`;
		if (i === prev) return `out-${side}`;
		return undefined;
	}

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	// Ganti slide otomatis. Dibaca ulang tiap `active` berubah, jadi navigasi
	// manual ikut mengulang hitungan. Berhenti saat kursor/fokus di dalam slideshow
	// dan bila pengguna memilih "kurangi animasi".
	$effect(() => {
		if (count < 2 || paused || reducedMotion) return;
		const next = active + 1;
		const timer = setTimeout(() => go(next, 1), INTERVAL);
		return () => clearTimeout(timer);
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') go(active - 1, -1);
		else if (e.key === 'ArrowRight') go(active + 1, 1);
	}
</script>

{#if count}
	<!-- Listener di section sengaja: pola carousel (WAI-ARIA) — jeda saat kursor/fokus
	     di dalam, panah kiri/kanan saat fokus di tombol atau tautan slide. -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<section
		id="beranda"
		class="mx-auto max-w-7xl"
		aria-roledescription="carousel"
		aria-label="Headline news"
		onmouseenter={() => (paused = true)}
		onmouseleave={() => (paused = false)}
		onfocusin={() => (paused = true)}
		onfocusout={() => (paused = false)}
		onkeydown={onKeydown}
	>
		<!-- Kotak selebar container. Tiap slide: foto penuh + teks di atasnya. Slide
		     aktif masuk dari samping, slide sebelumnya keluar ke sisi lain (data-motion). -->
		<div
			class="hero relative isolate overflow-hidden bg-black text-white shadow-sm"
		>
			{#each slides as slide, i (slide.id)}
				<article
					class="slide absolute inset-0 isolate {i === active
						? ''
						: 'pointer-events-none invisible opacity-0'}"
					data-motion={motionOf(i)}
					aria-roledescription="slide"
					aria-label="{i + 1} of {count}"
					aria-hidden={i !== active}
					inert={i !== active}
				>
					<div class="absolute inset-0 -z-10" aria-hidden="true">
						<img
							src={slide.backdrop || DEFAULT_BACKDROP}
							alt=""
							loading={near(i) ? 'eager' : 'lazy'}
							fetchpriority={i === 0 ? 'high' : undefined}
							decoding="async"
							class="size-full object-cover"
						/>
						<!-- Gelap di bawah & kiri: teks putih selalu terbaca, terang maupun gelap. -->
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"
						></div>
						<div
							class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent"
						></div>
					</div>

					<div class="flex h-full flex-col justify-end px-5 pb-20 sm:px-10 sm:pb-24 lg:px-12">
						<div class="max-w-4xl">
							<span
								class="bg-primary text-primary-foreground inline-block rounded px-3 py-1 text-xs font-semibold tracking-wider uppercase"
							>
								Headline
							</span>
							<h2
								class="font-display mt-4 line-clamp-3 text-2xl leading-tight font-bold tracking-tight uppercase drop-shadow-sm sm:text-4xl lg:text-5xl"
							>
								<!-- after:inset-0 → seluruh slide bisa diklik, satu tautan per slide. -->
								<a
									href={slide.url}
									class="decoration-2 underline-offset-4 outline-none after:absolute after:inset-0 hover:underline focus-visible:underline"
								>
									{slide.title}
								</a>
							</h2>
							<p class="mt-4 text-sm font-medium tracking-wider text-white/80 uppercase">
								{formatDate(slide.date)}
							</p>
							{#if slide.excerpt}
								<p
									class="mt-3 hidden max-w-2xl text-base leading-relaxed text-white/80 md:line-clamp-2"
								>
									{slide.excerpt}
								</p>
							{/if}
						</div>
					</div>
				</article>
			{/each}

			<!-- Kontrol di atas semua slide. -->
			<div class="pointer-events-none absolute inset-x-0 bottom-0 z-10">
				<div
					class="pointer-events-auto flex items-center gap-3 px-5 pb-5 sm:px-10 sm:pb-7 lg:px-12"
				>
					{#if count > 1}
						<div class="flex items-center gap-1.5">
							{#each slides as slide, i (slide.id)}
								<button
									type="button"
									onclick={() => go(i)}
									aria-label="Show headline {i + 1}"
									aria-current={i === active}
									class="h-1.5 rounded-full transition-all {i === active
										? 'w-8 bg-white'
										: 'w-3 bg-white/40 hover:bg-white/70'}"
								></button>
							{/each}
						</div>
					{/if}
					<a
						href="/berita-utama"
						class="ml-auto inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap text-white/85 hover:text-white hover:underline"
						aria-label="All headlines"
					>
						<!-- Layar sempit: cukup "All" supaya kontrol tetap satu baris. -->
						All<span class="hidden sm:inline">&nbsp;headlines</span>
						<ArrowRight class="size-4" />
					</a>
					{#if count > 1}
						<button
							type="button"
							onclick={() => go(active - 1, -1)}
							aria-label="Previous headline"
							class="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/65 sm:size-10"
						>
							<ChevronLeft class="size-5" />
						</button>
						<button
							type="button"
							onclick={() => go(active + 1, 1)}
							aria-label="Next headline"
							class="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/65 sm:size-10"
						>
							<ChevronRight class="size-5" />
						</button>
					{/if}
				</div>
			</div>
		</div>
	</section>
{:else}
	<section id="beranda" class="mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 lg:px-8 lg:pt-8 lg:pb-10">
		<div
			class="hero relative isolate overflow-hidden rounded-xl bg-black text-white shadow-sm sm:rounded-2xl"
		>
			<div class="absolute inset-0 -z-10" aria-hidden="true">
				<img src={DEFAULT_BACKDROP} alt="" class="size-full object-cover" fetchpriority="high" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"></div>
				<div
					class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent"
				></div>
			</div>

			<div class="flex h-full flex-col justify-end px-5 pb-12 sm:px-10 sm:pb-14 lg:px-12">
				<div class="max-w-3xl">
					<p class="text-sm font-semibold tracking-wider text-white/85 uppercase">
						{SITE.company}
					</p>
					<h1 class="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						{SITE.name}
					</h1>
					<p class="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
						{SITE.description}
					</p>
					<div class="mt-8 flex flex-wrap gap-3">
						<Button href="#sistem">
							Explore systems
							<ArrowRight class="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	/* Tinggi kotak hero: lega tapi tetap menyisakan isi halaman di layar laptop. */
	.hero {
		height: 28rem;
	}
	@media (min-width: 640px) {
		.hero {
			height: 32rem;
		}
	}
	@media (min-width: 1024px) {
		.hero {
			height: clamp(30rem, 68vh, 40rem);
		}
	}

	/* Geser slide selebar hero. */
	@keyframes slide-in-next {
		from {
			transform: translateX(100%);
		}
	}
	@keyframes slide-in-prev {
		from {
			transform: translateX(-100%);
		}
	}
	@keyframes slide-out-next {
		to {
			transform: translateX(-100%);
		}
	}
	@keyframes slide-out-prev {
		to {
			transform: translateX(100%);
		}
	}

	/* Slide tersembunyi = invisible + opacity-0. Opacity perlu karena visibility
	   diwariskan: elemen dengan transition (mis. tombol) ikut mentransisikan
	   visibility, sehingga isi slide yang baru disembunyikan sempat tampil dobel
	   di atas slide aktif. Opacity induk tidak bisa dilawan anaknya. */
	.slide[data-motion] {
		visibility: visible;
		opacity: 1;
		/* ease-in-out: gerak geser terlihat jelas dari awal sampai akhir. */
		animation-duration: 800ms;
		animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
		animation-fill-mode: both;
	}
	.slide[data-motion='in-next'] {
		animation-name: slide-in-next;
	}
	.slide[data-motion='in-prev'] {
		animation-name: slide-in-prev;
	}
	.slide[data-motion='out-next'] {
		animation-name: slide-out-next;
	}
	.slide[data-motion='out-prev'] {
		animation-name: slide-out-prev;
	}

	@media (prefers-reduced-motion: reduce) {
		.slide[data-motion] {
			animation: none;
		}
		.slide[data-motion^='out'] {
			visibility: hidden;
			opacity: 0;
		}
	}
</style>
