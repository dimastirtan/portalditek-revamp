<script lang="ts">
	import '../app.css';
	import { SITE } from '$lib/config/site';
	import { Topbar, SiteHeader, SiteFooter } from '$lib/components/layout';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import NotificationsPanel from '$lib/components/shared/notifications-panel.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	// Panel Notifications: perubahan dokumen DOA 7 hari terakhir (terbaru dulu).
	const doaUpdates = $derived(data.doaUpdates ?? []);
	let notificationsOpen = $state(false);

	// Perubahan terbaru yang sudah dilihat pengunjung ini (per browser — portal tanpa login).
	// null = belum dibaca dari localStorage (SSR) → badge belum ditampilkan.
	const SEEN_KEY = 'dtp:doa-seen';
	let seenAt = $state<string | null>(null);
	const notificationCount = $derived(
		seenAt === null ? 0 : doaUpdates.filter((u) => u.at > seenAt!).length
	);

	onMount(() => {
		try {
			seenAt = localStorage.getItem(SEEN_KEY) ?? '';
		} catch {
			seenAt = '';
		}

		// Remap anchor lama Portal (BootstrapMade) ke section baru, supaya
		// bookmark lama seperti #hero / #about tetap mendarat di tempat yang benar.
		const hashMap: Record<string, string> = {
			'#hero': '#beranda',
			'#about': '#beranda',
			'#portfolio': '#sistem',
			'#services': '#informasi',
			'#contact': '#kontak'
		};
		const target = hashMap[window.location.hash];
		if (target) {
			document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
		}
	});

	/** Buka panel; tandai yang sekarang tampil sebagai sudah dilihat (penanda di panel tetap). */
	let seenBeforeOpen = $state('');
	function openNotifications() {
		seenBeforeOpen = seenAt ?? '';
		notificationsOpen = true;
		const newest = doaUpdates[0]?.at;
		if (newest && newest > (seenAt ?? '')) {
			seenAt = newest;
			try {
				localStorage.setItem(SEEN_KEY, newest);
			} catch {
				// abaikan bila localStorage tidak tersedia
			}
		}
	}
</script>

<svelte:head>
	<title>{SITE.shortName} – {SITE.company}</title>
	<meta name="description" content={SITE.description} />
</svelte:head>

<div class="flex min-h-svh flex-col">
	<Topbar {notificationCount} onOpenNotifications={openNotifications} />
	<SiteHeader />

	<main id="konten" class="flex-1">
		{@render children()}
	</main>

	<SiteFooter />
</div>

<Sheet.Root bind:open={notificationsOpen}>
	<Sheet.Content side="right" class="w-full gap-0 p-0 sm:max-w-md">
		<NotificationsPanel items={doaUpdates} seenAt={seenBeforeOpen} />
	</Sheet.Content>
</Sheet.Root>
