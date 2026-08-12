<script lang="ts">
	import {
		Hero,
		FeatureGrid,
		InfoPanel,
		NewsSection,
		BirthdaySection,
		ContactSection
	} from '$lib/components/home';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Hero />
	<div class="w-1/2 h-12 bg-primary/90 absolute [clip-path:polygon(0_0px,100%_0,95%_50px,0_20px)]" aria-hidden="true"></div>
	<div class="w-1/2 h-12 bg-primary/50 mt-1 ms-1 absolute [clip-path:polygon(0_0px,100%_0,95%_50px,0_20px)]" aria-hidden="true"></div>
<FeatureGrid />
<InfoPanel articles={data.articles} events={data.events} downloads={data.downloads} />
	<div class="w-1/2 h-12 bg-primary/90 absolute right-0 [clip-path:polygon(0_0px,100%_0,95%_50px,0_20px)] -scale-x-100" aria-hidden="true"></div>
	<div class="w-1/2 h-12 bg-primary/50 mt-1 ms-1 right-0 absolute [clip-path:polygon(0_0px,100%_0,95%_50px,0_20px)] -scale-x-100" aria-hidden="true"></div>
<NewsSection news={data.news} />
<BirthdaySection groups={data.birthdays} />
<ContactSection />
