import { useCallback, useEffect, useRef, useState } from "react";

type NumberKeyOf<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export type MasonryGridProps<TItem = object> = {
  items: TItem[];
  columns: number;
  keyAccessor: keyof TItem;
  heightAccessor: NumberKeyOf<TItem>;
  widthAccessor: NumberKeyOf<TItem>;
  children: (item: TItem) => React.ReactNode;
};

function MasonryGridItem<TItem extends object>({
  item,
  children,
  height,
  autoRows,
}: {
  item: TItem;
  children: (item: TItem) => React.ReactNode;
  height: number;
  autoRows: number;
}) {
  return (
    <div
      className="masonry-grid-item"
      style={{
        gridRowEnd: `span ${Math.ceil(height / autoRows)}`,
      }}
    >
      {children(item)}
    </div>
  );
}

const columnsByMinWidth: Record<number, number> = {
  0: 1,
  320: 2,
  480: 3,
  768: 4,
  1024: 5,
};

/**
 * Calculate the relative height of each item by calculating the ratio of the column width to the height of the item
 * @param props the props of the masonry grid
 * @returns the grid element of all the items
 */
export default function MasonryGrid<TItem extends object = object>(
  props: MasonryGridProps<TItem>
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    columnWidth: 0,
    autoRows: 4,
    currentColumns: props.columns,
  });
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    function handleResize() {
      if (!container) return;
      const containerWidth = container.getBoundingClientRect().width;
      let currentColumn = props.columns;
      for (const minWidth in columnsByMinWidth) {
        if (containerWidth > parseInt(minWidth)) {
          currentColumn = columnsByMinWidth[minWidth];
        }
      }
        
      const columnWidth = Math.floor(
        container.getBoundingClientRect().width / currentColumn - currentColumn
      );
      setState((state) => ({
        ...state,
        columnWidth,
        currentColumn
      }));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [props.columns]);
  const calcItemHeight = useCallback(
    (item: TItem) => {
      const height = item[props.heightAccessor] as number;
      const width = item[props.widthAccessor] as number;
      const aspectRatio = width / height;
      return Math.floor(state.columnWidth / aspectRatio);
    },
    [props.heightAccessor, state.columnWidth]
  );
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${state.columnWidth}px, 1fr))`,
        gridAutoRows: `${state.autoRows}px`,
      }}
      ref={containerRef}
      className="masonry-grid"
    >
      {props.items.map((item) => (
        <MasonryGridItem
          key={String(item[props.keyAccessor])}
          item={item}
          children={props.children}
          height={calcItemHeight(item)}
          autoRows={state.autoRows}
        />
      ))}
    </div>
  );
}
