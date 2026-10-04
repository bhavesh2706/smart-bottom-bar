import type { BarEngine } from '../hooks/useBarEngine';
import { BarItem } from './BarItem';
import { maybeReverse } from '../utils';
import type { BottomBarItem } from '../types';

export function ItemRow({
  engine,
  items,
  compact,
  vertical,
  noShrink,
  onItemLayout,
  pill,
  ghostKey,
}: {
  engine: BarEngine;
  items: readonly BottomBarItem[];
  compact?: boolean;
  vertical?: boolean;
  noShrink?: boolean;
  /** Reports each item's x/width relative to the row it is laid out in. */
  onItemLayout?: (key: string, x: number, width: number) => void;
  pill?: string;
  ghostKey?: string;
}) {
  const ordered = maybeReverse(items, engine.rtl && !vertical);

  return (
    <>
      {ordered.map((item, visualIndex) => {
        const sourceIndex = engine.shown.findIndex((it) => it.key === item.key);
        return (
          <BarItem
            key={item.key}
            item={item}
            index={sourceIndex < 0 ? visualIndex : sourceIndex}
            active={item.key === engine.active.activeKey}
            colors={engine.colors}
            labelPosition={engine.labelPosition}
            compact={compact}
            vertical={vertical}
            noShrink={noShrink}
            onPress={() => engine.handlePress(item.key)}
            onLongPress={() => engine.handleLongPress(item.key)}
            style={engine.style}
            renderItem={engine.renderItem}
            iconSize={engine.iconSize}
            pressFeedback={engine.pressFeedback}
            labelProps={engine.labelProps}
            badgeMax={engine.badgeMax}
            pill={pill}
            ghost={item.key === ghostKey}
            onLayout={
              onItemLayout
                ? (event) =>
                    onItemLayout(
                      item.key,
                      event.nativeEvent.layout.x,
                      event.nativeEvent.layout.width
                    )
                : undefined
            }
          />
        );
      })}
    </>
  );
}
