<script lang="ts">
	import '../app.css';
	import { SITE } from '$lib/config/site';
	import { Topbar, SiteHeader, SiteFooter } from '$lib/components/layout';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import CalendarPanel from '$lib/components/shared/calendar-panel.svelte';
	import AnnouncementPanel from '$lib/components/shared/announcement-panel.svelte';
	import announcementsData from '$lib/data/announcements.json';
	import type { Announcement } from '$lib/types/content';
	import { onMount } from 'svelte';

	let { children } = $props();

	const announcements = announcementsData as Announcement[];
	const activeAnnouncements = announcements.filter((a) => a.active);

	let calendarOpen = $state(false);
	let announcementOpen = $state(false);

	// Hitung pengumuman yang belum dibaca. ID yang sudah dibaca disimpan di
	// localStorage supaya bell berhenti bergetar setelah karyawan membacanya.
	const STORAGE_KEY = 'dtp:read-announcements';
	let readIds = $state<string[]>([]);

	onMount(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) readIds = JSON.parse(raw);
		} catch {
			readIds = [];
		}

		// Remap anchor lama Portal (BootstrapMade) ke section baru, supaya
		// bookmark lama seperti #hero / #about tetap mendarat di tempat yang benar.
		const hashMap: Record<string, string> = {
			'#hero': '#beranda',
			'#about': '#perusahaan',
			'#portfolio': '#sistem',
			'#services': '#informasi',
			'#contact': '#kontak'
		};
		const target = hashMap[window.location.hash];
		if (target) {
			document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
		}
	});

	const unreadCount = $derived(activeAnnouncements.filter((a) => !readIds.includes(a.id)).length);

	function markAllRead() {
		readIds = activeAnnouncements.map((a) => a.id);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
		} catch {
			// abaikan bila localStorage tidak tersedia
		}
	}

	function openAnnouncement() {
		announcementOpen = true;
		markAllRead();
	}
</script>

<svelte:head>
	<title>{SITE.shortName} – {SITE.company}</title>
	<meta name="description" content={SITE.description} />
</svelte:head>

<a
	href="#konten"
	class="bg-primary text-primary-foreground focus:ring-ring sr-only rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:ring-2"
>
	Lompat ke konten
</a>

<div class="flex min-h-svh flex-col">
	<Topbar
		{unreadCount}
		onOpenCalendar={() => (calendarOpen = true)}
		onOpenAnnouncement={openAnnouncement}
	/>
	<SiteHeader />

	<main id="konten" class="flex-1">
		{@render children()}
	</main>

	<SiteFooter />
</div>

<Sheet.Root bind:open={calendarOpen}>
	<Sheet.Content side="right" class="w-full gap-0 p-0 sm:max-w-lg">
		<CalendarPanel />
	</Sheet.Content>
</Sheet.Root>

<Sheet.Root bind:open={announcementOpen}>
	<Sheet.Content side="right" class="w-full gap-0 p-0 sm:max-w-md">
		<AnnouncementPanel items={announcements} />
	</Sheet.Content>
</Sheet.Root>
