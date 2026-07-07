<script lang="ts">
	import { MAIN_NAV } from '$lib/data/nav';
	import { page } from '$app/state';

	// Section aktif untuk highlight (di-set oleh scroll spy di landing, M3).
	let { activeHash = '' }: { activeHash?: string } = $props();

	function isActive(href: string, anchor?: boolean) {
		if (anchor) return activeHash === href;
		return page.url.pathname === href;
	}
</script>

<nav aria-label="Navigasi utama" class="hidden items-center gap-1 lg:flex">
	{#each MAIN_NAV as item (item.href)}
		<a
			href={item.href}
			target={item.external ? '_blank' : undefined}
			rel={item.external ? 'noopener' : undefined}
			aria-current={isActive(item.href, item.anchor) ? 'page' : undefined}
			class="hover:text-primary data-[active=true]:text-primary text-foreground/70 relative rounded-md px-3 py-2 text-sm font-medium transition-colors"
			data-active={isActive(item.href, item.anchor)}
		>
			{item.label}
		</a>
	{/each}
</nav>
