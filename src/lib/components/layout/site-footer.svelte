<script lang="ts">
	import { SITE } from '$lib/config/site';
	import { SYSTEMS } from '$lib/data/nav';
	import { Twitter, Facebook, Instagram, Youtube, Linkedin } from '@lucide/svelte';

	const year = new Date().getFullYear();

	const socials = [
		{ label: 'X (Twitter)', href: SITE.social.twitter, icon: Twitter },
		{ label: 'Facebook', href: SITE.social.facebook, icon: Facebook },
		{ label: 'Instagram', href: SITE.social.instagram, icon: Instagram },
		{ label: 'YouTube', href: SITE.social.youtube, icon: Youtube },
		{ label: 'LinkedIn', href: SITE.social.linkedin, icon: Linkedin }
	];
</script>

<footer class="bg-secondary/40 border-t">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-8 md:grid-cols-3">
			<!-- Identitas -->
			<div class="space-y-3">
				<div class="flex items-center gap-3">
					<img src="/logo.png" alt="Logo PT Dirgantara Indonesia" class="h-9 w-auto" />
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
			<div class="flex items-center gap-1">
				{#each socials as s (s.label)}
					<a
						href={s.href}
						target="_blank"
						rel="noopener"
						aria-label={s.label}
						class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-8 items-center justify-center rounded-md transition-colors"
					>
						<s.icon class="size-4" />
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
