import {
	S as h,
	i as b,
	s as v,
	G as f,
	y as E,
	z as C,
	A as k,
	L as x,
	O as T,
	g,
	d as m,
	B as w,
	I as p,
	H as y,
	Z as L,
	P,
	Q as z,
	R as S,
	T as j
} from './index.866f6089.js';
import { P as q } from './Popper.9b00af54.js';
import { t as A } from './tw-merge.7c38a84e.js';
function B(r) {
	let e;
	const n = r[4].default,
		o = P(n, r, r[6], null);
	return {
		c() {
			o && o.c();
		},
		l(s) {
			o && o.l(s);
		},
		m(s, t) {
			o && o.m(s, t), (e = !0);
		},
		p(s, t) {
			o && o.p && (!e || t & 64) && z(o, n, s, s[6], e ? j(n, s[6], t, null) : S(s[6]), null);
		},
		i(s) {
			e || (g(o, s), (e = !0));
		},
		o(s) {
			m(o, s), (e = !1);
		},
		d(s) {
			o && o.d(s);
		}
	};
}
function G(r) {
	let e, n;
	const o = [{ rounded: !0 }, { shadow: !0 }, r[1], { class: r[0] }];
	let s = { $$slots: { default: [B] }, $$scope: { ctx: r } };
	for (let t = 0; t < o.length; t += 1) s = f(s, o[t]);
	return (
		(e = new q({ props: s })),
		e.$on('show', r[5]),
		{
			c() {
				E(e.$$.fragment);
			},
			l(t) {
				C(e.$$.fragment, t);
			},
			m(t, a) {
				k(e, t, a), (n = !0);
			},
			p(t, [a]) {
				const l = a & 3 ? x(o, [o[0], o[1], a & 2 && T(t[1]), a & 1 && { class: t[0] }]) : {};
				a & 64 && (l.$$scope = { dirty: a, ctx: t }), e.$set(l);
			},
			i(t) {
				n || (g(e.$$.fragment, t), (n = !0));
			},
			o(t) {
				m(e.$$.fragment, t), (n = !1);
			},
			d(t) {
				w(e, t);
			}
		}
	);
}
function H(r, e, n) {
	const o = ['type', 'defaultClass'];
	let s = p(e, o),
		{ $$slots: t = {}, $$scope: a } = e,
		{ type: l = 'dark' } = e,
		{ defaultClass: u = 'py-2 px-3 text-sm font-medium' } = e;
	const d = {
		dark: 'bg-gray-900 text-white dark:bg-gray-700',
		light: 'border-gray-200 bg-white text-gray-900',
		auto: ' bg-white text-gray-900 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-700',
		custom: ''
	};
	let c;
	function _(i) {
		L.call(this, r, i);
	}
	return (
		(r.$$set = (i) => {
			n(8, (e = f(f({}, e), y(i)))),
				n(1, (s = p(e, o))),
				'type' in i && n(2, (l = i.type)),
				'defaultClass' in i && n(3, (u = i.defaultClass)),
				'$$scope' in i && n(6, (a = i.$$scope));
		}),
		(r.$$.update = () => {
			s.color ? n(2, (l = 'custom')) : n(1, (s.color = 'none'), s),
				['light', 'auto'].includes(l) && n(1, (s.border = !0), s),
				n(0, (c = A('tooltip', u, d[l], e.class)));
		}),
		(e = y(e)),
		[c, s, l, u, t, _, a]
	);
}
class R extends h {
	constructor(e) {
		super(), b(this, e, H, G, v, { type: 2, defaultClass: 3 });
	}
}
async function I(r) {
	if ('clipboard' in navigator) await navigator.clipboard.writeText(r);
	else {
		const e = document.createElement('input');
		(e.type = 'text'),
			(e.disabled = !0),
			e.style.setProperty('position', 'fixed'),
			e.style.setProperty('z-index', '-100'),
			e.style.setProperty('pointer-events', 'none'),
			e.style.setProperty('opacity', '0'),
			(e.value = r),
			document.body.appendChild(e),
			e.click(),
			e.select(),
			document.execCommand('copy'),
			document.body.removeChild(e);
	}
}
const Z = (r, e) => {
	async function n() {
		if (s)
			try {
				await I(s), r.dispatchEvent(new CustomEvent('svelte-copy', { detail: s }));
			} catch (t) {
				r.dispatchEvent(new CustomEvent('svelte-copy:error', { detail: t }));
			}
	}
	let o = typeof e == 'string' ? ['click'] : [e.events].flat(1),
		s = typeof e == 'string' ? e : e.text;
	return (
		o.forEach((t) => {
			r.addEventListener(t, n, !0);
		}),
		{
			update: (t) => {
				const a = typeof t == 'string' ? ['click'] : [t.events].flat(1),
					l = typeof t == 'string' ? t : t.text,
					u = a.filter((c) => !o.includes(c)),
					d = o.filter((c) => !a.includes(c));
				u.forEach((c) => {
					r.addEventListener(c, n, !0);
				}),
					d.forEach((c) => {
						r.removeEventListener(c, n, !0);
					}),
					(o = a),
					(s = l);
			},
			destroy: () => {
				o.forEach((t) => {
					r.removeEventListener(t, n, !0);
				});
			}
		}
	);
};
export { R as T, Z as c };
