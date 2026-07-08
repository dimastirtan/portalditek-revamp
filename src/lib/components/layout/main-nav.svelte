<script lang="ts">
	import { MAIN_NAV } from '$lib/data/nav';
	import type { NavItem } from '$lib/types/nav';
	import { page } from '$app/state';
	import { ChevronDown } from '@lucide/svelte';

	let { activeHash = '' }: { activeHash?: string } = $props();

	let openIndex = $state<number | null>(null);
	let navEl = $state<HTMLElement | null>(null);

	function hasChildren(item: NavItem) {
		return !!item.children?.length;
	}
	function isActive(href?: string) {
		if (!href) return false;
		if (href.startsWith('/#')) return page.url.pathname === '/' && page.url.hash === href.slice(1);
		if (href === '/') return page.url.pathname === '/' && !page.url.hash;
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}
	function close() {
		openIndex = null;
	}

	// Tutup dropdown saat klik di luar nav atau tekan Escape.
	$effect(() => {
		if (openIndex === null) return;
		function onPointer(e: PointerEvent) {
			if (navEl && !navEl.contains(e.target as Node)) close();
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') close();
		}
		document.addEventListener('pointerdown', onPointer);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onPointer);
			document.removeEventListener('keydown', onKey);
		};
	});
</script>

<!-- snippet: satu baris di dalam panel. sub=true → anak grup (lebih kecil & menjorok). -->
{#snippet leaf(item: NavItem, sub: boolean)}
	{#if item.soon}
		<span
			class="text-muted-foreground/60 flex cursor-default items-center gap-1.5 rounded px-2 py-1.5 {sub
				? 'pl-4 text-[13px]'
				: 'text-sm'}"
			title="Segera hadir"
		>
			{item.label}
			<span class="bg-muted text-muted-foreground rounded px-1 py-px text-[10px] tracking-wide"
				>Segera</span
			>
		</span>
	{:else}
		<a
			href={item.href}
			target={item.external ? '_blank' : undefined}
			rel={item.external ? 'noopener' : undefined}
			onclick={close}
			aria-current={isActive(item.href) ? 'page' : undefined}
			data-active={isActive(item.href)}
			class="hover:bg-accent data-[active=true]:text-primary block rounded px-2 py-1.5 transition-colors {sub
				? 'text-muted-foreground hover:text-foreground pl-4 text-[13px]'
				: 'hover:text-accent-foreground text-sm'}"
		>
			{item.label}
		</a>
	{/if}
{/snippet}

<nav bind:this={navEl} aria-label="Navigasi utama" class="hidden items-center gap-0.5 py-1 lg:flex">
	{#each MAIN_NAV as item, i (item.label)}
		{#if hasChildren(item)}
			<div class="relative">
				<button
					type="button"
					onclick={() => toggle(i)}
					aria-expanded={openIndex === i}
					aria-haspopup="true"
					data-open={openIndex === i}
					class="hover:text-primary text-foreground/70 data-[open=true]:text-primary inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
				>
					{item.label}
					<ChevronDown
						class="size-3.5 transition-transform {openIndex === i ? 'rotate-180' : ''}"
					/>
				</button>

				{#if openIndex === i}
					<div
						class="bg-popover text-popover-foreground absolute left-0 top-full z-50 mt-1 max-h-[75vh] w-64 overflow-y-auto rounded-md border p-2 shadow-lg"
					>
						{#each item.children ?? [] as child (child.label)}
							{#if child.children?.length}
								<div class="pt-2 first:pt-0">
									<p class="text-foreground px-2 pb-0.5 text-[15px] font-semibold">
										{child.label}
									</p>
									{#each child.children as gc (gc.label)}
										{@render leaf(gc, true)}
									{/each}
								</div>
							{:else}
								{@render leaf(child, false)}
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{:else if item.soon}
			<span
				class="text-muted-foreground/60 cursor-default rounded-md px-3 py-2 text-sm font-medium"
				title="Segera hadir">{item.label}</span
			>
		{:else}
			<a
				href={item.href}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noopener' : undefined}
				aria-current={isActive(item.href) ? 'page' : undefined}
				data-active={isActive(item.href)}
				class="hover:text-primary text-foreground/70 data-[active=true]:text-primary rounded-md px-3 py-2 text-sm font-medium transition-colors"
			>
				{item.label}
			</a>
		{/if}
	{/each}
</nav>
