<script lang="ts">
	import {
		MAIL_LOGIN_URL,
		MAIL_LOGIN_TARGET,
	} from '$lib/config/mail';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Mail, LogIn } from '@lucide/svelte';


</script>

<div class="bg-card rounded-xl border p-6 max-w-sm mx-auto max-h-50 my-auto mt-8 mb-8">
	<div class="flex items-center gap-3">
		<Mail class="text-primary size-5" />
		<h3 class="font-display text-lg font-semibold">Quick Mail</h3>
	</div>
	<p class="text-muted-foreground mt-1 text-sm">
		Masuk cepat ke webmail internal Direktorat Teknologi dan Pengembangan.
	</p>

	<form
		method="post"
		action={MAIL_LOGIN_URL}
		target={MAIL_LOGIN_TARGET}
		name="direct-to-mail-login"
		class="mt-5 space-y-4"
	>

		<Button type="submit" class="w-full">
			<LogIn class="size-4" />
			Klik untuk membuka email
		</Button>
	</form>
</div>
