import { useMemo, useState, type ComponentProps } from 'react';
import {
  LogBox,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  SmartBottomBar,
  type BarColorOverrides,
  type BarIconProps,
  type BottomBarItem,
  type BottomBarVariant,
  type ColorSchemePreference,
} from 'react-native-smart-bottom-bars';

LogBox.ignoreLogs(['Open debugger to view warnings']);
LogBox.ignoreAllLogs(true);

const VARIANTS: BottomBarVariant[] = [
  'flat',
  'curved',
  'floating',
  'wave',
  'liquidGlass',
  'notchedFab',
  'material',
  'segmented',
  'sidebar',
];

type IconName = ComponentProps<typeof Ionicons>['name'];

type FabMode = 'off' | 'raised' | 'embedded';
const FAB_MODES: Record<FabMode, FabMode> = {
  off: 'raised',
  raised: 'embedded',
  embedded: 'off',
};

// `colors` brands any variant; per-scheme keys refine light / dark.
const BRAND: BarColorOverrides = {
  active: '#E91E63',
  label: '#E91E63',
  fab: '#E91E63',
  fabIcon: '#FFFFFF',
  dark: { active: '#FF6090', label: '#FF6090', fab: '#FF6090' },
};

// Function icons let the bar pick the tint (row, FAB, wave bubble, rail).
const icon =
  (name: IconName) =>
  ({ color, size }: BarIconProps) => (
    <Ionicons name={name} size={size} color={color} />
  );

// Outline when idle, filled when selected — the iOS tab convention.
const tab = (
  key: string,
  label: string,
  idle: IconName,
  selected: IconName,
  extra?: Partial<BottomBarItem>
): BottomBarItem => ({
  key,
  label,
  icon: icon(idle),
  activeIcon: icon(selected),
  ...extra,
});

function Demo() {
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme();
  const [variant, setVariant] = useState<BottomBarVariant>('liquidGlass');
  const [activeKey, setActiveKey] = useState('home');
  const [keyboardProbe, setKeyboardProbe] = useState('');
  const [shadow, setShadow] = useState<boolean | undefined>(undefined);
  const [fabMode, setFabMode] = useState<FabMode>('raised');
  const [brand, setBrand] = useState(false);
  const fabOn = fabMode !== 'off';
  const [scheme, setScheme] = useState<ColorSchemePreference>('light');

  const dark =
    scheme === 'dark' || (scheme === 'auto' && systemScheme === 'dark');
  const scene = dark ? '#000000' : '#F2F2F7';

  const items: BottomBarItem[] = useMemo(
    () => [
      tab('home', 'Home', 'home-outline', 'home', { badge: 3 }),
      tab('search', 'Search', 'search-outline', 'search'),
      fabOn
        ? {
            key: 'add',
            label: 'Add',
            icon: icon('add'),
            fab: true,
          }
        : tab('add', 'Add', 'add-circle-outline', 'add-circle'),
      tab('alerts', 'Alerts', 'notifications-outline', 'notifications', {
        badge: true,
      }),
      tab('profile', 'Profile', 'person-circle-outline', 'person-circle'),
    ],
    [fabOn]
  );

  const shadowLabel = shadow === undefined ? 'auto' : shadow ? 'on' : 'off';

  // Glass floats over content so translucency is real; pad the scroll content
  // by the capsule footprint (62 bar + ~12 float gap) so nothing is trapped.
  const overlay = variant === 'liquidGlass';
  const contentBottom = overlay
    ? insets.bottom + 62 + 12 + 24 + (fabMode === 'raised' ? 24 : 0)
    : 24;

  const bar = (
    <SmartBottomBar
      placement={overlay ? 'overlay' : 'docked'}
      variant={variant === 'sidebar' ? 'sidebar' : variant}
      items={items}
      activeKey={activeKey}
      onChange={setActiveKey}
      insets={insets}
      sceneColor={scene}
      shadow={shadow}
      colorScheme={scheme === 'auto' ? 'auto' : scheme}
      glass={fabMode === 'embedded' ? { fabPlacement: 'embedded' } : undefined}
      colors={brand ? BRAND : undefined}
    />
  );

  return (
    <View style={[styles.screen, { backgroundColor: scene }]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      {variant === 'sidebar' ? (
        <View style={styles.rowScreen}>
          {bar}
          <ScrollView
            contentContainerStyle={[
              styles.body,
              { paddingTop: insets.top + 16 },
            ]}
            style={styles.flex}
          >
            <DemoControls
              dark={dark}
              variant={variant}
              setVariant={setVariant}
              activeKey={activeKey}
              shadowLabel={shadowLabel}
              cycleShadow={() =>
                setShadow((s) =>
                  s === undefined ? true : s === true ? false : undefined
                )
              }
              fabMode={fabMode}
              setFabMode={setFabMode}
              brand={brand}
              setBrand={setBrand}
              scheme={scheme}
              cycleScheme={() =>
                setScheme((s) =>
                  s === 'light' ? 'dark' : s === 'dark' ? 'auto' : 'light'
                )
              }
            />
          </ScrollView>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[
              styles.body,
              { paddingTop: insets.top + 16, paddingBottom: contentBottom },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <DemoControls
              dark={dark}
              variant={variant}
              setVariant={setVariant}
              activeKey={activeKey}
              shadowLabel={shadowLabel}
              cycleShadow={() =>
                setShadow((s) =>
                  s === undefined ? true : s === true ? false : undefined
                )
              }
              fabMode={fabMode}
              setFabMode={setFabMode}
              brand={brand}
              setBrand={setBrand}
              scheme={scheme}
              cycleScheme={() =>
                setScheme((s) =>
                  s === 'light' ? 'dark' : s === 'dark' ? 'auto' : 'light'
                )
              }
            />
            <TextInput
              value={keyboardProbe}
              onChangeText={setKeyboardProbe}
              placeholder="Focus to test keyboard hide"
              placeholderTextColor={dark ? '#8E8E93' : '#8E8E93'}
              style={[
                styles.input,
                dark ? { backgroundColor: '#1C1C1E', color: '#F5F5F7' } : null,
              ]}
            />
            {/* Color washes so liquidGlass translucency is visible on device */}
            <View style={styles.washRow}>
              <View style={[styles.wash, { backgroundColor: '#FF9F0A' }]} />
              <View style={[styles.wash, { backgroundColor: '#30D158' }]} />
              <View style={[styles.wash, { backgroundColor: '#64D2FF' }]} />
            </View>
            <View style={styles.washRow}>
              <View style={[styles.wash, { backgroundColor: '#BF5AF2' }]} />
              <View style={[styles.wash, { backgroundColor: '#FF375F' }]} />
              <View style={[styles.wash, { backgroundColor: '#0A84FF' }]} />
            </View>
            <View style={styles.washRow}>
              <View style={[styles.wash, { backgroundColor: '#FFD60A' }]} />
              <View style={[styles.wash, { backgroundColor: '#5E5CE6' }]} />
              <View style={[styles.wash, { backgroundColor: '#FF453A' }]} />
            </View>
            <View style={styles.washRow}>
              <View style={[styles.wash, { backgroundColor: '#32ADE6' }]} />
              <View style={[styles.wash, { backgroundColor: '#FF9F0A' }]} />
              <View style={[styles.wash, { backgroundColor: '#30D158' }]} />
            </View>
            <Text style={[styles.hint, dark && styles.subDark]}>
              Scroll color blocks under the bar to judge glass translucency.
            </Text>
          </ScrollView>
          {bar}
        </>
      )}
    </View>
  );
}

function DemoControls({
  dark,
  variant,
  setVariant,
  activeKey,
  shadowLabel,
  cycleShadow,
  fabMode,
  setFabMode,
  brand,
  setBrand,
  scheme,
  cycleScheme,
}: {
  dark: boolean;
  variant: BottomBarVariant;
  setVariant: (v: BottomBarVariant) => void;
  activeKey: string;
  shadowLabel: string;
  cycleShadow: () => void;
  fabMode: FabMode;
  setFabMode: (v: FabMode) => void;
  brand: boolean;
  setBrand: (v: boolean) => void;
  scheme: ColorSchemePreference;
  cycleScheme: () => void;
}) {
  return (
    <>
      <Text style={[styles.title, dark && styles.titleDark]}>
        Smart Bottom Bar
      </Text>
      <Text style={[styles.sub, dark && styles.subDark]}>
        Active: {activeKey} · variant: {variant}
      </Text>
      <View style={styles.chips}>
        {VARIANTS.map((name) => (
          <Pressable
            key={name}
            onPress={() => setVariant(name)}
            style={[
              styles.chip,
              variant === name && styles.chipOn,
              dark && styles.chipDark,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                dark && styles.chipTextDark,
                variant === name && styles.chipTextOn,
              ]}
            >
              {name}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.toggles}>
        <Pressable
          onPress={cycleScheme}
          style={[styles.toggle, dark && styles.toggleDark]}
        >
          <Text style={[styles.toggleText, dark && styles.toggleTextDark]}>
            theme: {scheme}
          </Text>
        </Pressable>
        <Pressable
          onPress={cycleShadow}
          style={[styles.toggle, dark && styles.toggleDark]}
        >
          <Text style={[styles.toggleText, dark && styles.toggleTextDark]}>
            shadow: {shadowLabel}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFabMode(FAB_MODES[fabMode])}
          style={[styles.toggle, dark && styles.toggleDark]}
        >
          <Text style={[styles.toggleText, dark && styles.toggleTextDark]}>
            center FAB: {fabMode}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setBrand(!brand)}
          style={[styles.toggle, dark && styles.toggleDark]}
        >
          <Text style={[styles.toggleText, dark && styles.toggleTextDark]}>
            colors: {brand ? 'brand' : 'default'}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

export function App() {
  return (
    <SafeAreaProvider>
      <Demo />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  rowScreen: {
    flex: 1,
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  titleDark: {
    color: '#F5F5F7',
  },
  sub: {
    fontSize: 15,
    color: '#8E8E93',
  },
  subDark: {
    color: '#AEAEB2',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
  },
  chipDark: {
    backgroundColor: '#2C2C2E',
  },
  chipOn: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  chipTextDark: {
    color: '#F5F5F7',
  },
  chipTextOn: {
    color: '#fff',
  },
  toggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C7C7CC',
  },
  toggleDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#3A3A3C',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  toggleTextDark: {
    color: '#F5F5F7',
  },
  input: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  washRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  wash: {
    flex: 1,
    height: 120,
    borderRadius: 16,
  },
  hint: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
});
