import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

type PaginationProps = {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, disabled = false, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 md:px-5"
    >
      <p className="text-xs font-medium text-muted tabular-nums">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={disabled || page === 1}
          className="group gap-1 pl-2 hover:shadow-sm motion-safe:hover:-translate-y-px"
        >
          <ChevronLeft size={14} className="transition-transform duration-200 motion-safe:group-hover:-translate-x-0.5" />
          Previous
        </Button>
        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={number === page ? "primary" : "ghost"}
              size="icon"
              onClick={() => onChange(number)}
              disabled={disabled}
              aria-label={`Page ${number}`}
              aria-current={number === page ? "page" : undefined}
              className="text-xs tabular-nums motion-safe:hover:-translate-y-px"
            >
              {number}
            </Button>
          ))}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={disabled || page === totalPages}
          className="group gap-1 pr-2 hover:shadow-sm motion-safe:hover:-translate-y-px"
        >
          Next
          <ChevronRight size={14} className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5" />
        </Button>
      </div>
    </nav>
  );
}
