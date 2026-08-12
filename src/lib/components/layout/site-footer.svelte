<script lang="ts">
	import { SITE } from '$lib/config/site';
	import { SYSTEMS } from '$lib/data/nav';
	import { theme } from '$lib/stores/theme.svelte';

	const year = new Date().getFullYear();
</script>

<footer class="bg-secondary/40 border-t">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Identitas -->
			<div class="space-y-3">
				<div class="flex items-center gap-3">
				{#if theme.current === 'dark'}
					<img src="/logo-white.png" alt="Logo PT Dirgantara Indonesia" class="h-9 w-auto" />
					{:else}
					<img src="/logo.png" alt="Logo PT Dirgantara Indonesia" class="h-9 w-auto" />
				{/if}
					<span class="font-display text-sm font-semibold">{SITE.shortName}</span>
				</div>
				<p class="text-muted-foreground max-w-xs text-sm leading-relaxed">
					{SITE.tagline}
				</p>
			</div>

			<!-- Sistem -->
			<div>
				<h2 class="text-xs font-semibold tracking-wider uppercase">Sistem</h2>
				<ul class="mt-3 space-y-2">
					{#each SYSTEMS as sys (sys.id)}
						<li>
							<a
								href={sys.href}
								target={sys.external ? '_blank' : undefined}
								rel={sys.external ? 'noopener' : undefined}
								class="text-muted-foreground hover:text-foreground text-sm transition-colors"
							>
								{sys.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Kontak singkat -->
			<div>
				<h2 class="text-xs font-semibold tracking-wider uppercase">Kontak</h2>
				<address class="text-muted-foreground mt-3 space-y-2 text-sm leading-relaxed not-italic">
					<p>{SITE.address.street}, {SITE.address.city} {SITE.address.postalCode}</p>
					<p>
						<a href="mailto:{SITE.contact.email}" class="hover:text-foreground transition-colors">
							{SITE.contact.email}
						</a>
					</p>
					<p>{SITE.contact.phone}</p>
				</address>
			</div>
		</div>

		<div class="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
			<p class="text-muted-foreground text-center text-xs sm:text-left">
				© {year}
				{SITE.company}. All rights reserved.
			</p>
		</div>
		<div class="from-primary mt-3 h-1 min-w-2xl rounded-full bg-primary" aria-hidden="true"></div>
	</div>
</footer>
