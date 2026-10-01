# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-01
- Primary product surfaces: home, lessons index, lesson detail quiz, flashcards, build notes, 404.
- Evidence reviewed: sibling starter conventions, What Framework router/signals README, user request for learning/reference templates.

## Brand
- Personality: optimistic, yellow-sky, accessible, friendly but not childish.
- Trust signals: visible progress, reset control, persisted state message, concrete lesson copy.
- Avoid: generic dashboard chrome, fake AI tutor claims, dark neon overlap with other starters.

## Product goals
- Goals: demonstrate signals, computed values, effects, global state, routeable content, persistence, reset, static Vura output, and agent-readable notes.
- Non-goals: real accounts, paid APIs, LLM-generated lessons, grades, backend sync.
- Success signals: progress survives reload, reset clears state, lessons deep-link, flashcards advance, storage-denied fallback does not crash.

## Personas and jobs
- Primary personas: agents learning What Framework, developers browsing starter templates, educators prototyping small courses.
- User jobs: read a short lesson, answer a quiz, practice a card, resume progress later.
- Key contexts of use: starter gallery, local clone, public template repo, static Vura deployment.

## Information architecture
- Primary navigation: Home, Lessons, Practice, Build.
- Core routes/screens: `/`, `/lessons`, `/lessons/:slug`, `/practice`, `/build`, `/404`.
- Content hierarchy: progress ribbon always visible, lesson cards, focused lesson detail, practice card.

## Design principles
- Principle 1: learning state should be obvious and reversible.
- Principle 2: every concept should map to a source file agents can inspect.
- Tradeoffs: compact original lesson copy beats broad curriculum coverage.

## Visual language
- Color: sky blue, warm yellow, ink blue, green progress.
- Typography: rounded system typography for legibility and warmth.
- Spacing/layout rhythm: airy cards, large headline, compact progress ribbon.
- Shape/radius/elevation: rounded glassy cards and pill controls.
- Motion: small page entrance and card reveal; reduced-motion disables them.
- Imagery/iconography: simple geometric bird mark.

## Components
- Existing components to reuse: none; standalone starter.
- New/changed components: shell, lesson cards, quiz card, flashcard, build-note cards.
- Variants and states: complete lesson cards, revealed flashcard, quiz feedback, exact active nav.
- Token/component ownership: CSS custom properties in `src/styles.css`.

## Accessibility
- Target standard: WCAG AA.
- Keyboard/focus behavior: native links, buttons, radio inputs, and forms.
- Contrast/readability: dark ink on light backgrounds; no text on low-contrast yellow.
- Screen-reader semantics: headings, labelled nav, form labels, meaningful link text.
- Reduced motion and sensory considerations: `prefers-reduced-motion` disables animations/transitions.

## Responsive behavior
- Supported breakpoints/devices: desktop and mobile.
- Layout adaptations: hero, progress ribbon, lesson grid, build notes collapse to one column.
- Touch/hover differences: controls are large enough for touch.

## Interaction states
- Loading: static shell avoids loading state.
- Empty: 404 page for missing routes.
- Error: storage-denied fallback message.
- Success: quiz explanation and progress percentage.
- Disabled: not needed; users can retry freely.
- Offline/slow network: static client bundle; local state only.

## Content voice
- Tone: clear, encouraging, practical.
- Terminology: signals, computed values, effects, routes, progress.
- Microcopy rules: say what changed and where it is saved; avoid hype.

## Implementation constraints
- Framework/styling system: What Framework JSX with router, signals, computed, effects; vanilla CSS.
- Design-token constraints: local CSS variables only.
- Performance constraints: no backend, no external fonts, no third-party scripts.
- Compatibility constraints: Node 22, What 0.13.10, Vitest 4.1.11, Vura Platform CLI 0.3.0.
- Test/screenshot expectations: Vitest state tests and Playwright desktop/mobile learning flows.

## Open questions
- [ ] Root owner / decide final hosted URL and gallery card copy after deployment.
