<script lang="ts">
	import { MAIN_NAV, SYSTEMS } from '$lib/data/nav';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Menu, ArrowUpRight } from '@lucide/svelte';
	import { SITE } from '$lib/config/site';

	let open = $state(false);

	function close() {
		open = false;
	}
</script>

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
				{#each MAIN_NAV as item (item.href)}
					<a
						href={item.href}
						onclick={close}
						target={item.external ? '_blank' : undefined}
						rel={item.external ? 'noopener' : undefined}
						class="hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
					>
						{item.label}
					</a>
				{/each}
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
