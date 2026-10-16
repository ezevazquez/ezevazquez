# Eze Vazquez design system

This is the implementation source of truth for the redesign. It encodes the visual language already used by the site; it does not introduce a second brand.

## Foundations

### Token layers

1. **Primitives** live in `app/globals.css` as `--primitive-*`. They are raw RGB values.
2. **Semantic tokens** describe intent: `--color-canvas`, `--color-paper`, `--color-action`, and status colors.
3. **Component tokens** describe the shared UI patterns: hero, deck and controls.

Use Tailwind semantic utilities in React. For example: `bg-canvas`, `text-paper`, `bg-signal`, `text-success`, `bg-sheet`. Opacity modifiers remain available: `bg-canvas/80`.

Never add a raw hex value to a React component. Add a primitive and semantic alias first when a genuinely new color is needed.

### Color roles

| Token | Role |
| --- | --- |
| `canvas` | Default dark page surface |
| `canvas-raised` / `canvas-elevated` | Dark layered surfaces |
| `paper` | Primary light text and inverse controls |
| `sheet` | Light editorial/about surface |
| `signal` | Primary action, active navigation and focus |
| `success`, `warning`, `danger` | Terminal and interaction status only |

### Typography

| Role | Family | Use |
| --- | --- | --- |
| Display | Syne | Page and deck titles |
| Body | Outfit | Supporting copy |
| Mono | DM Mono | Navigation, labels, system UI, terminal |

### Motion

`--duration-fast` is for press and hover feedback. `--duration-base` is for a deck/page transition. Use the existing `--ease-out` and honor `prefers-reduced-motion`.

## Component contracts

### Hero deck

- `--hero-bg`: page canvas.
- `--deck-bg`, `--deck-layer-bg`, `--deck-border`: stacked editorial card.
- Manual navigation only: white inverse arrow controls plus keyboard arrows while focused.
- The visible intro lives in the first card; do not duplicate it with a hero subtitle outside the deck.

### Controls

- Primary CTA: `--control-primary-bg` / `--control-primary-fg`.
- Inverse icon control: `--control-inverse-bg` / `--control-inverse-fg`.
- All controls use the shared `press` feedback and a visible focus state.

### Loader terminal

- Loader owns the signal-blue background.
- The terminal card remains dark with paper-colored content for contrast.
- Status colors may be used only for window dots and terminal state.

### Floating chrome

- Bottom navigation, language switch, toasts, canvas controls and stickers share the canvas/paper/signal roles.
- Preserve safe-area spacing and a visible focus ring.
