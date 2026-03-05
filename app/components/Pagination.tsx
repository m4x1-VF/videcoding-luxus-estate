"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function Pagination({ currentPage, totalPages, totalCount }: PaginationProps) {
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Generate page numbers to show (max 5 around current page)
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <p className="text-sm text-nordic-muted">
        Showing page <span className="font-semibold text-nordic-dark">{currentPage}</span> of{" "}
        <span className="font-semibold text-nordic-dark">{totalPages}</span> &mdash;{" "}
        <span className="font-semibold text-nordic-dark">{totalCount}</span> properties
      </p>
      <div className="flex items-center gap-2">
        {/* Previous */}
        {hasPrev ? (
          <Link
            href={`${pathname}?page=${prevPage}`}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md text-sm"
          >
            <span className="material-icons text-base">chevron_left</span>
            Prev
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/5 text-nordic-muted/40 font-medium rounded-lg text-sm cursor-not-allowed">
            <span className="material-icons text-base">chevron_left</span>
            Prev
          </span>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {start > 1 && (
            <>
              <Link
                href={`${pathname}?page=1`}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-nordic-muted hover:text-nordic-dark hover:bg-nordic-dark/5 transition-colors"
              >
                1
              </Link>
              {start > 2 && (
                <span className="w-9 h-9 flex items-center justify-center text-sm text-nordic-muted/40">
                  …
                </span>
              )}
            </>
          )}

          {pages.map((p) => (
            <Link
              key={p}
              href={`${pathname}?page=${p}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                p === currentPage
                  ? "bg-mosque text-white shadow-lg shadow-mosque/20"
                  : "text-nordic-muted hover:text-nordic-dark hover:bg-nordic-dark/5"
              }`}
            >
              {p}
            </Link>
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && (
                <span className="w-9 h-9 flex items-center justify-center text-sm text-nordic-muted/40">
                  …
                </span>
              )}
              <Link
                href={`${pathname}?page=${totalPages}`}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-nordic-muted hover:text-nordic-dark hover:bg-nordic-dark/5 transition-colors"
              >
                {totalPages}
              </Link>
            </>
          )}
        </div>

        {/* Next */}
        {hasNext ? (
          <Link
            href={`${pathname}?page=${nextPage}`}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md text-sm"
          >
            Next
            <span className="material-icons text-base">chevron_right</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/5 text-nordic-muted/40 font-medium rounded-lg text-sm cursor-not-allowed">
            Next
            <span className="material-icons text-base">chevron_right</span>
          </span>
        )}
      </div>
    </div>
  );
}
