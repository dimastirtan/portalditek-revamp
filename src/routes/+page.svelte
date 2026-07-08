<script lang="ts">
	import {
		Hero,
		AboutSection,
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
<AboutSection />
<FeatureGrid />
<InfoPanel articles={data.articles} events={data.events} downloads={data.downloads} />
<NewsSection news={data.news} />
<BirthdaySection groups={data.birthdays} />
<ContactSection />
