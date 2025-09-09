import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders skeleton rows for loading state in tables.
 * @param {number} columns - Number of columns in the table.
 * @param {number} rows - Number of rows to show while loading.
 */
export const TableSkeleton = ({ columns = 5, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={`row-${rowIdx}`}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={`col-${colIdx}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
