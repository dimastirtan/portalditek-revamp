import { MediaQuery } from 'svelte/reactivity';

const DEFAULT_MOBILE_BREAKPOINT = 768;

/**
 * Reactive media query untuk deteksi viewport mobile.
 * Pakai: `const isMobile = new IsMobile();` lalu baca `isMobile.current`.
 */
export class IsMobile extends MediaQuery {
	constructor(breakpoint: number = DEFAULT_MOBILE_BREAKPOINT) {
		super(`max-width: ${breakpoint - 1}px`);
	}
}
