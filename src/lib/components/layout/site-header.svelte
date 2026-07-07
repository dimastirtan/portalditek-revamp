<script lang="ts">
	import MainNav from './main-nav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import { SITE } from '$lib/config/site';

	let { activeHash = '' }: { activeHash?: string } = $props();
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur"
>
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
			<MainNav {activeHash} />
			<MobileNav />
		</div>
	</div>
</header>
