<script lang="ts">
	import type { SystemLink } from '$lib/types/nav';
	import Breadcrumb from './breadcrumb.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowLeft, ExternalLink, Server } from '@lucide/svelte';

	let { system }: { system: SystemLink } = $props();
</script>

<div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
	<Breadcrumb items={[{ label: 'Sistem' }, { label: system.label }]} />

	<div class="mt-8 rounded-xl border p-8 sm:p-10">
		<div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-lg">
			<Server class="size-6" />
		</div>

		<h1 class="font-display mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
			{system.label}
		</h1>
		<p class="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
			{system.description}
		</p>

		<div class="bg-secondary/50 mt-6 rounded-lg border p-4">
			<p class="text-sm leading-relaxed">
				Sistem ini diakses langsung melalui alamat internal (DNS) di jaringan PT Dirgantara
				Indonesia. Hubungkan perangkat Anda ke jaringan internal, lalu buka sistem melalui tautan
				resmi yang disediakan oleh unit terkait.
			</p>
		</div>

		<div class="mt-8 flex flex-wrap gap-3">
			<Button href="/" variant="outline">
				<ArrowLeft class="size-4" />
				Kembali ke beranda
			</Button>
			{#if system.external && system.href.startsWith('http')}
				<Button href={system.href} target="_blank" rel="noopener">
					Buka sistem
					<ExternalLink class="size-4" />
				</Button>
			{/if}
		</div>
	</div>
</div>
