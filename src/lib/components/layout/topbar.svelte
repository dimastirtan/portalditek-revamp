<script lang="ts">
	import { CalendarDays, Bell } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/shared/theme-toggle.svelte';

	type Props = {
		/** Callback saat tombol Notifications diklik (panel pembaruan dokumen DOA). */
		onOpenNotifications?: () => void;
		/** Jumlah pembaruan DOA yang belum dilihat — badge di tombol. */
		notificationCount?: number;
	};

	let { onOpenNotifications, notificationCount = 0 }: Props = $props();

	// Zona waktu eksplisit: tanggal di server (SSR) & browser sama, apa pun zona servernya.
	const today = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Jakarta',
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
				onclick={onOpenNotifications}
				aria-label={notificationCount ? `Notifications, ${notificationCount} new` : 'Notifications'}
				class="hover:bg-primary-foreground/10 relative inline-flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors"
			>
				<Bell class="size-3.5" />
				<span class="hidden sm:inline">Notifications</span>
				{#if notificationCount}
					<span
						class="bg-destructive inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4 font-semibold text-white"
						aria-hidden="true"
					>
						{notificationCount > 9 ? '9+' : notificationCount}
					</span>
				{/if}
			</button>

			<span class="bg-primary-foreground/20 mx-1 h-4 w-px" aria-hidden="true"></span>
			<ThemeToggle />
		</div>
	</div>
</div>
