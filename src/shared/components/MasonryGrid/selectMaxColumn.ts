const columnsByMinWidth: Record<number, number> = {
  0: 1,
  320: 2,
  480: 3,
  768: 4,
  1024: 5,
};

export default function selectMaxColumn(
  columns: number,
  containerWidth: number
) {
  let currentColumn = columns;
  for (const minWidth in columnsByMinWidth) {
    const column = columnsByMinWidth[minWidth];
    if (containerWidth > parseInt(minWidth)) {
      currentColumn = column;
    }
  }
  currentColumn = Math.min(currentColumn, columns);
  return currentColumn;
}
