import { useMemo, useState } from 'react';
import {
  LogBox,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  SmartBottomBar,
  type BottomBarItem,
  type BottomBarVariant,
} from 'react-native-smart-bottom-bars';

// Keep the demo bar visible on device (LogBox banner covers the tab bar).
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

function Glyph({ char, active }: { char: string; active?: boolean }) {
  return (
    <Text style={{ fontSize: 18, opacity: active ? 1 : 0.85 }}>{char}</Text>
  );
}

function Demo() {
  const insets = useSafeAreaInsets();
  const [variant, setVariant] = useState<BottomBarVariant>('flat');
  const [activeKey, setActiveKey] = useState('home');
  const [keyboardProbe, setKeyboardProbe] = useState('');

  const items: BottomBarItem[] = useMemo(
    () => [
      {
        key: 'home',
        label: 'Home',
        icon: <Glyph char="⌂" />,
        badge: 3,
      },
      { key: 'search', label: 'Search', icon: <Glyph char="⌕" /> },
      { key: 'add', label: 'Add', icon: <Glyph char="＋" />, fab: true },
      { key: 'alerts', label: 'Alerts', icon: <Glyph char="◉" />, badge: true },
      { key: 'profile', label: 'Profile', icon: <Glyph char="☺" /> },
    ],
    []
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />
      {variant === 'sidebar' ? (
        <View style={styles.rowScreen}>
          <SmartBottomBar
            variant="sidebar"
            items={items}
            activeKey={activeKey}
            onChange={setActiveKey}
            insets={insets}
            sceneColor="#F2F2F7"
          />
          <ScrollView
            contentContainerStyle={[
              styles.body,
              { paddingTop: insets.top + 16 },
            ]}
            style={styles.flex}
          >
            <Text style={styles.title}>Smart Bottom Bar</Text>
            <Text style={styles.sub}>
              Active: {activeKey} · variant: {variant}
            </Text>
            <View style={styles.chips}>
              {VARIANTS.map((name) => (
                <Pressable
                  key={name}
                  onPress={() => setVariant(name)}
                  style={[styles.chip, variant === name && styles.chipOn]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      variant === name && styles.chipTextOn,
                    ]}
                  >
                    {name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[
              styles.body,
              { paddingTop: insets.top + 16 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Smart Bottom Bar</Text>
            <Text style={styles.sub}>
              Active: {activeKey} · variant: {variant}
            </Text>
            <View style={styles.chips}>
              {VARIANTS.map((name) => (
                <Pressable
                  key={name}
                  onPress={() => setVariant(name)}
                  style={[styles.chip, variant === name && styles.chipOn]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      variant === name && styles.chipTextOn,
                    ]}
                  >
                    {name}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={keyboardProbe}
              onChangeText={setKeyboardProbe}
              placeholder="Focus to test keyboard hide"
              style={styles.input}
            />
          </ScrollView>
          <SmartBottomBar
            variant={variant}
            items={items}
            activeKey={activeKey}
            onChange={setActiveKey}
            insets={insets}
            sceneColor="#F2F2F7"
          />
        </>
      )}
    </View>
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
  },
  sub: {
    fontSize: 15,
    color: '#8E8E93',
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
  chipOn: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  chipTextOn: {
    color: '#fff',
  },
  input: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
});
