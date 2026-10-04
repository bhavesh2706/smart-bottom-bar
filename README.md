# react-native-smart-bottom-bars

One bottom bar. Nine visual styles. **Zero runtime dependencies.**

| Android | iOS |
| :---: | :---: |
| <img src="https://raw.githubusercontent.com/bhavesh2706/smart-bottom-bar/main/media/demo.gif" alt="Android: all nine variants, then Liquid Glass in dark mode" width="280" /> | <img src="https://raw.githubusercontent.com/bhavesh2706/smart-bottom-bar/main/media/demo-ios.gif" alt="iOS: all nine variants, then Liquid Glass in dark mode" width="280" /> |

Works unmodified in **React Native CLI**, **Expo Go**, **Expo Dev Client**, and the **New Architecture (Fabric)**. No native linking, no config plugin, no `react-native-svg`, no Reanimated, no Gesture Handler.

```tsx
import { SmartBottomBar } from 'react-native-smart-bottom-bars';

<SmartBottomBar
  items={[
    { key: 'home', icon: <HomeIcon />, label: 'Home', badge: 3 },
    { key: 'search', icon: <SearchIcon />, label: 'Search' },
    { key: 'profile', icon: <ProfileIcon />, label: 'Profile' },
  ]}
  activeKey={activeKey}
  onChange={setActiveKey}
/>
```

Icons are whatever you already use (`@expo/vector-icons`, `react-native-vector-icons`, SVG components, images, emoji). This package never bundles an icon set.

Pass an icon as a **function** to let the bar pick the tint — the same shape as React Navigation's `tabBarIcon`. One item then reads correctly everywhere it is drawn: active/inactive in the row, white (on-FAB color) inside the center FAB, the wave bubble, and the sidebar rail.

```tsx
{ key: 'home', label: 'Home', icon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }
```

## Install

CLI and Expo use the same command. There is **no additional native setup**.

```sh
npm install react-native-smart-bottom-bars
# or
yarn add react-native-smart-bottom-bars
```

Peer dependencies: `react >= 18`, `react-native >= 0.74`.

| Host | React Native | Notes |
| --- | --- | --- |
| RN CLI | 0.74 – **0.87** (latest) | New and old architecture |
| Expo SDK 51–54 | 0.74 – 0.81 | Expo Go compatible |
| Expo SDK 55–56 | 0.83 – 0.85 | Expo Go compatible |
| Expo SDK 57 | 0.86 | Expo Go compatible |
| Expo canary | 0.87 | Use when you need RN 0.87 inside Expo |

## Variants

Set `variant` or import a tree-shakeable entry so unused layouts stay out of the bundle.

| `variant` | Look | Import |
| --- | --- | --- |
| `flat` (default) | iOS / React Navigation style, sliding indicator | `react-native-smart-bottom-bars/flat` |
| `curved` | Raised center FAB on a convex bump (no SVG) | `.../curved` |
| `floating` | Detached pill with shadow | `.../floating` |
| `wave` | Bubble that follows the active tab | `.../wave` |
| `liquidGlass` | Translucent iOS-26-style approximation | `.../liquid-glass` |
| `notchedFab` | Center FAB sitting in a cutout | `.../notched-fab` |
| `material` | Material 3 fixed or shifting labels | `.../material` |
| `segmented` | Compact equal-width capsules | `.../segmented` |
| `sidebar` | Vertical rail for tablet / landscape | `.../sidebar` |

```tsx
import { CurvedBottomBar } from 'react-native-smart-bottom-bars/curved';
```

Curves and waves are layered `View`s, not SVG. They will not match a true Bézier path pixel-for-pixel — that is intentional so the core package never depends on `react-native-svg`. Pass `sceneColor` to match the screen behind notched variants.

## API

### `items`

| Field | Type | Notes |
| --- | --- | --- |
| `key` | `string` | Required identity |
| `icon` / `activeIcon` | `ReactNode \| ({ color, focused, size }) => ReactNode` | Consumer-supplied; the function form is tinted by the bar |
| `label` | `string` | |
| `badge` | `number \| string \| boolean` | `true` is a dot; numbers cap at `99+` |
| `disabled` / `hidden` | `boolean` | Hidden items are not rendered |
| `fab` | `boolean` | Center action for curved / notched variants |
| `renderItem` | `(params) => ReactNode` | Per-item override |
| `accessibilityLabel` / `Hint` | `string` | Defaults from `label` + badge |
| `color` / `activeColor` | `string` | Per-item tint hint for labels |

### Component props

| Prop | Default | Purpose |
| --- | --- | --- |
| `variant` | `'flat'` | Visual style |
| `activeKey` / `onChange` | — | Controlled API (preferred) |
| `activeIndex` / `defaultActiveIndex` | — | Index into the original `items` array |
| `defaultActiveKey` | first visible item | Uncontrolled |
| `onPress` | — | Every press, including re-taps |
| `onLongPress` | — | |
| `onDoubleTap` / `onScrollToTop` | — | Fired when the **already-active** tab is pressed |
| `insets` | platform fallback | `{ top, right, bottom, left }` — pass `useSafeAreaInsets()` |
| `safeArea` | `true` | Set `false` to skip fallback insets |
| `colorScheme` | `'auto'` | `'auto' \| 'light' \| 'dark'` via `useColorScheme()` |
| `colors` | variant palette | Brand colors — see [Theming](#theming) |
| `iconSize` | `24` | `size` passed to function icons |
| `pressFeedback` | fade tabs / scale FAB | `'none'` or `{ opacity, scale, rippleColor }` — `rippleColor` adds an Android ripple |
| `labelProps` | 1 line, scaling ≤ 1.35× | `{ numberOfLines, allowFontScaling, maxFontSizeMultiplier }` |
| `badgeMax` | `99` | Numeric badges above it show `99+` |
| `floatingMargin` | `12` / `16` | Side + bottom gap of `floating` / `liquidGlass` |
| `bubbleSize` | `64` | Wave bubble diameter |
| `renderFab` | — | Draw your own FAB — see [Custom FAB](#custom-fab) |
| `rtl` | `'auto'` | `'auto'` reads `I18nManager.isRTL` |
| `hapticFeedback` | — | `(key, event) => void` — you supply haptics |
| `animation` | spring | `{ type: 'spring' \| 'timing', duration, config }` |
| `keyboardBehavior` | `'hide'` | `'hide' \| 'offset' \| 'none'` |
| `visible` / `translateOnHide` | `true` / `true` | Hide without unmounting (native-driver translate) |
| `placement` | `'docked'` | `'overlay'` pins the bar to the bottom |
| `breakpoint` | unset | Auto-switch to `sidebar` at this window width |
| `labelPosition` | `'below'` | `'below' \| 'beside' \| 'hidden'` |
| `materialMode` | `'fixed'` | `'shifting'` hides inactive labels |
| `glass` | `{ intensity: 'regular', tint: 'auto', fabPlacement: 'raised' }` | Built-in liquid-glass fallback; `fabPlacement: 'embedded'` keeps the FAB inside the capsule |
| `renderGlassSurface` | — | Pass `@callstack/liquid-glass` / `expo-glass-effect` |
| `fabKey` / `fabSize` | middle item / `56` | Center FAB — when set (or `item.fab`), **every** horizontal variant uses 2+2 sides + raised center FAB |
| `shadow` | per-variant | `true` \| `false` — elevation under the bar. Defaults: on for floating / liquidGlass / material / curved / notchedFab / wave; off for flat / segmented / sidebar |
| `sceneColor` | theme scene | Match the screen for notched cutouts |
| `style` | — | `{ container, bar, item, icon, label, badge, badgeText, indicator, fab, pill, activeItem, activeLabel }` |
| `renderItem` | — | Override every item |

Tabs are `accessibilityRole="tab"` with `accessibilityState={{ selected, disabled }}` and a **44×44** minimum hit target.

## Recipes

### No navigator (plain state)

```tsx
const [key, setKey] = useState('home');

return (
  <View style={{ flex: 1 }}>
    {key === 'home' ? <HomeScreen /> : null}
    {key === 'search' ? <SearchScreen /> : null}
    <SmartBottomBar items={items} activeKey={key} onChange={setKey} />
  </View>
);
```

### React Navigation (v6 / v7)

The bar is presentational — it does not depend on React Navigation.

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartBottomBar } from 'react-native-smart-bottom-bars';

const Tab = createBottomTabNavigator();

function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <SmartBottomBar
      items={[
        { key: 'Home', label: 'Home', icon: <HomeIcon /> },
        { key: 'Search', label: 'Search', icon: <SearchIcon /> },
      ]}
      activeKey={state.routes[state.index]?.name}
      onChange={(key) => navigation.navigate(key)}
      onDoubleTap={(key) => {
        const route = state.routes[state.index];
        if (route?.name === key && route.state) {
          navigation.popToTop();
        }
      }}
      insets={insets}
    />
  );
}

<Tab.Navigator tabBar={(props) => <AppTabBar {...props} />} />
```

### Expo Router

Keep route matching in the app (avoids `expo-router/ui` dynamic-trigger collisions). Override `tabBar` on the JS tabs layout:

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmartBottomBar } from 'react-native-smart-bottom-bars';

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      tabBar={({ state, navigation }) => (
        <SmartBottomBar
          variant="floating"
          items={[
            { key: 'index', label: 'Home', icon: <HomeIcon /> },
            { key: 'search', label: 'Search', icon: <SearchIcon /> },
          ]}
          activeKey={state.routes[state.index]?.name}
          onChange={(key) => navigation.navigate(key)}
          insets={insets}
        />
      )}
    />
  );
}
```

### Safe area

Pass insets as data. Do not wrap the bar in `SafeAreaView` (that double-pads).

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

<SmartBottomBar items={items} insets={useSafeAreaInsets()} />
```

If you don't pass `insets`, the library falls back to:

- **iOS** 34pt on notched iPhones (height ≥ 812), 20pt on iPad, 0 otherwise
- **Android** `screen.height - window.height` (capped at 48), which is **0 in edge-to-edge** — pass real insets there
- **Web** 0

### Keyboard

Default `keyboardBehavior="hide"` slides the bar off-screen on the native driver (no unmount). Use `"offset"` to lift it above the keyboard, or `"none"` to leave it.

For nested stacks that hide the tab bar, keep it mounted:

```tsx
<SmartBottomBar visible={!hideTabBar} translateOnHide placement="overlay" />
```

### Theming

Every color is overridable with `colors`. Top-level keys apply to both schemes; `light` / `dark` refine one scheme. Anything you leave out keeps the variant's palette, so Material and Liquid Glass stay on-spec.

```tsx
<SmartBottomBar
  items={items}
  colors={{
    active: '#E91E63', // active icon
    label: '#E91E63', // active label
    fab: '#E91E63',
    fabIcon: '#FFFFFF',
    dark: { active: '#FF6090', label: '#FF6090', fab: '#FF6090' },
  }}
  style={{ activeLabel: { fontWeight: '700' } }}
/>
```

Keys: `bar`, `background`, `scene`, `active`, `inactive`, `label`, `inactiveLabel`, `badge`, `badgeText`, `indicator`, `border`, `glassTint`, `glassHighlight`, `fab`, `fabIcon`. Inline objects are fine — the palette is memoized by content, not identity.

Fonts and shapes go through `style` (`label` / `activeLabel` take `fontFamily`, `fontSize`, `letterSpacing`…; `pill` resizes the Material indicator). On `liquidGlass`, shadow keys in `style.bar` (`boxShadow`, `shadow*`, `elevation`) are drawn outside the glass and replace the built-in lift.

```tsx
<SmartBottomBar
  items={items}
  pressFeedback={{ scale: 0.92, rippleColor: 'rgba(233, 30, 99, 0.18)' }}
  labelProps={{ numberOfLines: 2, maxFontSizeMultiplier: 1.2 }}
  badgeMax={9}
  style={{
    label: { fontFamily: 'Inter-Medium', fontSize: 11 },
    pill: { width: 64, borderRadius: 10 },
  }}
/>
```

### Custom FAB

`renderFab` replaces the FAB visual (gradient, image, any shape). The bar keeps the press handling, selected state, accessibility and 44pt hit target around it, on every variant.

```tsx
<SmartBottomBar
  items={items}
  renderFab={({ icon, active, size }) => (
    <LinearGradient
      colors={active ? ['#FF6090', '#E91E63'] : ['#E91E63', '#AD1457']}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
    >
      {icon}
    </LinearGradient>
  )}
/>
```

It receives `{ item, active, size, color, iconColor, icon }` — `icon` is already tinted with `colors.fabIcon`. Return `null` to fall back to the default FAB.

### Liquid Glass

The built-in `liquidGlass` variant is a **zero-dependency approximation**: a floating frosted capsule with a uniform hairline edge and a **selection lens** that springs between tabs on the native driver (instant under Reduce Motion). It is not Apple's refractive `UIGlassEffect` — there is no backdrop blur without a host surface, so the fill is tuned for label legibility over content.

- **Center FAB** (`fabKey` / `item.fab`) is **raised** above the capsule like every other variant — **2 left + FAB + 2 right**. Pass `glass={{ fabPlacement: 'embedded' }}` to keep it inside the capsule with no extra height.
- **`shadow`** lifts the capsule with `boxShadow` on the New Architecture (drawn only outside the shape, so it never shows through the glass). On the old architecture iOS uses layer shadows and Android draws none, because Android `elevation` paints a grey slab under translucent views.
- Float it over content with `placement="overlay"` and pad your scroll content by the capsule footprint (62 + ~12 float gap + bottom inset, plus ~24 for a raised FAB).
- The lens has `testID` `` `${testID}-lens` `` and is hidden from accessibility.

Respects **Reduce Transparency** automatically (opaque bar), including when you pass a native surface.

```tsx
import { isGlassEffectAPIAvailable, GlassView } from 'expo-glass-effect';

<SmartBottomBar
  variant="liquidGlass"
  items={items}
  glass={{ intensity: 'regular', tint: 'auto', cornerRadius: 28 }}
  renderGlassSurface={
    isGlassEffectAPIAvailable()
      ? ({ children, style, tint, cornerRadius }) => (
          <GlassView style={style} tintColor={tint} cornerRadius={cornerRadius}>
            {children}
          </GlassView>
        )
      : undefined
  }
/>
```

The package never imports `expo-glass-effect` or `@callstack/liquid-glass`.

### Haptics (optional, you own the dependency)

```tsx
import * as Haptics from 'expo-haptics';

<SmartBottomBar
  items={items}
  hapticFeedback={() => {
    Haptics.selectionAsync();
  }}
/>
```

Or `react-native-haptic-feedback` on CLI. The bar only calls the function you pass.

### Native tabs escape hatch

If you later want Callstack's `react-native-bottom-tabs`, reuse the same `items`:

```tsx
import { toNativeTabConfig } from 'react-native-smart-bottom-bars';

const tabs = toNativeTabConfig(items);
```

Icons stay in your app — they are React nodes, not serializable.

### Dark mode & RTL

`colorScheme="auto"` (default) follows `useColorScheme()`. `rtl="auto"` follows `I18nManager`. Both can be forced.

### Tablet / foldable

```tsx
<SmartBottomBar items={items} variant="flat" breakpoint={768} />
```

At `width >= 768` the bar becomes the `sidebar` rail. Or set `variant="sidebar"` always.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Bar sits under the home indicator / Android nav bar | Pass `insets={useSafeAreaInsets()}`. Fallbacks cannot see edge-to-edge system bars. |
| Bar is too tall (double padding) | You are wrapping with `SafeAreaView` **and** passing insets. Use one. `safeArea={false}` disables fallbacks. |
| Keyboard covers the bar | Default is hide. If you overrode it, set `keyboardBehavior="hide"` or `"offset"`. |
| Notch doesn't look cut out | Set `sceneColor` to the screen background behind the bar. |
| Glass looks opaque | Check Reduce Transparency in system settings. Native glass requires `renderGlassSurface`. |
| Tab bar jumps on nested screens | Don't unmount. Use `visible={false}` + `translateOnHide` + `placement="overlay"`. |
| Fabric / RN 0.76+ crash (SVG packages) | This library has no SVG / Reanimated. If you still crash, it is another dependency. |
| Expo Go + native tabs | This package is JS-only and runs in Expo Go. Native tab libraries do not. |

## Migration

**From `@react-navigation/bottom-tabs` default bar** — keep the navigator, swap `tabBar` for `<SmartBottomBar items={...} activeKey={routeName} onChange={navigate} />`.

**From `react-native-curved-bottom-bar`** — drop `react-native-svg` if you no longer need it elsewhere. Use `variant="curved"` or `variant="notchedFab"`. Map your tab config to `items`.

**From `rn-wave-bottom-bar`** — `variant="wave"`. No Reanimated.

**From Callstack `react-native-bottom-tabs`** — you lose native chrome and gain every custom style plus Expo Go. Use `toNativeTabConfig` if you need to go back.

## Development

```sh
npm test
npm run typecheck
npm run build
```

Example app: `example/` (Expo). Point Metro at this package with `file:..`.

## License

MIT
