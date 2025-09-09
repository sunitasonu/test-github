// import { TableRow, TableCell } from "@/components/ui/table";
// import clsx from "clsx";

// /**
//  * Fancy shimmer effect with a sweeping animation.
//  */
// export const ShimmerSkeleton = ({ columns = 5, rows = 5 }) => {
//   return (
//     <>
//       {Array.from({ length: rows }).map((_, rowIdx) => (
//         <TableRow key={`row-${rowIdx}`}>
//           {Array.from({ length: columns }).map((_, colIdx) => (
//             <TableCell key={`col-${colIdx}`}>
//               <div
//                 className={clsx(
//                   "relative overflow-hidden h-4 w-full rounded-md bg-muted"
//                 )}
//               >
//                 <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-40 blur-sm transition ease-in-out" />
//               </div>
//             </TableCell>
//           ))}
//         </TableRow>
//       ))}
//     </>
//   );
// };

import { TableRow, TableCell } from "@/components/ui/table";

/**
 * Fancy shimmer effect with a sweeping animation that matches table layout.
 */
export const ShimmerSkeleton = ({ columns = 10, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={`row-${rowIdx}`}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={`col-${colIdx}`}>
              <div className="relative w-full h-[45px] rounded bg-muted overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-60 blur-[1px] blur-sm transition ease-in-out" />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
