# Anusandhan Setu — Director Demo Design Architecture

Updated: 10 August 2026

## Design objective

The interface must communicate three things within the first minute:

1. This is national research infrastructure, not a student project gallery.
2. Evidence and institutional control come before discovery and matchmaking.
3. A funded next step is visible even when a research asset is not deployment-ready.

The visual character is **civic precision**: authoritative navy, mineral paper, restrained cobalt, self-hosted editorial typography, exact data states, and motion used as wayfinding rather than decoration.

## Open design-system synthesis

| Source | Adopted | Deliberately not copied |
| --- | --- | --- |
| Material 3 Expressive | Adaptive hierarchy, contrasting component shapes, visible process state | Consumer-scale colour abundance and playful shape changes |
| IBM Carbon | Productive vs expressive motion, grid-led choreography, precise status language | Enterprise-grey visual identity |
| Adobe Spectrum 2 | Contextual density, inclusive scale, polished detail system | Adobe product styling |
| shadcn/ui | Source-owned component composition, token-first theming, consistent density | Recognisable default dashboard aesthetic |
| Radix / React Aria | Accessible component behaviour, keyboard and focus expectations | Unnecessary dependencies for native controls already handled well by HTML |
| USWDS / WCAG 2.2 | Plain-language labels, strong focus state, responsive targets, no motion dependency | Government-template appearance |

## Foundations

- **Typography:** self-hosted Manrope Variable for interface text; Newsreader Variable for research/editorial headlines; system monospace for IDs and financial values.
- **Colour:** OKLCH-based tokens. `ink` and `paper` establish authority; cobalt is reserved for navigation and primary action; teal, ochre and vermilion communicate evidence state.
- **Grid:** 8 px base rhythm, 1180 px content frame, asymmetric 8/4 detail layout, responsive single-column collapse.
- **Shape:** 12–18 px radii on primary surfaces, pill geometry only for compact states, squared evidence seams for analytical content.
- **Elevation:** borders establish hierarchy; shadows appear only on active, floating or decision surfaces.

## Motion language

- Productive motion: 160–240 ms for filters, accordion disclosure and hover feedback.
- Expressive motion: one 420–560 ms page entrance and key outcome confirmation.
- Rows enter in a 20–35 ms stagger, remaining under 500 ms total.
- Movement follows vertical or horizontal grid axes; no bounce, elastic overshoot or continuous parallax.
- `MotionConfig reducedMotion="user"` disables transform/layout motion when requested by the operating system.

## Component architecture

- `AppHeader`: institutional identity, pilot status, role context.
- `ScreenNav`: four-stage product workflow with current-stage progress.
- `PageFrame`: screen transition and stable content measure.
- `SignalPill`: one fact per state; verification is never collapsed into one universal badge.
- `EvidenceSection`: title seam, metadata and controlled disclosure.
- `DecisionCard`: one financially or operationally meaningful next action.
- `RequirementLedger`: requirement → evidence → gap → resolution; never a black-box score.
- `MilestoneRail`: acceptance criteria, escrow value and dependency state.

## Accessibility contract

- WCAG 2.2 AA is the implementation target.
- Keyboard focus uses a high-contrast 3 px ring and is never removed.
- Interactive targets are at least 40 px in this demo and should target 44 px where layout permits.
- Status is communicated using text and geometry, never colour alone.
- Horizontal navigation and filters remain operable without drag-only interaction.
- Animations have no information-only state and respect reduced-motion preferences.

## Primary references

- Material Design 3: https://m3.material.io/
- IBM Carbon motion: https://carbondesignsystem.com/elements/motion/overview/
- Adobe Spectrum 2: https://s2.spectrum.adobe.com/
- shadcn/ui: https://ui.shadcn.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives/docs/overview/introduction
- React Spectrum / React Aria: https://github.com/adobe/react-spectrum
- Motion for React: https://motion.dev/docs/react
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- USWDS accessibility: https://designsystem.digital.gov/documentation/accessibility/
