<script lang="ts">
	import { onMount } from 'svelte';
	import { SITE } from '$lib/config/site';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowRight, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { formatDate } from '$lib/utils';
	import type { HeadlineCard } from '$lib/types/content';

	/** Headline terbaru. Kosong (DB tidak terjangkau) → hero statis. */
	let { slides = [] }: { slides?: HeadlineCard[] } = $props();

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
		class="relative overflow-hidden border-b"
		aria-roledescription="carousel"
		aria-label="Headline news"
		onmouseenter={() => (paused = true)}
		onmouseleave={() => (paused = false)}
		onfocusin={() => (paused = true)}
		onfocusout={() => (paused = false)}
		onkeydown={onKeydown}
	>
		<!-- Latar: gambar slide aktif diburamkan (gambar aslinya kecil, ± 500 px). -->
		<div class="absolute inset-0" aria-hidden="true">
			{#each slides as slide, i (slide.id)}
				{#if slide.image}
					<img
						src={slide.image}
						alt=""
						class="absolute inset-0 size-full scale-110 object-cover blur-2xl transition-opacity duration-700 {i ===
						active
							? 'opacity-40'
							: 'opacity-0'}"
					/>
				{/if}
			{/each}
			<div
				class="from-background via-background/90 to-background/60 absolute inset-0 bg-gradient-to-r"
			></div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
			<!-- Semua slide di sel grid yang sama → tinggi stabil. Slide aktif masuk dari
			     samping, slide sebelumnya keluar ke sisi lain (lihat data-motion).
			     overflow-hidden memotong slide di luar kolom; padding memberi ruang untuk
			     bayangan & cincin fokus. -->
			<div class="-m-3 grid overflow-hidden p-3">
				{#each slides as slide, i (slide.id)}
					<article
						class="slide col-start-1 row-start-1 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-12 {i ===
						active
							? ''
							: 'pointer-events-none invisible opacity-0'}"
						data-motion={motionOf(i)}
						aria-roledescription="slide"
						aria-label="{i + 1} of {count}"
						aria-hidden={i !== active}
						inert={i !== active}
					>
						<div class="order-2 lg:order-1">
							<p class="text-primary text-sm font-semibold tracking-wider uppercase">
								Headline · {formatDate(slide.date)}
							</p>
							<h2
								class="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
							>
								{slide.title}
							</h2>
							{#if slide.excerpt}
								<p
									class="text-muted-foreground mt-5 line-clamp-3 max-w-xl text-base leading-relaxed sm:text-lg"
								>
									{slide.excerpt}
								</p>
							{/if}
							<div class="mt-8">
								<Button href={slide.url}>
									Read more
									<ArrowRight class="size-4" />
								</Button>
							</div>
						</div>

						{#if slide.image}
							<div class="order-1 lg:order-2">
								<div
									class="bg-muted aspect-video overflow-hidden rounded-xl border shadow-sm lg:aspect-[4/3]"
								>
									<img
										src={slide.image}
										alt={slide.title}
										loading={i === 0 ? 'eager' : 'lazy'}
										fetchpriority={i === 0 ? 'high' : undefined}
										class="size-full object-contain"
									/>
								</div>
							</div>
						{/if}
					</article>
				{/each}
			</div>

			{#if count > 1}
				<div class="mt-8 flex items-center gap-3">
					<button
						type="button"
						onclick={() => go(active - 1, -1)}
						aria-label="Previous headline"
						class="bg-background/70 hover:bg-accent inline-flex size-9 items-center justify-center rounded-full border transition-colors"
					>
						<ChevronLeft class="size-4" />
					</button>
					<div class="flex items-center gap-1.5">
						{#each slides as slide, i (slide.id)}
							<button
								type="button"
								onclick={() => go(i)}
								aria-label="Show headline {i + 1}"
								aria-current={i === active}
								class="h-1.5 rounded-full transition-all {i === active
									? 'bg-primary w-6'
									: 'bg-primary/25 hover:bg-primary/50 w-1.5'}"
							></button>
						{/each}
					</div>
					<button
						type="button"
						onclick={() => go(active + 1, 1)}
						aria-label="Next headline"
						class="bg-background/70 hover:bg-accent inline-flex size-9 items-center justify-center rounded-full border transition-colors"
					>
						<ChevronRight class="size-4" />
					</button>
					<a
						href="/berita-utama"
						class="text-primary ml-auto inline-flex items-center gap-1 text-sm font-medium hover:underline"
					>
						All headlines
						<ArrowRight class="size-4" />
					</a>
				</div>
			{/if}
		</div>
	</section>
{:else}
	<section id="beranda" class="relative overflow-hidden border-b">
		<div class="absolute inset-0">
			<img
				src="/ptdi.webp"
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
						Explore systems
						<ArrowRight class="size-4" />
					</Button>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	/* Geser slide. Jarak 100% + 1.5rem supaya slide benar-benar keluar dari area
	   yang terlihat (padding pembungkus 0.75rem). */
	@keyframes slide-in-next {
		from {
			transform: translateX(calc(100% + 1.5rem));
		}
	}
	@keyframes slide-in-prev {
		from {
			transform: translateX(calc(-100% - 1.5rem));
		}
	}
	@keyframes slide-out-next {
		to {
			transform: translateX(calc(-100% - 1.5rem));
		}
	}
	@keyframes slide-out-prev {
		to {
			transform: translateX(calc(100% + 1.5rem));
		}
	}

	/* Slide tersembunyi = invisible + opacity-0. Opacity perlu karena visibility
	   diwariskan: elemen dengan transition-all (mis. Button) ikut mentransisikan
	   visibility, sehingga tombol "Read more" slide yang baru disembunyikan masih
	   tampil ±150 ms di atas slide aktif. Opacity induk tidak bisa dilawan anaknya. */
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
