<script lang="ts">
	import MainNav from './main-nav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import { SITE } from '$lib/config/site';
	import { Library } from '@lucide/svelte';

	let { activeHash = '' }: { activeHash?: string } = $props();

	// href '#' masih placeholder → jangan lompat ke atas halaman.
	function onLibraryClick(e: MouseEvent) {
		if (SITE.library.href === '#') e.preventDefault();
	}
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur"
>
	<!-- Baris 1: logo (kiri) + Our Library & tombol menu (kanan) -->
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
		<a href="/" class="flex items-center gap-3">
			<img src="/logo.png" alt="Logo PT Dirgantara Indonesia" class="h-9 w-auto" />
			<span class="flex flex-col leading-tight">
				<span class="font-display text-sm font-semibold tracking-tight sm:text-base">
					{SITE.name}
				</span>
				<span class="text-muted-foreground hidden text-xs sm:block">{SITE.company}</span>
			</span>
		</a>

		<div class="flex items-center gap-2">
			<a
				href={SITE.library.href}
				onclick={onLibraryClick}
				target={SITE.library.external ? '_blank' : undefined}
				rel={SITE.library.external ? 'noopener' : undefined}
				title="Our Library"
				class="border-primary/30 text-primary hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
			>
				<Library class="size-4" />
				<span class="hidden sm:inline">{SITE.library.label}</span>
			</a>
			<MobileNav />
		</div>
	</div>

	<!-- Baris 2: navbar utama (desktop) — baris penuh, dipisah garis dari logo -->
	<div class="hidden border-t lg:block">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
			<MainNav {activeHash} />
		</div>
	</div>
</header>
