<script lang="ts">
	import MainNav from './main-nav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import { SITE } from '$lib/config/site';

	let { activeHash = '' }: { activeHash?: string } = $props();
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur"
>
	<!-- Baris 1: logo (+ tombol menu di mobile) -->
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

		<MobileNav />
	</div>

	<!-- Baris 2: navbar utama (desktop) — baris penuh, dipisah garis dari logo -->
	<div class="hidden border-t lg:block">
		<div class="mx-auto! max-w-7xl px-4 sm:px-6 lg:px-8 relative min-h-[3.5rem] flex items-center justify-around">
			<MainNav {activeHash} />
		</div>
	</div>
</header>
