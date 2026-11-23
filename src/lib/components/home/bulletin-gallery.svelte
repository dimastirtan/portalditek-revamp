<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { ChevronLeft, ChevronRight, Expand, ExternalLink, X } from '@lucide/svelte';
	import type { Bulletin } from '$lib/types/content';

	/** Poster buletin terbaru (maks. 3) — lihat bulletins() di $lib/server/uploads. */
	let { items }: { items: Bulletin[] } = $props();

	const count = $derived(items.length);
	/** Lebar baris kartu mengikuti jumlah poster supaya tetap di tengah. */
	const columns = $derived(
		count === 1
			? 'sm:max-w-sm sm:grid-cols-1'
			: count === 2
				? 'sm:max-w-3xl sm:grid-cols-2'
				: 'sm:grid-cols-3'
	);

	let dialog: HTMLDialogElement;
	let index = $state(0);
	const current = $derived(items[Math.min(index, count - 1)]);

	function open(i: number) {
		index = i;
		dialog.showModal();
		// <dialog> tidak mengunci scroll halaman di belakangnya.
		document.documentElement.style.overflow = 'hidden';
	}
	const unlockScroll = () => (document.documentElement.style.overflow = '');
	function close() {
		dialog.close();
		unlockScroll(); // event `close` datang belakangan; Esc ditangani onclose
	}
	const go = (i: number) => (index = (i + count) % count);

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') go(index - 1);
		else if (e.key === 'ArrowRight') go(index + 1);
	}

	/** Klik area kosong (bukan poster / tombol) = tutup. */
	function onBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}
</script>

<!-- Ponsel: kartu digeser ke samping (scroll-snap); ≥ sm: berjajar dalam grid. -->
<ul
	class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-auto sm:grid sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 {columns}"
>
	{#each items as item, i (item.src)}
		<li class="w-[78%] shrink-0 snap-center sm:w-auto">
			<button
				type="button"
				onclick={() => open(i)}
				class="group bg-card hover:border-primary/40 block w-full overflow-hidden rounded-xl border text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
				aria-label="Open {item.title} full screen"
			>
				<div class="bg-muted relative">
					<img
						src={item.src}
						alt={item.title}
						loading="lazy"
						decoding="async"
						class="aspect-[1/1.414] w-full object-contain"
					/>
					<span
						class="bg-background/85 absolute top-3 right-3 inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
					>
						<Expand class="size-3.5" />
						View
					</span>
				</div>
				<div class="border-t p-4">
					<p class="group-hover:text-primary line-clamp-2 font-semibold transition-colors">
						{item.title}
					</p>
					<p class="text-muted-foreground mt-1 text-xs">{formatDate(item.updated)}</p>
				</div>
			</button>
		</li>
	{/each}
</ul>

<!--
	Popup layar penuh: <dialog> bawaan (fokus terkunci di dalam, Esc menutup).
	Latar digelapkan oleh dialog itu sendiri — bukan ::backdrop, yang di Chrome < 122
	tidak mewarisi variabel CSS (warna jadi transparan di Chrome 109).
-->
<dialog
	bind:this={dialog}
	aria-label={current?.title}
	class="m-0 size-full max-h-none max-w-none bg-black/90 p-0 text-white"
	onclose={unlockScroll}
	onkeydown={onKeydown}
	onclick={onBackdropClick}
>
	{#if current}
		<div
			class="flex h-full flex-col items-center justify-center gap-3 px-4 py-4 sm:px-20"
			onclick={onBackdropClick}
			role="presentation"
		>
			<img
				src={current.src}
				alt={current.title}
				class="max-h-[calc(100svh-7rem)] max-w-full rounded-md object-contain shadow-2xl"
			/>
			<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-sm">
				<span class="font-semibold">{current.title}</span>
				<span class="text-white/70">{formatDate(current.updated)}</span>
				<a
					href={current.src}
					target="_blank"
					rel="noopener"
					class="inline-flex items-center gap-1 text-white/80 hover:text-white hover:underline"
				>
					<ExternalLink class="size-3.5" />
					Open original
				</a>
			</div>
		</div>

		<button
			type="button"
			onclick={close}
			aria-label="Close"
			class="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
		>
			<X class="size-5" />
		</button>
		{#if count > 1}
			<button
				type="button"
				onclick={() => go(index - 1)}
				aria-label="Previous bulletin"
				class="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25 sm:left-5"
			>
				<ChevronLeft class="size-6" />
			</button>
			<button
				type="button"
				onclick={() => go(index + 1)}
				aria-label="Next bulletin"
				class="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/25 sm:right-5"
			>
				<ChevronRight class="size-6" />
			</button>
		{/if}
	{/if}
</dialog>
