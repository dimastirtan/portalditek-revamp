<script lang="ts">
	import {
		MAIL_LOGIN_URL,
		MAIL_LOGIN_TARGET,
		MAIL_FIELD_USERNAME,
		MAIL_FIELD_PASSWORD
	} from '$lib/config/mail';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Mail, LogIn } from '@lucide/svelte';

	let username = $state('');
	let password = $state('');
	let error = $state('');

	let formEl = $state<HTMLFormElement | null>(null);

	function handleSubmit(e: SubmitEvent) {
		// Validasi sama seperti Portal lama: dua field wajib terisi.
		if (!username.trim() || !password.trim()) {
			e.preventDefault();
			error = 'Nama pengguna dan kata sandi wajib diisi.';
			return;
		}
		error = '';
		// Biarkan browser melakukan POST ke MAIL_LOGIN_URL di tab baru
		// (perilaku identik Portal lama). Tidak dicegah.
	}
</script>

<div class="bg-card rounded-xl border p-6">
	<div class="flex items-center gap-2">
		<Mail class="text-primary size-5" />
		<h3 class="font-display text-lg font-semibold">Login email internal</h3>
	</div>
	<p class="text-muted-foreground mt-1 text-sm">
		Masuk cepat ke webmail internal Direktorat Teknologi dan Pengembangan.
	</p>

	<form
		bind:this={formEl}
		method="post"
		action={MAIL_LOGIN_URL}
		target={MAIL_LOGIN_TARGET}
		name="login"
		class="mt-5 space-y-4"
		onsubmit={handleSubmit}
	>
		<div class="space-y-1.5">
			<label for="mail-username" class="text-sm font-medium">Nama pengguna</label>
			<input
				id="mail-username"
				name={MAIL_FIELD_USERNAME}
				bind:value={username}
				type="text"
				autocomplete="username"
				placeholder="nama.pengguna"
				class="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
			/>
		</div>

		<div class="space-y-1.5">
			<label for="mail-password" class="text-sm font-medium">Kata sandi</label>
			<input
				id="mail-password"
				name={MAIL_FIELD_PASSWORD}
				bind:value={password}
				type="password"
				autocomplete="current-password"
				placeholder="••••••••"
				class="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
			/>
		</div>

		{#if error}
			<p class="text-destructive text-sm" role="alert">{error}</p>
		{/if}

		<Button type="submit" class="w-full">
			<LogIn class="size-4" />
			Masuk
		</Button>
	</form>
</div>
