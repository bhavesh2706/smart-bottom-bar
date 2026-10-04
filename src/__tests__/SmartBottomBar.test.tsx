import type { ComponentProps } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { fireEvent, render } from '@testing-library/react-native';
import { SmartBottomBar } from '../SmartBottomBar';
import { FlatBottomBar } from '../flat';
import { CurvedBottomBar } from '../curved';
import { FloatingBottomBar } from '../floating';
import { WaveBottomBar } from '../wave';
import { LiquidGlassBottomBar } from '../liquid-glass';
import { NotchedFabBottomBar } from '../notched-fab';
import { MaterialBottomBar } from '../material';
import { SegmentedBottomBar } from '../segmented';
import { SidebarBottomBar } from '../sidebar';
import type { BarIconProps, BottomBarItem, BottomBarVariant } from '../types';

const Icon = ({ label }: { label: string }) => <Text>{label}</Text>;

const items: BottomBarItem[] = [
  { key: 'home', label: 'Home', icon: <Icon label="H" />, badge: 3 },
  { key: 'search', label: 'Search', icon: <Icon label="S" /> },
  { key: 'plus', label: 'Add', icon: <Icon label="+" />, fab: true },
  { key: 'alerts', label: 'Alerts', icon: <Icon label="A" />, badge: true },
  { key: 'profile', label: 'Profile', icon: <Icon label="P" /> },
];

function renderBar(
  override: Partial<ComponentProps<typeof SmartBottomBar>> = {}
) {
  return render(<SmartBottomBar items={items} testID="bar" {...override} />);
}

describe('SmartBottomBar', () => {
  it('renders tabs with accessibility roles and the numeric badge', () => {
    const { getByLabelText, getByText } = renderBar();
    expect(
      getByLabelText('Home, 3 notifications').props.accessibilityRole
    ).toBe('tab');
    expect(
      getByLabelText('Home, 3 notifications').props.accessibilityState
    ).toEqual(expect.objectContaining({ selected: true }));
    expect(getByText('3', { includeHiddenElements: true })).toBeTruthy();
    expect(getByLabelText('Search').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false })
    );
  });

  it('fires onChange with key and source index when selecting another tab', () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderBar({ onChange });
    fireEvent.press(getByLabelText('Search'));
    expect(onChange).toHaveBeenCalledWith('search', 1);
  });

  it('does not call onChange when re-tapping the active tab; fires onDoubleTap instead', () => {
    const onChange = jest.fn();
    const onDoubleTap = jest.fn();
    const onScrollToTop = jest.fn();
    const onPress = jest.fn();
    const { getByLabelText } = renderBar({
      activeKey: 'home',
      onChange,
      onDoubleTap,
      onScrollToTop,
      onPress,
    });
    fireEvent.press(getByLabelText('Home, 3 notifications'));
    expect(onPress).toHaveBeenCalledWith('home', 0);
    expect(onChange).not.toHaveBeenCalled();
    expect(onDoubleTap).toHaveBeenCalledWith('home', 0);
    expect(onScrollToTop).toHaveBeenCalledWith('home');
  });

  it('supports uncontrolled defaultActiveKey', () => {
    const { getByLabelText } = renderBar({ defaultActiveKey: 'search' });
    expect(getByLabelText('Search').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );
  });

  it('supports controlled activeIndex', () => {
    const { getByLabelText } = renderBar({ activeIndex: 4 });
    expect(getByLabelText('Profile').props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );
  });

  it('ignores presses on disabled tabs', () => {
    const onChange = jest.fn();
    const disabledItems: BottomBarItem[] = [
      ...items.slice(0, 4),
      { ...items[4]!, disabled: true },
    ];
    const { getByLabelText } = render(
      <SmartBottomBar items={disabledItems} onChange={onChange} />
    );
    fireEvent.press(getByLabelText('Profile'));
    expect(onChange).not.toHaveBeenCalled();
    expect(getByLabelText('Profile').props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('does not render hidden tabs', () => {
    const hidden: BottomBarItem[] = [
      items[0]!,
      { ...items[1]!, hidden: true },
      items[2]!,
    ];
    const { queryByLabelText, getByLabelText } = render(
      <SmartBottomBar items={hidden} />
    );
    expect(getByLabelText('Home, 3 notifications')).toBeTruthy();
    expect(queryByLabelText('Search')).toBeNull();
  });

  it('fires onLongPress and hapticFeedback', () => {
    const onLongPress = jest.fn();
    const hapticFeedback = jest.fn();
    const { getByLabelText } = renderBar({ onLongPress, hapticFeedback });
    fireEvent(getByLabelText('Search'), 'longPress');
    expect(onLongPress).toHaveBeenCalledWith('search', 1);
    expect(hapticFeedback).toHaveBeenCalledWith('search', 'longPress');
  });

  it('keeps the bar mounted when visible is false', () => {
    const { getByTestId } = renderBar({ visible: false, testID: 'bar' });
    expect(getByTestId('bar')).toBeTruthy();
    expect(getByTestId('bar').props.pointerEvents).toBe('none');
  });

  it('passes through a custom glass surface', () => {
    const { getAllByTestId } = render(
      <SmartBottomBar
        variant="liquidGlass"
        items={items}
        renderGlassSurface={({ children }) => (
          <Text testID="native-glass">{children}</Text>
        )}
      />
    );
    expect(getAllByTestId('native-glass').length).toBeGreaterThan(0);
  });

  it('renders a custom renderItem', () => {
    const { getByText } = renderBar({
      renderItem: ({ item, defaultItem }) =>
        item.key === 'search' ? <Text>CustomSearch</Text> : defaultItem,
    });
    expect(getByText('CustomSearch')).toBeTruthy();
  });

  it('honors shadow true/false on floating', () => {
    const on = render(
      <SmartBottomBar
        variant="floating"
        items={items}
        shadow
        testID="shadow-on"
      />
    );
    const off = render(
      <SmartBottomBar
        variant="floating"
        items={items}
        shadow={false}
        testID="shadow-off"
      />
    );
    expect(on.getByTestId('shadow-on')).toBeTruthy();
    expect(off.getByTestId('shadow-off')).toBeTruthy();
  });

  it('renders center FAB chrome on flat when an item has fab', () => {
    const { getByLabelText } = renderBar({ variant: 'flat' });
    expect(getByLabelText('Add')).toBeTruthy();
    expect(getByLabelText('Home, 3 notifications')).toBeTruthy();
    expect(getByLabelText('Profile')).toBeTruthy();
  });

  describe('liquidGlass center FAB', () => {
    // The raised FAB lives in the shared absolute FabSlot overlay.
    const isRaised = (node: ReactTestInstance) => {
      for (let n: ReactTestInstance | null = node; n; n = n.parent) {
        const style = StyleSheet.flatten(n.props.style);
        if (style?.position === 'absolute' && style.zIndex === 4) {
          return true;
        }
      }
      return false;
    };

    it('raises the FAB above the capsule by default and keeps it pressable', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderBar({
        variant: 'liquidGlass',
        onChange,
      });
      const fab = getByLabelText('Add');
      expect(isRaised(fab)).toBe(true);
      fireEvent.press(fab);
      expect(onChange).toHaveBeenCalledWith('plus', 2);
    });

    it('embeds the FAB with glass.fabPlacement="embedded"', () => {
      const onChange = jest.fn();
      const { getByLabelText } = renderBar({
        variant: 'liquidGlass',
        glass: { fabPlacement: 'embedded' },
        onChange,
      });
      const fab = getByLabelText('Add');
      expect(isRaised(fab)).toBe(false);
      fireEvent.press(fab);
      expect(onChange).toHaveBeenCalledWith('plus', 2);
    });

    it('marks the raised FAB selected when it is the active key', () => {
      const { getByLabelText } = renderBar({
        variant: 'liquidGlass',
        activeKey: 'plus',
      });
      expect(getByLabelText('Add').props.accessibilityState).toEqual(
        expect.objectContaining({ selected: true })
      );
      expect(getByLabelText('Search').props.accessibilityState).toEqual(
        expect.objectContaining({ selected: false })
      );
    });

    it('ignores presses on a disabled raised FAB', () => {
      const onChange = jest.fn();
      const disabledFab = items.map((item) =>
        item.fab ? { ...item, disabled: true } : item
      );
      const { getByLabelText } = render(
        <SmartBottomBar
          variant="liquidGlass"
          items={disabledFab}
          onChange={onChange}
        />
      );
      fireEvent.press(getByLabelText('Add'));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('renders a plain tab row when no item is a FAB', () => {
      const noFab = items.map(({ fab: _fab, ...item }) => item);
      const { getByLabelText } = render(
        <SmartBottomBar variant="liquidGlass" items={noFab} />
      );
      expect(isRaised(getByLabelText('Add'))).toBe(false);
    });

    it('does not crash when fabKey points to a missing item', () => {
      const { getByLabelText } = renderBar({
        variant: 'liquidGlass',
        fabKey: 'missing',
      });
      expect(getByLabelText('Profile')).toBeTruthy();
    });
  });

  describe('function icons', () => {
    const spyItems = () => {
      const tabIcon = jest.fn(({ color }: BarIconProps) => (
        <Text>{`tab:${color}`}</Text>
      ));
      const fabIcon = jest.fn(({ color }: BarIconProps) => (
        <Text>{`fab:${color}`}</Text>
      ));
      const list: BottomBarItem[] = [
        { key: 'home', label: 'Home', icon: tabIcon },
        { key: 'search', label: 'Search', icon: tabIcon },
        { key: 'plus', label: 'Add', icon: fabIcon, fab: true },
        { key: 'alerts', label: 'Alerts', icon: tabIcon },
        { key: 'profile', label: 'Profile', icon: tabIcon },
      ];
      return { list, tabIcon, fabIcon };
    };

    it('tints row icons by state and FAB icons with the on-FAB color', () => {
      const { list, tabIcon, fabIcon } = spyItems();
      render(
        <SmartBottomBar
          variant="flat"
          items={list}
          activeKey="home"
          colorScheme="light"
        />
      );
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#007AFF', focused: true, size: 24 })
      );
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#636366', focused: false })
      );
      expect(fabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#FFFFFF' })
      );
    });

    it('uses the on-FAB color for the active wave bubble and hides its row slot', () => {
      const { list } = spyItems();
      const noFab = list.map(({ fab: _fab, ...item }) => item);
      const { getAllByLabelText, getByText } = render(
        <SmartBottomBar variant="wave" items={noFab} activeKey="search" />
      );
      expect(getByText('tab:#FFFFFF')).toBeTruthy();
      expect(getAllByLabelText('Search')).toHaveLength(1);
      expect(
        getAllByLabelText('Search', { includeHiddenElements: true })
      ).toHaveLength(2);
    });

    it('falls back to icon when activeIcon is missing and survives a null render', () => {
      const empty = jest.fn(() => null);
      const { getByLabelText } = render(
        <SmartBottomBar
          items={[
            { key: 'a', label: 'A', icon: empty },
            { key: 'b', label: 'B' },
          ]}
          activeKey="a"
        />
      );
      expect(empty).toHaveBeenCalledWith(
        expect.objectContaining({ focused: true })
      );
      expect(getByLabelText('B')).toBeTruthy();
    });
  });

  describe('material active indicator', () => {
    const pillsIn = (node: ReactTestInstance) =>
      node.findAll(
        (n) =>
          typeof n.type === 'string' &&
          StyleSheet.flatten(n.props.style)?.width === 56 &&
          StyleSheet.flatten(n.props.style)?.height === 32
      );

    it('draws the pill behind the active tab only', () => {
      const { getByLabelText } = renderBar({
        variant: 'material',
        activeKey: 'search',
        colorScheme: 'light',
      });
      const pills = pillsIn(getByLabelText('Search'));
      expect(pills).toHaveLength(1);
      expect(StyleSheet.flatten(pills[0]!.props.style).backgroundColor).toBe(
        '#E8DEF8'
      );
      expect(pillsIn(getByLabelText('Profile'))).toHaveLength(0);
    });

    it('does not draw the pill on non-material variants', () => {
      const { getByLabelText } = renderBar({
        variant: 'flat',
        activeKey: 'search',
      });
      expect(pillsIn(getByLabelText('Search'))).toHaveLength(0);
    });
  });

  describe('customization', () => {
    const tinted = () => {
      const tabIcon = jest.fn((p: BarIconProps) => <Text>{p.color}</Text>);
      const fabIcon = jest.fn((p: BarIconProps) => <Text>{p.color}</Text>);
      const list: BottomBarItem[] = [
        { key: 'home', label: 'Home', icon: tabIcon, badge: 2 },
        { key: 'search', label: 'Search', icon: tabIcon },
        { key: 'plus', label: 'Add', icon: fabIcon, fab: true },
        { key: 'alerts', label: 'Alerts', icon: tabIcon },
        { key: 'profile', label: 'Profile', icon: tabIcon },
      ];
      return { list, tabIcon, fabIcon };
    };
    const badgeColor = (node: ReactTestInstance) =>
      node.findAll(
        (n) =>
          typeof n.type === 'string' &&
          StyleSheet.flatten(n.props.style)?.backgroundColor === '#00AA55'
      ).length;

    it('applies shared color overrides to tabs, FAB and badge', () => {
      const { list, tabIcon, fabIcon } = tinted();
      const { getByLabelText } = render(
        <SmartBottomBar
          items={list}
          activeKey="home"
          colors={{
            active: '#E91E63',
            inactive: '#999999',
            fabIcon: '#111111',
            badge: '#00AA55',
          }}
        />
      );
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#E91E63', focused: true })
      );
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#999999', focused: false })
      );
      expect(fabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#111111' })
      );
      expect(badgeColor(getByLabelText('Home, 2 notifications'))).toBe(1);
    });

    it('applies per-scheme overrides only to that scheme', () => {
      const { list, tabIcon } = tinted();
      const colors = { active: '#E91E63', dark: { active: '#FFC107' } };
      const light = render(
        <SmartBottomBar
          items={list}
          activeKey="home"
          colorScheme="light"
          colors={colors}
        />
      );
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#E91E63', focused: true })
      );
      light.unmount();
      tabIcon.mockClear();
      render(
        <SmartBottomBar
          items={list}
          activeKey="home"
          colorScheme="dark"
          colors={colors}
        />
      );
      const calls = tabIcon.mock.calls.map(([p]) => p);
      expect(calls).toContainEqual(
        expect.objectContaining({ color: '#FFC107', focused: true })
      );
      expect(calls).not.toContainEqual(
        expect.objectContaining({ color: '#E91E63' })
      );
    });

    it('keeps the variant palette when colors is empty or omitted', () => {
      const { list, tabIcon } = tinted();
      render(
        <SmartBottomBar
          variant="material"
          items={list}
          activeKey="home"
          colorScheme="light"
          colors={{}}
        />
      );
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ color: '#6750A4', focused: true })
      );
    });

    it('passes iconSize to function icons', () => {
      const { list, tabIcon } = tinted();
      render(<SmartBottomBar items={list} iconSize={30} />);
      expect(tabIcon).toHaveBeenCalledWith(
        expect.objectContaining({ size: 30 })
      );
    });

    it('applies activeLabel / activeItem styles to the selected tab only', () => {
      const { getByLabelText, getByText } = renderBar({
        variant: 'floating',
        activeKey: 'search',
        style: {
          activeLabel: { fontSize: 15 },
          activeItem: { borderRadius: 13 },
        },
      });
      const flat = (style: unknown) =>
        StyleSheet.flatten(style as never) as Record<string, unknown>;
      expect(flat(getByText('Search').props.style).fontSize).toBe(15);
      expect(flat(getByText('Profile').props.style).fontSize).not.toBe(15);
      expect(flat(getByLabelText('Search').props.style).borderRadius).toBe(13);
      expect(
        flat(getByLabelText('Profile').props.style).borderRadius
      ).toBeUndefined();
    });

    it('does not subscribe to the keyboard when keyboardBehavior is none', () => {
      const { Keyboard } = require('react-native');
      const spy = jest.spyOn(Keyboard, 'addListener');
      renderBar({ keyboardBehavior: 'none' });
      expect(spy).not.toHaveBeenCalled();
      renderBar({ keyboardBehavior: 'hide' });
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('renders the lens with a custom timing animation without crashing', () => {
      const { getByLabelText, queryByTestId } = renderBar({
        variant: 'liquidGlass',
        animation: { type: 'timing', duration: 120 },
      });
      const layout = (x: number) => ({
        nativeEvent: { layout: { x, y: 0, width: 60, height: 50 } },
      });
      fireEvent(getByLabelText('Home, 3 notifications'), 'layout', layout(0));
      fireEvent(getByLabelText('Search'), 'layout', layout(60));
      fireEvent.press(getByLabelText('Search'));
      expect(
        queryByTestId('bar-lens', { includeHiddenElements: true })
      ).toBeTruthy();
    });
  });

  describe('sidebar FAB', () => {
    it('leads the rail with the FAB and keeps it pressable', () => {
      const onChange = jest.fn();
      const { getAllByRole, getByLabelText } = renderBar({
        variant: 'sidebar',
        onChange,
      });
      expect(getAllByRole('tab')[0]).toBe(getByLabelText('Add'));
      fireEvent.press(getByLabelText('Add'));
      expect(onChange).toHaveBeenCalledWith('plus', 2);
    });

    it('renders a plain rail without a FAB item or with a missing fabKey', () => {
      const noFab = items.map(({ fab: _fab, ...item }) => item);
      const plain = render(<SmartBottomBar variant="sidebar" items={noFab} />);
      expect(plain.getAllByRole('tab')[0]).toBe(
        plain.getByLabelText('Home, 3 notifications')
      );
      const missing = render(
        <SmartBottomBar variant="sidebar" items={noFab} fabKey="missing" />
      );
      expect(missing.getAllByRole('tab')).toHaveLength(5);
    });
  });

  it('shows the liquidGlass selection lens once tabs are measured', () => {
    const { getByLabelText, queryByTestId } = renderBar({
      variant: 'liquidGlass',
    });
    expect(
      queryByTestId('bar-lens', { includeHiddenElements: true })
    ).toBeNull();
    const layout = (x: number) => ({
      nativeEvent: { layout: { x, y: 0, width: 60, height: 50 } },
    });
    fireEvent(getByLabelText('Home, 3 notifications'), 'layout', layout(0));
    fireEvent(getByLabelText('Search'), 'layout', layout(60));
    expect(
      queryByTestId('bar-lens', { includeHiddenElements: true })
    ).toBeTruthy();
  });
});

const variants: BottomBarVariant[] = [
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

describe('variants', () => {
  it.each(variants)('renders variant %s without throwing', (variant) => {
    const { getByTestId } = render(
      <SmartBottomBar
        variant={variant}
        items={items}
        testID={`bar-${variant}`}
      />
    );
    expect(getByTestId(`bar-${variant}`)).toBeTruthy();
  });

  it('matches a snapshot per variant', () => {
    for (const variant of variants) {
      const tree = render(
        <SmartBottomBar
          variant={variant}
          items={items}
          testID={`snap-${variant}`}
        />
      );
      expect(tree.toJSON()).toMatchSnapshot(variant);
    }
  });
});

describe('tree-shake entry components', () => {
  it('renders each named variant export', () => {
    const entries = [
      FlatBottomBar,
      CurvedBottomBar,
      FloatingBottomBar,
      WaveBottomBar,
      LiquidGlassBottomBar,
      NotchedFabBottomBar,
      MaterialBottomBar,
      SegmentedBottomBar,
      SidebarBottomBar,
    ];
    for (const Cmp of entries) {
      const { getByLabelText, unmount } = render(<Cmp items={items} />);
      expect(getByLabelText('Search')).toBeTruthy();
      unmount();
    }
  });
});
