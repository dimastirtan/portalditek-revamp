<script lang="ts">
	import SystemPlaceholder from '$lib/components/shared/system-placeholder.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.system.label} – Direktorat Teknologi</title>
</svelte:head>

<SystemPlaceholder system={data.system} />
