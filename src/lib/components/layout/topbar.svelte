<script lang="ts">
	import { CalendarDays, Bell } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/shared/theme-toggle.svelte';
	export { onOpenCalendar, onOpenAnnouncement } from '$lib/components/layout/topbar.svelte';

	type Props = {
		/** Callback saat tombol Kalender diklik (modal diisi di M3). */
		onOpenCalendar?: () => void;
		/** Callback saat tombol Pengumuman diklik (modal diisi di M3). */
		onOpenAnnouncement?: () => void;
		/** Jumlah pengumuman belum dibaca — menampilkan indikator di bell. */
		unreadCount?: number;
	};

	let { onOpenCalendar, onOpenAnnouncement, unreadCount = 0 }: Props = $props();

	const today = new Intl.DateTimeFormat('id-ID', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date());
</script>

<div class="bg-primary text-primary-foreground">
	<div
		class="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 text-xs sm:px-6 lg:px-8"
	>
		<p class="hidden items-center gap-1.5 font-medium sm:flex">
			<CalendarDays class="size-3.5 opacity-80" />
			<span class="capitalize">{today}</span>
		</p>

		<div class="flex items-center gap-1">
			<button
				type="button"
				onclick={onOpenCalendar}
				class="hover:bg-primary-foreground/10 inline-flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors"
			>
				<CalendarDays class="size-3.5 sm:hidden" />
				Kalender
			</button>

			<span class="bg-primary-foreground/20 mx-1 h-4 w-px" aria-hidden="true"></span>
			<ThemeToggle />
		</div>
	</div>
</div>
