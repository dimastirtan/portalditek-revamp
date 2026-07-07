<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft, TriangleAlert } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{page.status} – Portal DTP</title>
</svelte:head>

<div class="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
	<div
		class="bg-secondary text-muted-foreground flex size-12 items-center justify-center rounded-lg"
	>
		<TriangleAlert class="size-6" />
	</div>
	<p class="font-display mt-6 text-5xl font-semibold tracking-tight">{page.status}</p>
	<p class="text-muted-foreground mt-3 text-sm leading-relaxed">
		{page.error?.message ?? 'Halaman yang Anda cari tidak ditemukan.'}
	</p>
	<div class="mt-8">
		<Button href="/" variant="outline">
			<ArrowLeft class="size-4" />
			Kembali ke beranda
		</Button>
	</div>
</div>
