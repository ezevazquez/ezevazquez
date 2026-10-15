# AGENTS.md — ezevazquez.com

Personal site of Ezequiel (Eze) Vazquez, Technical PM based in Buenos Aires (works remote). The site is being REDESIGNED from scratch.

## Read first
Full context lives in `docs/redesign/` (git-ignored, local only — never commit it):
1. `docs/redesign/01-perfil.md` — who Eze is, experience, projects
2. `docs/redesign/02-posicionamiento.md` — audience, message, approved copy
3. `docs/redesign/03-estructura.md` — pages, sections, navigation
4. `docs/redesign/referencias-visuales.md` — deep breakdown of 7 reference sites + visual decisions
5. `docs/redesign/04-confidencial.md` — what must NOT be published
6. `docs/redesign/05-pendientes.md` — open decisions / next steps

## Stack (current)
Next.js 14 (app router), React 18, TypeScript, Tailwind, framer-motion, shadcn-style UI. Bilingual ES/EN via `components/language-provider.tsx` + `lib/translation/{es,en}.ts` (currently defaults to EN, persisted in localStorage).
Animation libs likely needed: GSAP + ScrollTrigger and Lenis (smooth scroll) — confirm with Eze before adding deps.

## Rules
- Message must be crystal clear; design can be playful, animated, funny. "Clear" does not mean "minimal".
- Little text. Cut redundancy.
- All copy in both ES (Argentine, informal, voseo) and EN.
- Detect browser language on first visit (navigator.language: es* → ES, else EN); manual switch overrides and persists.
- Respect `prefers-reduced-motion` and keep the site accessible and fast.
- Never publish client names, internal architecture, prices, or links listed in `04-confidencial.md` without Eze's explicit OK.
- Don't invent metrics, testimonials or cases. Ask Eze.
- Eze decides; propose, don't push or deploy without asking.
