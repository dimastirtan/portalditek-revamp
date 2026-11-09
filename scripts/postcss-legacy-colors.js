/**
 * PostCSS: warna cadangan untuk browser lama — terutama Chrome/Edge 109, versi
 * terakhir di Windows 7/8/8.1 — yang belum mengenal oklch(), color-mix(), dan
 * gradien "in oklab". Berjalan setelah Tailwind, jadi token di src/app.css tetap
 * ditulis OKLCH; cadangannya dibuat otomatis saat dev/build.
 *
 *  1. Token warna oklch di :root / :host / .dark
 *     → @supports not (color: oklch(0 0 0)) { <selector> { --x: rgb(...) } }
 *  2. Tiap token warna dapat kanal --x-rgb ("r g b", atau var(--y-rgb) bila --x: var(--y)).
 *  3. Opacity Tailwind (bg-primary/10 = color-mix): cadangan bawaan Tailwind
 *     berupa warna penuh; ditimpa rgb(var(--x-rgb) / 10%) tepat sebelum blok
 *     @supports color-mix-nya, jadi browser baru tetap memakai color-mix.
 *  4. Gradien "to right in oklab" → @supports not → "to right".
 */

const THEME_SELECTORS = new Set([':root', ':host', '.dark']);
const COLOR_MIX_VAR = /color-mix\(in [\w-]+,\s*var\((--[\w-]+)\)\s+([\d.]+%)\s*,\s*transparent\)/;
const GRADIENT_SPACE = /\s+in\s+(?:oklab|oklch|lab|lch)\b/;

/**
 * OKLCH → sRGB 0–255 (dibulatkan, dipotong ke gamut sRGB).
 * @param {number} l @param {number} c @param {number} h
 */
function oklchToRgb(l, c, h) {
	const rad = (h * Math.PI) / 180;
	const a = c * Math.cos(rad);
	const b = c * Math.sin(rad);
	const lms = [
		(l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
		(l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
		(l - 0.0894841775 * a - 1.291485548 * b) ** 3
	];
	const linear = [
		4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
		-1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
		-0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2]
	];
	return linear.map((v) => {
		const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
		return Math.round(Math.min(1, Math.max(0, srgb)) * 255);
	});
}

/**
 * "oklch(0.97 0.007 247.9 / 10%)" → [r, g, b, alpha], atau null.
 * @param {string} value
 */
function parseOklch(value) {
	const m =
		/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/i.exec(
			value.trim()
		);
	if (!m) return null;
	const l = Number(m[1]) / (m[2] ? 100 : 1);
	const alpha = m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1);
	return [...oklchToRgb(l, Number(m[3]), Number(m[4])), alpha];
}

/**
 * "#2f318b" / "#000" / "#0000" → [r, g, b, alpha], atau null.
 * @param {string} value
 */
function parseHex(value) {
	const m = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.exec(value.trim());
	if (!m) return null;
	const hex = m[1].length <= 4 ? [...m[1]].map((ch) => ch + ch).join('') : m[1];
	/** @param {number} i */
	const n = (i) => parseInt(hex.slice(i, i + 2), 16);
	return [n(0), n(2), n(4), hex.length === 8 ? n(6) / 255 : 1];
}

/** @param {number[]} color */
const toRgb = ([r, g, b, a]) =>
	a < 1 ? `rgb(${r} ${g} ${b} / ${Number(a.toFixed(3))})` : `rgb(${r} ${g} ${b})`;

/** "var(--brand)" → "--brand", selain itu null. @param {string} value */
const aliasOf = (value) => /^var\((--[\w-]+)\)$/.exec(value.trim())?.[1] ?? null;

/** @returns {import('postcss').Plugin} */
export default function legacyColors() {
	return {
		postcssPlugin: 'legacy-colors',
		OnceExit(root, { AtRule, Rule, Declaration }) {
			// ── 1–2. Token warna di :root / :host / .dark ─────────────────────────
			/** @type {import('postcss').Rule[]} */
			const themeRules = [];
			root.walkRules((r) => {
				if (r.selectors.every((s) => THEME_SELECTORS.has(s.trim()))) themeRules.push(r);
			});

			/** @type {Map<import('postcss').Declaration, number[]>} */
			const literals = new Map();
			const colorNames = new Set();
			for (const r of themeRules) {
				r.each((d) => {
					if (d.type !== 'decl' || !d.prop.startsWith('--')) return;
					const parsed = parseOklch(d.value) ?? parseHex(d.value);
					if (parsed) {
						literals.set(d, parsed);
						colorNames.add(d.prop);
					}
				});
			}
			// --a: var(--b) ikut dianggap warna bila --b warna (boleh berantai).
			for (let grew = true; grew; ) {
				grew = false;
				for (const r of themeRules) {
					r.each((d) => {
						if (d.type !== 'decl' || colorNames.has(d.prop)) return;
						const ref = aliasOf(d.value);
						if (ref && colorNames.has(ref)) {
							colorNames.add(d.prop);
							grew = true;
						}
					});
				}
			}

			for (const r of themeRules) {
				/** @type {import('postcss').Declaration[]} */
				const oklchFallbacks = [];
				/** @type {import('postcss').Declaration[]} */
				const tokens = [];
				r.each((d) => {
					if (d.type === 'decl' && colorNames.has(d.prop)) tokens.push(d);
				});
				for (const d of tokens) {
					const parsed = literals.get(d);
					const ref = aliasOf(d.value);
					const channels = parsed ? parsed.slice(0, 3).join(' ') : `var(${ref}-rgb)`;
					d.after(new Declaration({ prop: `${d.prop}-rgb`, value: channels }));
					if (parsed && /^oklch\(/i.test(d.value.trim())) {
						oklchFallbacks.push(new Declaration({ prop: d.prop, value: toRgb(parsed) }));
					}
				}
				if (oklchFallbacks.length) {
					const supports = new AtRule({ name: 'supports', params: 'not (color: oklch(0 0 0))' });
					supports.append(new Rule({ selector: r.selector, nodes: oklchFallbacks }));
					r.after(supports);
				}
			}

			// ── 3. Opacity Tailwind (color-mix) ───────────────────────────────────
			/**
			 * Salin isi blok @supports color-mix, hanya deklarasi color-mix-nya,
			 * dengan nilai rgb(var(--x-rgb) / N%).
			 * @param {import('postcss').Container} container
			 * @returns {import('postcss').ChildNode[]}
			 */
			const fallbackNodes = (container) => {
				/** @type {import('postcss').ChildNode[]} */
				const out = [];
				container.each((node) => {
					if (node.type === 'decl') {
						if (!COLOR_MIX_VAR.test(node.value)) return;
						const value = node.value.replace(
							new RegExp(COLOR_MIX_VAR.source, 'g'),
							'rgb(var($1-rgb) / $2)'
						);
						out.push(new Declaration({ prop: node.prop, value, important: node.important }));
					} else if (node.type === 'rule') {
						const nodes = fallbackNodes(node);
						if (nodes.length) out.push(new Rule({ selector: node.selector, nodes }));
					} else if (node.type === 'atrule') {
						const nodes = fallbackNodes(node);
						if (nodes.length) out.push(new AtRule({ name: node.name, params: node.params, nodes }));
					}
				});
				return out;
			};

			/** @type {import('postcss').AtRule[]} */
			const mixBlocks = [];
			root.walkAtRules('supports', (a) => {
				if (a.params.includes('color-mix')) mixBlocks.push(a);
			});
			for (const a of mixBlocks) {
				const nodes = fallbackNodes(a);
				if (nodes.length) a.before(nodes);
			}

			// ── 4. Gradien "in oklab" ─────────────────────────────────────────────
			/** @type {import('postcss').Declaration[]} */
			const gradients = [];
			root.walkDecls('--tw-gradient-position', (d) => {
				if (GRADIENT_SPACE.test(d.value)) gradients.push(d);
			});
			for (const d of gradients) {
				const r = d.parent;
				if (r?.type !== 'rule') continue;
				const value = d.value.replace(GRADIENT_SPACE, '').trim() || 'to bottom';
				const supports = new AtRule({
					name: 'supports',
					params: 'not (background-image: linear-gradient(in lab, red, red))'
				});
				supports.append(
					new Rule({
						selector: /** @type {import('postcss').Rule} */ (r).selector,
						nodes: [new Declaration({ prop: d.prop, value })]
					})
				);
				r.after(supports);
			}
		}
	};
}
legacyColors.postcss = true;
