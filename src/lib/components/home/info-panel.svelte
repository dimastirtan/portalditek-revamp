<script lang="ts">
	import SectionHeading from '$lib/components/shared/section-heading.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatDate } from '$lib/utils';
	import { FileText, CalendarClock, Download, MapPin } from '@lucide/svelte';
	import articles from '$lib/data/articles.json';
	import events from '$lib/data/events.json';
	import downloads from '$lib/data/downloads.json';
	import type { Article, AgendaEvent, Download as DownloadType } from '$lib/types/content';

	const articleList = articles as Article[];
	const eventList = events as AgendaEvent[];
	const downloadList = downloads as DownloadType[];
</script>

<section id="informasi" class="border-b">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
		<SectionHeading
			eyebrow="Informasi"
			title="Pusat informasi"
			description="Artikel terbaru, agenda kegiatan, dan berkas yang dapat diunduh."
		/>

		<div class="mt-8 grid gap-6 lg:grid-cols-3">
			<!-- Artikel -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-base">
						<FileText class="text-primary size-4" />
						Artikel
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="divide-y">
						{#each articleList as item (item.id)}
							<li class="py-3 first:pt-0 last:pb-0">
								<a href={item.url} class="group block">
									<p
										class="group-hover:text-primary text-sm leading-snug font-medium transition-colors"
									>
										{item.title}
									</p>
									<p class="text-muted-foreground mt-1 text-xs">{formatDate(item.publishedAt)}</p>
								</a>
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>

			<!-- Agenda -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-base">
						<CalendarClock class="text-primary size-4" />
						Agenda
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="divide-y">
						{#each eventList as item (item.id)}
							<li class="flex gap-3 py-3 first:pt-0 last:pb-0">
								<div
									class="bg-secondary text-secondary-foreground flex size-11 shrink-0 flex-col items-center justify-center rounded-md text-center leading-none"
								>
									<span class="text-sm font-semibold">
										{new Date(item.date).getDate()}
									</span>
									<span class="text-[10px] uppercase">
										{formatDate(item.date, { month: 'short', day: undefined, year: undefined })}
									</span>
								</div>
								<div class="min-w-0">
									<p class="text-sm leading-snug font-medium">{item.title}</p>
									{#if item.location}
										<p class="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
											<MapPin class="size-3 shrink-0" />
											<span class="truncate">{item.location}</span>
										</p>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>

			<!-- Download -->
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-base">
						<Download class="text-primary size-4" />
						Unduhan
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="divide-y">
						{#each downloadList as item (item.id)}
							<li class="py-3 first:pt-0 last:pb-0">
								<a href={item.url} class="group flex items-center justify-between gap-3" download>
									<div class="min-w-0">
										<p
											class="group-hover:text-primary text-sm leading-snug font-medium transition-colors"
										>
											{item.title}
										</p>
										<p class="text-muted-foreground mt-1 text-xs">
											{#if item.kind}{item.kind}{/if}{#if item.kind && item.size}
												·
											{/if}{#if item.size}{item.size}{/if}
										</p>
									</div>
									<Download
										class="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors"
									/>
								</a>
							</li>
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>
