<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { Sun, Moon } from '@lucide/svelte';
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	class="hover:bg-primary-foreground/10 inline-flex size-7 items-center justify-center rounded transition-colors"
	aria-label={theme.current === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
	title={theme.current === 'dark' ? 'Mode terang' : 'Mode gelap'}
>
	{#if theme.current === 'dark'}
		<Sun class="size-3.5" />
	{:else}
		<Moon class="size-3.5" />
	{/if}
</button>
