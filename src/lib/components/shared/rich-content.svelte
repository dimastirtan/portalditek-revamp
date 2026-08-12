<script lang="ts">
	let { html = '' }: { html?: string } = $props();
</script>

<!-- Konten sudah dibersihkan di server (cleanRichHtml). -->
<div class="portal-rich max-w-none text-sm leading-relaxed">
	{@html html}
</div>

<style>
	.portal-rich {
		color: var(--foreground);
	}
	/* Amankan sisa warna/latar lama supaya konten selalu terbaca di light & dark. */
	.portal-rich :global(font),
	.portal-rich :global(span),
	.portal-rich :global(td),
	.portal-rich :global(th),
	.portal-rich :global(div),
	.portal-rich :global(h1),
	.portal-rich :global(h2),
	.portal-rich :global(h3),
	.portal-rich :global(h4),
	.portal-rich :global(h5) {
		color: inherit;
	}
	.portal-rich :global(*) {
		background-color: transparent !important;
	}
	.portal-rich :global(p) {
		margin: 0 0 0.75rem;
	}
	.portal-rich :global(ul),
	.portal-rich :global(ol) {
		margin: 0 0 0.75rem;
		padding-left: 1.25rem;
		list-style: revert;
	}
	.portal-rich :global(li) {
		margin: 0.15rem 0;
	}
	.portal-rich :global(a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.portal-rich :global(b),
	.portal-rich :global(strong) {
		font-weight: 600;
	}
	.portal-rich :global(table) {
		max-width: 100%;
		height: auto !important;
		border-collapse: collapse;
	}
	.portal-rich :global(img) {
		max-width: 100%;
		height: auto;
	}
	.portal-rich :global(h1),
	.portal-rich :global(h2),
	.portal-rich :global(h3) {
		font-weight: 600;
		margin: 1rem 0 0.5rem;
	}
</style>
