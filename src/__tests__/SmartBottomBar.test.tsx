import type { ComponentProps } from 'react';
import { Text } from 'react-native';
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
import type { BottomBarItem, BottomBarVariant } from '../types';

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

  it('embeds the FAB in the liquidGlass capsule and keeps it pressable', () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderBar({ variant: 'liquidGlass', onChange });
    fireEvent.press(getByLabelText('Add'));
    expect(onChange).toHaveBeenCalledWith('plus', 2);
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
