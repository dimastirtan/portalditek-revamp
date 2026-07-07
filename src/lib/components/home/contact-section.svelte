<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import QuickMailLogin from './quick-mail-login.svelte';
	import { SITE } from '$lib/config/site';
	import { MapPin, Mail, Phone, Clock } from '@lucide/svelte';
</script>

<section id="kontak">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Kontak"
			title="Hubungi kami"
			description="Informasi kontak dan jam operasional Direktorat Teknologi dan Pengembangan."
		/>

		<div class="mt-8 grid gap-6 lg:grid-cols-2">
			<!-- Info kontak -->
			<div class="space-y-6">
				<div class="flex gap-4">
					<div
						class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md"
					>
						<MapPin class="size-5" />
					</div>
					<div>
						<h3 class="text-sm font-semibold">Alamat</h3>
						<p class="text-muted-foreground mt-1 text-sm leading-relaxed">
							{SITE.address.street}<br />
							{SITE.address.city}
							{SITE.address.postalCode}, {SITE.address.region}
						</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div
						class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md"
					>
						<Mail class="size-5" />
					</div>
					<div>
						<h3 class="text-sm font-semibold">Email</h3>
						<a
							href="mailto:{SITE.contact.email}"
							class="text-muted-foreground hover:text-primary mt-1 block text-sm transition-colors"
						>
							{SITE.contact.email}
						</a>
					</div>
				</div>

				<div class="flex gap-4">
					<div
						class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md"
					>
						<Phone class="size-5" />
					</div>
					<div>
						<h3 class="text-sm font-semibold">Telepon</h3>
						<p class="text-muted-foreground mt-1 text-sm">{SITE.contact.phone}</p>
					</div>
				</div>

				<div class="flex gap-4">
					<div
						class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md"
					>
						<Clock class="size-5" />
					</div>
					<div>
						<h3 class="text-sm font-semibold">Jam operasional</h3>
						<ul class="text-muted-foreground mt-1 space-y-0.5 text-sm">
							{#each SITE.hours as h (h.days)}
								<li class="flex justify-between gap-4">
									<span>{h.days}</span>
									<span class="text-right">{h.time}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			<!-- Quick login -->
			<QuickMailLogin />
		</div>
	</div>
</section>
