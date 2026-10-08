# react-native-smart-bottom-bars

[![npm version](https://img.shields.io/npm/v/react-native-smart-bottom-bars.svg)](https://www.npmjs.com/package/react-native-smart-bottom-bars)
[![license](https://img.shields.io/npm/l/react-native-smart-bottom-bars.svg)](LICENSE)
![types](https://img.shields.io/badge/types-TypeScript-3178C6.svg)
![dependencies](https://img.shields.io/badge/runtime%20deps-0-brightgreen.svg)
![platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)
[![YouTube demo](https://img.shields.io/badge/YouTube-Watch%20demo-FF0000?logo=youtube&logoColor=white)](https://youtube.com/shorts/egPw4GF83TI)

One React Native **bottom tab bar**, **nine styles** — flat, curved, floating, wave, **Liquid Glass** (iOS 26 look), notched FAB, Material 3, segmented and a tablet sidebar. Center FAB, badges, dark mode, RTL and full theming. **Zero runtime dependencies.** Works in **Expo Go** and **React Native CLI** with no native setup.

**[npm](https://www.npmjs.com/package/react-native-smart-bottom-bars) · [GitHub](https://github.com/bhavesh2706/smart-bottom-bar) · [Issues](https://github.com/bhavesh2706/smart-bottom-bar/issues) · [Video demo](https://youtube.com/shorts/egPw4GF83TI) · [Example app](example/App.tsx)**

## Preview

Recorded on real devices: every variant with the center FAB on and off, then Liquid Glass in light and dark mode.

| Android | iOS |
| :---: | :---: |
| <img src="https://raw.githubusercontent.com/bhavesh2706/smart-bottom-bar/main/media/demo.gif" alt="Android: all nine variants, center FAB on and off, then Liquid Glass light and dark" width="280" /> | <img src="https://raw.githubusercontent.com/bhavesh2706/smart-bottom-bar/main/media/demo-ios.gif" alt="iOS: all nine variants, center FAB on and off, then Liquid Glass light and dark" width="280" /> |

**[▶ Watch the full demo on YouTube](https://youtube.com/shorts/egPw4GF83TI)** — all nine styles, center FAB on/off, Liquid Glass light & dark.

## Features

- **9 styles, one API** — switch with `variant`, or import a single style so the rest stays out of your bundle.
- **Center FAB** — raised above the bar on every horizontal style (2 tabs + FAB + 2 tabs); embedded inside the Liquid Glass capsule if you prefer; or draw your own with `renderFab`.
- **Liquid Glass** — frosted capsule with an animated selection lens, no dependencies. Plug in `expo-glass-effect` or `@callstack/liquid-glass` for real native blur.
- **Theming** — brand colors for light and dark separately, fonts, icon size, active-tab styles, badges, press feedback / Android ripple, margins and shapes.
- **Smart icons** — pass a function icon and the bar tints it correctly in rows, FABs, the wave bubble and the sidebar rail.
- **Navigation-agnostic** — plain `useState`, React Navigation v6/v7 or Expo Router.
- **Production details** — safe-area aware, hides on keyboard, scroll-to-top on re-tap, haptics hook, RTL, tablet sidebar breakpoint.
- **Accessible** — `tab` roles, selected / disabled state, badge announcements, 44×44 touch targets, keyboard navigation, Reduce Motion and Reduce Transparency.
- **Light & fast** — native-driver animations, memoized rendering, no SVG, no Reanimated, no Gesture Handler. Fabric (New Architecture) ready.

## Install

Same command for Expo and React Native CLI. **No pods, no linking, no config plugin.**

```sh
npm install react-native-smart-bottom-bars
# or
yarn add react-native-smart-bottom-bars
# or
npx expo install react-native-smart-bottom-bars
```

Peer deps: `react >= 18`, `react-native >= 0.74`. **MIT** · **90 tests** · **~62 kB** packed · **zero runtime dependencies**.

| Host | React Native | Notes |
| --- | --- | --- |
| RN CLI | 0.74 – **0.87** | New and old architecture |
| Expo SDK 51–54 | 0.74 – 0.81 | Expo Go compatible |
| Expo SDK 55–56 | 0.83 – 0.85 | Expo Go compatible |
| Expo SDK 57 | 0.86 | Expo Go compatible |

> Optional: `react-native-safe-area-context` (for exact insets) and an icon set you already use (`@expo/vector-icons`, `react-native-vector-icons`, SVGs, images). The package bundles neither.

## Quick start

```tsx
import { useState } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartBottomBar, type BottomBarItem } from 'react-native-smart-bottom-bars';

const icon = (name: keyof typeof Ionicons.glyphMap) =>
  ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );

const ITEMS: BottomBarItem[] = [
  { key: 'home', label: 'Home', icon: icon('home-outline'), activeIcon: icon('home'), badge: 3 },
  { key: 'search', label: 'Search', icon: icon('search') },
  { key: 'add', label: 'Add', icon: icon('add'), fab: true },
  { key: 'alerts', label: 'Alerts', icon: icon('notifications-outline'), badge: true },
  { key: 'profile', label: 'Profile', icon: icon('person-circle-outline') },
];

export default function App() {
  const [tab, setTab] = useState('home');
  return (
    <View style={{ flex: 1 }}>
      {/* your screen for `tab` */}
      <SmartBottomBar
        variant="liquidGlass"
        items={ITEMS}
        activeKey={tab}
        onChange={setTab}
        insets={useSafeAreaInsets()}
      />
    </View>
  );
}
```

That's it — change `variant` to try every style. Remove `fab: true` for a plain five-tab bar.

> **Function icons** (`({ color, focused, size }) => …`, same as React Navigation's `tabBarIcon`) are recommended: the bar passes the right color for each place the icon is drawn — active/inactive in the row, white inside the FAB, the wave bubble, the sidebar rail. Plain elements (`icon: <HomeIcon />`) work too.

## Variants

| `variant` | Look | Best for | Tree-shakeable import |
| --- | --- | --- | --- |
| `flat` (default) | iOS / React Navigation style, sliding indicator | Any app, closest to native | `react-native-smart-bottom-bars/flat` |
| `curved` | Center FAB on a convex bump | Apps with a primary action | `…/curved` |
| `floating` | Detached rounded pill with shadow | Modern, content-first screens | `…/floating` |
| `wave` | Bubble lifts the active tab | Playful, consumer apps | `…/wave` |
| `liquidGlass` | Translucent iOS 26-style capsule + lens | Media / photo-heavy screens | `…/liquid-glass` |
| `notchedFab` | FAB sitting in a cutout | Classic "create" action layout | `…/notched-fab` |
| `material` | Material 3 nav bar with pill indicator | Android-first / Material apps | `…/material` |
| `segmented` | Compact equal-width capsules | Few tabs, utility apps | `…/segmented` |
| `sidebar` | Vertical navigation rail | Tablets, foldables, landscape | `…/sidebar` |

```tsx
import { CurvedBottomBar } from 'react-native-smart-bottom-bars/curved';

<CurvedBottomBar items={ITEMS} activeKey={tab} onChange={setTab} />
```

Curves and waves are layered `View`s, not SVG, so the package never needs `react-native-svg`. Pass `sceneColor` (your screen background) so notches look cut out.

## Recipes

### Center FAB — raised, embedded or custom

Mark one item with `fab: true` (or pass `fabKey`). Every horizontal style then shows **2 tabs + FAB + 2 tabs**.

```tsx
// Raised above the bar (default on every style)
<SmartBottomBar items={ITEMS} variant="floating" activeKey={tab} onChange={setTab} />

// Liquid Glass: keep the FAB inside the capsule, no extra height
<SmartBottomBar items={ITEMS} variant="liquidGlass" glass={{ fabPlacement: 'embedded' }} />

// Bigger FAB on the middle item without editing items
<SmartBottomBar items={ITEMS} fabKey="add" fabSize={64} />
```

Pressing the FAB fires `onChange` / `onPress` like any tab — open a modal there if it is an action rather than a screen.

### React Navigation (v6 / v7)

```tsx
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartBottomBar } from 'react-native-smart-bottom-bars';

const Tab = createBottomTabNavigator();

function AppTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <SmartBottomBar
      items={ITEMS} // keys = route names
      activeKey={state.routes[state.index]?.name}
      onPress={(key) => {
        const route = state.routes.find((r) => r.name === key)!;
        // Same event as the default bar: re-tap pops nested stacks + useScrollToTop works
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!event.defaultPrevented && state.routes[state.index]?.key !== route.key) {
          navigation.navigate(route.name, route.params);
        }
      }}
      insets={useSafeAreaInsets()}
    />
  );
}

<Tab.Navigator tabBar={(props) => <AppTabBar {...props} />}>{/* screens */}</Tab.Navigator>;
```

### Expo Router

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartBottomBar } from 'react-native-smart-bottom-bars';

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <SmartBottomBar
          variant="floating"
          items={ITEMS} // keys = file names: 'index', 'search', …
          activeKey={state.routes[state.index]?.name}
          onChange={(key) => navigation.navigate(key)}
          insets={insets}
        />
      )}
    />
  );
}
```

### Brand colors & dark mode

```tsx
<SmartBottomBar
  items={ITEMS}
  colorScheme="auto" // 'auto' | 'light' | 'dark'
  colors={{
    active: '#E91E63', // active icon
    label: '#E91E63', // active label
    fab: '#E91E63',
    fabIcon: '#FFFFFF',
    dark: { active: '#FF6090', label: '#FF6090', fab: '#FF6090' }, // dark-only
  }}
/>
```

Top-level keys apply to both schemes; `light` / `dark` refine one. Anything you leave out keeps the style's palette (so Material and Liquid Glass stay on-spec). Inline objects are fine — no re-render storms. See [Color tokens](#color-tokens-colors).

### Fonts, shapes & press feedback

```tsx
<SmartBottomBar
  items={ITEMS}
  iconSize={26}
  pressFeedback={{ scale: 0.92, rippleColor: 'rgba(233, 30, 99, 0.18)' }} // or 'none'
  labelProps={{ numberOfLines: 2, maxFontSizeMultiplier: 1.2 }}
  style={{
    label: { fontFamily: 'Inter-Medium', fontSize: 11 },
    activeLabel: { fontFamily: 'Inter-Bold' },
    indicator: { width: 40 }, // stays centered under the active tab
    pill: { width: 64, borderRadius: 10 }, // Material indicator
    bar: { borderRadius: 24 },
  }}
  floatingMargin={20} // floating / liquidGlass gap
  bubbleSize={56} // wave
/>
```

> **Fonts on iOS:** with a custom `fontFamily`, use per-weight families (`Inter-Regular` / `Inter-Bold`) instead of `fontWeight` — iOS ignores weight on custom fonts.

### Custom FAB (gradient, image, any shape)

```tsx
import { LinearGradient } from 'expo-linear-gradient';

<SmartBottomBar
  items={ITEMS}
  renderFab={({ icon, active, size }) => (
    <LinearGradient
      colors={active ? ['#FF6090', '#E91E63'] : ['#E91E63', '#AD1457']}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
    >
      {icon}
    </LinearGradient>
  )}
/>;
```

You only draw the visual — press handling, selected state, accessibility and the 44pt hit area stay built-in on every style. Return `null` to fall back to the default FAB.

### Badges

```tsx
const ITEMS = [
  { key: 'inbox', label: 'Inbox', icon, badge: 120 }, // shows "99+"
  { key: 'alerts', label: 'Alerts', icon, badge: true }, // dot
  { key: 'shop', label: 'Shop', icon, badge: 'new', badgeColor: '#34C759' }, // per-tab color
];

<SmartBottomBar items={ITEMS} badgeMax={9} style={{ badgeText: { fontFamily: 'Inter-Bold' } }} />;
```

Badges are announced by screen readers ("Inbox, 120 notifications").

### Liquid Glass

The built-in `liquidGlass` style is a **zero-dependency approximation**: a frosted capsule with a hairline edge and a selection lens that springs between tabs (instant under Reduce Motion). Float it over content so the translucency shows:

```tsx
<SmartBottomBar
  variant="liquidGlass"
  placement="overlay"
  items={ITEMS}
  glass={{ intensity: 'regular', tint: 'auto', cornerRadius: 28 }}
/>
// pad your ScrollView bottom by ~62 + 12 + insets.bottom (+24 with a raised FAB)
```

For real native blur, pass a host surface — the package never imports these:

```tsx
import { isGlassEffectAPIAvailable, GlassView } from 'expo-glass-effect';

<SmartBottomBar
  variant="liquidGlass"
  items={ITEMS}
  renderGlassSurface={
    isGlassEffectAPIAvailable()
      ? ({ children, style, tint, cornerRadius }) => (
          <GlassView style={style} tintColor={tint} cornerRadius={cornerRadius}>
            {children}
          </GlassView>
        )
      : undefined
  }
/>;
```

- Shadow uses `boxShadow` on the New Architecture (drawn only outside the glass). Customize it with shadow keys in `style.bar`, or turn it off with `shadow={false}`.
- Respects **Reduce Transparency** automatically (opaque bar).

### Safe area

Pass insets as data — don't also wrap the bar in `SafeAreaView` (that double-pads).

```tsx
<SmartBottomBar items={ITEMS} insets={useSafeAreaInsets()} />
```

Without `insets` the bar falls back to 34pt on notched iPhones, 20pt on iPad, and the system nav bar height on Android (0 in edge-to-edge — pass real insets there).

### Keyboard & hiding the bar

`keyboardBehavior="hide"` (default) slides the bar away while typing; `"offset"` lifts it above the keyboard; `"none"` leaves it.

```tsx
// Hide on nested screens without unmounting (keeps state, animates on the native driver)
<SmartBottomBar items={ITEMS} visible={!hideTabBar} placement="overlay" />
```

### Keyboard navigation (web, hardware keyboards)

```tsx
<SmartBottomBar items={ITEMS} rovingFocus />
// selection follows the arrows, no wrap at the ends
<SmartBottomBar items={ITEMS} rovingFocus={{ activation: 'automatic', loop: false }} />
```

`rovingFocus` follows the WAI-ARIA tabs pattern: **Arrow keys** move focus (Up / Down on `sidebar`, mirrored in RTL), **Home / End** jump to the first / last tab, **Enter / Space** select. Focus and selection are independent by default (`activation: 'manual'`); disabled tabs are skipped.

| Platform | Behavior |
| --- | --- |
| Web | One Tab stop for the whole bar (the focused or active tab); arrows / Home / End / Space handled by the bar. |
| Android | OS focus: Tab and D-pad move, Enter selects. Every tab stays reachable. |
| iOS | Handled by the OS. On iOS 26, Full Keyboard Access doesn't reach React Native `Pressable`s, so use touch or VoiceOver. |

On web and Android, selecting a focused tab keeps keyboard focus (including wave's floating bubble).

### Haptics

```tsx
import * as Haptics from 'expo-haptics';

<SmartBottomBar items={ITEMS} hapticFeedback={() => Haptics.selectionAsync()} />;
```

On CLI use `react-native-haptic-feedback`. The bar only calls the function you pass.

### Tablet / foldable

```tsx
<SmartBottomBar items={ITEMS} variant="floating" breakpoint={768} />
```

At window width ≥ 768 the bar becomes the `sidebar` rail (FAB at the top); below it, your chosen style. Set `sidebarWidth` to resize the rail.

### RTL

`rtl="auto"` follows `I18nManager.isRTL`; pass `true` / `false` to force. Tab order and indicators mirror automatically.

### Native tabs escape hatch

Moving to Callstack's `react-native-bottom-tabs` later? Reuse your items:

```tsx
import { toNativeTabConfig } from 'react-native-smart-bottom-bars';

const tabs = toNativeTabConfig(ITEMS); // [{ key, title, badge, hidden, disabled }]
```

## Full prop reference

Every prop on `<SmartBottomBar>` (and each `<XxxBottomBar>`), grouped. All optional except `items`.

### Data

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `BottomBarItem[]` | — | **required.** Tabs, in order — see [Item fields](#item-fields) |
| `variant` | `BottomBarVariant` | `'flat'` | one of the nine styles |
| `fabKey` | `string` | `item.fab` / middle item | which item is the center FAB |

### Selection & events

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `activeKey` / `onChange` | `string` / `(key, index) => void` | — | controlled (recommended) |
| `defaultActiveKey` | `string` | first visible item | uncontrolled |
| `activeIndex` / `defaultActiveIndex` | `number` | — | index into the original `items` (incl. hidden) |
| `onPress` | `(key, index) => void` | — | every press, including re-taps |
| `onLongPress` | `(key, index) => void` | — | |
| `onDoubleTap` | `(key, index) => void` | — | the **already-active** tab was pressed |
| `onScrollToTop` | `(key) => void` | — | same moment as `onDoubleTap`, for scroll-to-top |
| `hapticFeedback` | `(key, event) => void` | — | `event`: `'press' \| 'longPress' \| 'doubleTap'` |

### Layout & sizing

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `height` | `number` | per style (44–80) | bar height, excluding safe area |
| `iconSize` | `number` | `24` | `size` passed to function icons |
| `fabSize` | `number` | `56` | center FAB diameter |
| `labelPosition` | `'below' \| 'beside' \| 'hidden'` | `'below'` | |
| `floatingMargin` | `number` | `12` / `16` | side + bottom gap of `floating` / `liquidGlass` |
| `bubbleSize` | `number` | `64` | `wave` bubble diameter |
| `sidebarWidth` | `number` | `80` | `sidebar` rail width |
| `breakpoint` | `number` | — | switch to `sidebar` at this window width |
| `placement` | `'docked' \| 'overlay'` | `'docked'` | `overlay` pins the bar over content |
| `insets` | `{ top, right, bottom, left }` | platform fallback | pass `useSafeAreaInsets()` |
| `safeArea` | `boolean` | `true` | `false` disables fallback insets |

### Appearance & theming

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `colorScheme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | follows the OS by default |
| `colors` | `BarColorOverrides` | style palette | brand colors, with `light` / `dark` refinements |
| `style` | `BottomBarStyle` | — | per-part styles — see [Style slots](#style-slots-style) |
| `shadow` | `boolean` | per style | on for floating / liquidGlass / material / curved / notchedFab / wave |
| `sceneColor` | `string` | `colors.scene` | screen color behind notches |
| `materialMode` | `'fixed' \| 'shifting'` | `'fixed'` | `shifting` shows only the active label |
| `labelProps` | `{ numberOfLines, allowFontScaling, maxFontSizeMultiplier }` | `1` / `true` / `1.35` | label text behavior |
| `badgeMax` | `number` | `99` | larger numbers show `99+` |
| `pressFeedback` | `'none' \| { opacity, scale, rippleColor }` | fade tabs, scale FAB | `rippleColor` = Android ripple |
| `rtl` | `'auto' \| boolean` | `'auto'` | mirror layout |

### Liquid Glass

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `glass.intensity` | `'clear' \| 'regular'` | `'regular'` | `clear` is more see-through |
| `glass.tint` | `'auto' \| 'light' \| 'dark' \| string` | `'auto'` | any color string |
| `glass.cornerRadius` | `number` | capsule | `0` for a full-bleed glass bar |
| `glass.fabPlacement` | `'raised' \| 'embedded'` | `'raised'` | FAB above or inside the capsule |
| `renderGlassSurface` | `(props: GlassSurfaceProps) => ReactNode` | — | native blur surface from your app |

### Behavior & animation

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `animation` | `{ type: 'spring' \| 'timing', duration, easing, config }` | spring | indicator, bubble and lens motion |
| `keyboardBehavior` | `'hide' \| 'offset' \| 'none'` | `'hide'` | |
| `visible` | `boolean` | `true` | hide without unmounting |
| `translateOnHide` | `boolean` | `true` | `true` slides the bar out; `false` hides it instantly |

### Render slots

| Prop | Type | Notes |
| --- | --- | --- |
| `renderItem` | `(params: RenderItemParams) => ReactNode` | replace every tab (`item.renderItem` wins per tab) |
| `renderFab` | `(params: RenderFabParams) => ReactNode` | replace the FAB visual |
| `renderGlassSurface` | `(props: GlassSurfaceProps) => ReactNode` | Liquid Glass surface |

### Accessibility / test

| Prop | Type | Notes |
| --- | --- | --- |
| `testID` | `string` | bar root; the glass lens is `${testID}-lens` |
| `rovingFocus` | `boolean \| { activation?: 'manual' \| 'automatic'; loop?: boolean }` | opt-in arrow / Home / End keyboard model — see [Keyboard navigation](#keyboard-navigation-web-hardware-keyboards) |

Each tab gets `testID` `smart-bottom-bar-item-<key>` unless `item.testID` is set; badges get `<item.testID>-badge`.

## Item fields

| Field | Type | Notes |
| --- | --- | --- |
| `key` | `string` | **required.** Unique id (route name with navigators) |
| `label` | `string` | text under / beside the icon |
| `icon` / `activeIcon` | `ReactNode \| ({ color, focused, size }) => ReactNode` | `activeIcon` when selected (e.g. filled) |
| `badge` | `number \| string \| boolean` | `true` = dot; numbers cap at `badgeMax` |
| `badgeColor` | `string` | badge fill for this tab only |
| `color` / `activeColor` | `string` | per-tab icon + label tint |
| `fab` | `boolean` | make this the center FAB |
| `disabled` | `boolean` | greyed out, not pressable |
| `hidden` | `boolean` | not rendered (indexes still count) |
| `accessibilityLabel` / `accessibilityHint` | `string` | defaults to label + badge |
| `testID` | `string` | |
| `renderItem` | `(params: RenderItemParams) => ReactNode` | custom content for this tab |

## Color tokens (`colors`)

Override any subset; add `light: {…}` / `dark: {…}` for scheme-specific values.

| Key | Used for |
| --- | --- |
| `bar` | bar / capsule background |
| `active` / `inactive` | icon color, selected / not selected |
| `label` / `inactiveLabel` | label color, selected / not selected |
| `indicator` | flat line, Material pill, glass lens |
| `fab` / `fabIcon` | FAB background / icon |
| `badge` / `badgeText` | badge fill / text |
| `border` | hairline edges |
| `background` | segmented track |
| `scene` | default `sceneColor` behind notches |
| `glassTint` / `glassHighlight` | Liquid Glass fill / highlight |

## Style slots (`style`)

| Slot | Applies to |
| --- | --- |
| `container` | outer wrapper (incl. safe-area padding) |
| `bar` | the bar surface (radius, border, shadow…) |
| `item` / `activeItem` | every tab / the selected tab |
| `icon` | icon wrapper |
| `label` / `activeLabel` | label text / selected label (fonts go here) |
| `badge` / `badgeText` | badge bubble / text |
| `indicator` | selection marker: flat line, wave bubble, glass lens, selected segment |
| `pill` | Material active pill |
| `fab` | center FAB button |

## Render-prop params

```ts
RenderItemParams = { item, index, active, defaultItem } // defaultItem = built-in content
RenderFabParams  = { item, active, size, color, iconColor, icon } // icon pre-tinted
GlassSurfaceProps = { children, style, intensity, tint, cornerRadius }
BarIconProps     = { color, focused, size }
```

## Public exports

```ts
// Components
SmartBottomBar,
FlatBottomBar, CurvedBottomBar, FloatingBottomBar, WaveBottomBar, LiquidGlassBottomBar,
NotchedFabBottomBar, MaterialBottomBar, SegmentedBottomBar, SidebarBottomBar

// Helpers
toNativeTabConfig, fallbackInsets, mergeInsets
lightPalette, darkPalette, paletteFor, defaultShadow, barShadowStyle

// Types
SmartBottomBarProps, VariantBarProps, BottomBarItem, BottomBarVariant, BottomBarStyle,
BarIcon, BarIconProps, BarColors, BarColorOverrides, ResolvedPalette,
PressFeedback, LabelProps, RenderFabParams, RenderItemParams, RovingFocus,
GlassConfig, GlassSurfaceProps, AnimationConfig, EdgeInsets, ResolvedInsets, NativeTabConfig,
LabelPosition, ColorSchemePreference, KeyboardBehavior, MaterialMode, HapticEvent,
HapticFeedback, BarPlacement, RtlMode
```

## Accessibility

- The bar is a `tablist`; each tab is a `tab` with `selected` / `disabled` state.
- Labels include badges ("Home, 3 notifications"); decorative layers (glass lens, wave copy) are hidden from screen readers.
- 44×44 minimum touch targets, Dynamic Type up to 1.35× by default (`labelProps` to change).
- Reduce Motion → instant transitions. Reduce Transparency → opaque Liquid Glass.
- Keyboard: tabs are focusable everywhere; `rovingFocus` adds arrows / Home / End and a single Tab stop on web.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Bar sits under the home indicator / Android nav bar | Pass `insets={useSafeAreaInsets()}` — fallbacks can't see edge-to-edge system bars. |
| Bar is too tall (double padding) | Don't wrap in `SafeAreaView` **and** pass insets. Use one. |
| Icons don't change color | Use function icons (`({ color, size }) => …`) instead of elements with a fixed color. |
| Keyboard covers the bar | Keep the default `keyboardBehavior="hide"`, or use `"offset"`. |
| Notch doesn't look cut out | Set `sceneColor` to the screen background behind the bar. |
| Content hidden behind a floating / glass bar | With `placement="overlay"`, add bottom padding to your scroll content. |
| Glass looks opaque | Reduce Transparency is on, or pass `renderGlassSurface` for native blur. |
| Tab bar jumps on nested screens | Don't unmount it — use `visible={false}` + `placement="overlay"`. |
| Crash on Fabric / RN 0.76+ | This package has no SVG / Reanimated; the crash is from another dependency. |

## Migration

- **From the default `@react-navigation/bottom-tabs` bar** — keep the navigator; set `tabBar={(p) => <SmartBottomBar … />}` (see [recipe](#react-navigation-v6--v7)).
- **From `react-native-curved-bottom-bar`** — `variant="curved"` or `"notchedFab"`; drop `react-native-svg` if nothing else needs it.
- **From `rn-wave-bottom-bar`** — `variant="wave"`; no Reanimated needed.
- **From Callstack `react-native-bottom-tabs`** — you gain every custom style and Expo Go; `toNativeTabConfig` gets you back.

## Example app

The repo includes an Expo app ([`example/`](example/App.tsx)) with every variant plus toggles for theme, shadow, center FAB (off / raised / embedded) and a "custom" preset showing every customization at once.

```sh
git clone https://github.com/bhavesh2706/smart-bottom-bar.git
cd smart-bottom-bar && npm install && npm run build
cd example && npm install
npx expo run:android   # or: npx expo run:ios
```

## Contributing

Issues and PRs are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup, checks and device testing.

## License

MIT · [Bhavesh Barot](https://github.com/bhavesh2706) · [npm](https://www.npmjs.com/package/react-native-smart-bottom-bars) · [YouTube](https://youtube.com/shorts/egPw4GF83TI)
