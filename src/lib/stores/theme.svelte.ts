import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'dtp:theme';

function getInitial(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class ThemeState {
	current = $state<Theme>('light');

	constructor() {
		if (browser) {
			this.current = getInitial();
			this.apply();
		}
	}

	private apply() {
		if (!browser) return;
		document.documentElement.classList.toggle('dark', this.current === 'dark');
	}

	toggle() {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		if (browser) {
			localStorage.setItem(STORAGE_KEY, this.current);
			this.apply();
		}
	}
}

export const theme = new ThemeState();
