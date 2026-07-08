<script lang="ts">
	import { MAIN_NAV, SYSTEMS } from '$lib/data/nav';
	import type { NavItem } from '$lib/types/nav';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Menu, ArrowUpRight, ChevronDown } from '@lucide/svelte';
	import { SITE } from '$lib/config/site';

	let open = $state(false);
	let expanded = $state<Record<string, boolean>>({});

	function close() {
		open = false;
	}
	function toggle(path: string) {
		expanded[path] = !expanded[path];
	}
	function indent(depth: number) {
		return `padding-left: ${0.75 + depth * 0.85}rem`;
	}
</script>

{#snippet items(list: NavItem[], depth: number, prefix: string)}
	{#each list as item (item.label)}
		{@const path = prefix + '/' + item.label}
		{#if item.children?.length}
			<button
				type="button"
				onclick={() => toggle(path)}
				aria-expanded={!!expanded[path]}
				style={indent(depth)}
				class="hover:bg-accent flex w-full items-center justify-between rounded-md py-2.5 pr-3 text-sm font-medium transition-colors"
			>
				{item.label}
				<ChevronDown class="size-4 transition-transform {expanded[path] ? 'rotate-180' : ''}" />
			</button>
			{#if expanded[path]}
				{@render items(item.children, depth + 1, path)}
			{/if}
		{:else if item.soon}
			<span
				style={indent(depth)}
				class="text-muted-foreground/60 flex items-center gap-2 py-2.5 pr-3 text-sm"
			>
				{item.label}
				<span class="bg-muted rounded px-1 py-px text-[10px] tracking-wide">Segera</span>
			</span>
		{:else}
			<a
				href={item.href}
				onclick={close}
				target={item.external ? '_blank' : undefined}
				rel={item.external ? 'noopener' : undefined}
				style={indent(depth)}
				class="hover:bg-accent hover:text-accent-foreground flex items-center rounded-md py-2.5 pr-3 text-sm transition-colors"
			>
				{item.label}
			</a>
		{/if}
	{/each}
{/snippet}

<Sheet.Root bind:open>
	<Sheet.Trigger
		class="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors lg:hidden"
		aria-label="Buka menu navigasi"
	>
		<Menu class="size-5" />
	</Sheet.Trigger>

	<Sheet.Content side="right" class="w-80 gap-0 p-0">
		<Sheet.Header class="border-b">
			<Sheet.Title>{SITE.shortName}</Sheet.Title>
			<Sheet.Description>{SITE.name}</Sheet.Description>
		</Sheet.Header>

		<div class="flex-1 overflow-y-auto">
			<nav aria-label="Navigasi utama" class="p-2">
				{@render items(MAIN_NAV, 0, '')}
			</nav>

			<div class="border-t p-2">
				<p class="text-muted-foreground px-3 py-2 text-xs font-semibold tracking-wider uppercase">
					Sistem
				</p>
				{#each SYSTEMS as sys (sys.id)}
					<a
						href={sys.href}
						onclick={close}
						target={sys.external ? '_blank' : undefined}
						rel={sys.external ? 'noopener' : undefined}
						class="hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors"
					>
						{sys.label}
						{#if sys.external}
							<ArrowUpRight class="text-muted-foreground size-4" />
						{/if}
					</a>
				{/each}
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
