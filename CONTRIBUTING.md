# Contributing

Thanks for helping improve **react-native-smart-bottom-bars**. The library ships with **zero runtime dependencies** and works unmodified in Expo Go and React Native CLI — please keep both invariants.

## Ways to help

- **Report a bug** — open an [issue](https://github.com/bhavesh2706/smart-bottom-bar/issues) with the variant, platform (iOS / Android / web), RN or Expo SDK version, New or old architecture, a minimal `<SmartBottomBar … />` snippet and a screenshot or screen recording.
- **Request a feature** — describe the use case first (what your users need), then the API you have in mind.
- **Send a PR** — small, focused changes are reviewed fastest.

## Prerequisites

- Node.js 18+
- Android Studio (emulator or a physical device with USB debugging + `adb`) and/or Xcode for the iOS simulator
- No global Expo CLI needed — everything runs through `npx expo`

## Setup

```sh
git clone https://github.com/bhavesh2706/smart-bottom-bar.git
cd smart-bottom-bar
npm install          # also builds lib/ via `prepare`

# example app (Expo, links the package with file:..)
cd example && npm install
```

## Project layout

```
src/
  SmartBottomBar.tsx     variant switch (single public component)
  hooks/useBarEngine.ts  shared state: active tab, palette, insets, keyboard, FAB split
  components/            BarShell, ItemRow, BarItem, FabButton, Badge, GlassSurface, GlassLens…
  variants/              one dumb layout per style (FlatBar, LiquidGlassBar, WaveBar…)
  flat.ts, curved.ts…    tree-shakeable entry per variant
  theme.ts / types.ts / utils.ts
  __tests__/
example/                 Expo playground (every variant + toggles)
media/                   README GIFs (not published to npm)
```

Variant layouts stay "dumb": logic lives in `useBarEngine`, visuals reuse the shared components. Prefer extending a shared component over adding variant-specific code.

## Verify every change

From the **repo root** (not `example/`):

```sh
npm run typecheck    # tsc --noEmit
npm test             # jest (update snapshots only after reviewing the diff: npx jest -u)
npm run build        # bob build — the example type-checks against lib/
```

For UI or behavior changes, also run the example on a **real Android device** and the **iOS simulator**:

```sh
cd example
npx expo run:android      # or: npx expo run:ios
# physical Android + Metro on another port/machine:
adb reverse tcp:8081 tcp:8081
```

### UI checklist

Use the example's toggles and check each affected variant in:

- [ ] **light** and **dark** theme
- [ ] **center FAB** off · raised · embedded (Liquid Glass)
- [ ] **custom: on** — the preset that enables every customization prop
- [ ] tapping every tab, the FAB, re-tapping the active tab, and focusing the text field (keyboard hide)
- [ ] large font size (Accessibility settings) and RTL if you touched layout
- [ ] icons visible on every surface (row, FAB, wave bubble, sidebar rail) — the classic regression is an icon tinted the same color as its background

## Working rules

1. **No regressions** — re-check flows that already worked, not just the new one.
2. **Zero runtime deps** — never add a `dependency`. Optional integrations (native glass, haptics, gradients) are passed in by the host app as props / render functions.
3. **Opt-in, backward compatible** — new props are optional and their defaults keep today's look and behavior.
4. **Positive and negative tests** — every feature or bugfix gets a unit test for the happy path and the edge cases (missing / disabled items, `'none'`, `0`, empty objects…).
5. **Performance** — native-driver animations, memoized rows, no work on every render; inline `colors` / `style` objects must not cause re-theming.
6. **Accessibility** — keep `tab` roles, selected / disabled state, 44×44 targets, Reduce Motion / Reduce Transparency support.
7. **Consistency** — reuse existing names and slots (`style.indicator`, `colors.fab`…) before inventing new ones, and document every new prop in the README prop reference.

## Adding a variant

1. Add the name to `BottomBarVariant` in `types.ts`.
2. Height / palette in `theme.ts` (`defaultBarHeight`, `paletteFor`) if it differs.
3. Layout in `src/variants/` built from the shared components.
4. Entry file (`src/<name>.ts` via `createVariantBar`) and a matching `exports` entry in `package.json`.
5. Case in `SmartBottomBar.tsx`, chip in `example/App.tsx`.
6. Tests (behavior + snapshot) and a README row in **Variants**.

## Pull requests

- Keep diffs focused; one feature or fix per PR.
- Describe **what** changed, **why**, and **how you tested** (typecheck, jest, devices / variants checked). Screenshots or GIFs for visual changes.
- Don't run Prettier over the whole README (it reflows the tables) — format only the code you touched (`npm run format:write` covers `src/`).
- Local notes, IDE / agent files and secrets (`.env*`, keystores, credentials) are gitignored — never force-add them.

## License

By contributing you agree that your contributions are licensed under the [MIT License](LICENSE).
