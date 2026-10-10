import { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label: string;
  name: string;
  error?: string;
};

export default function Input({ label, name, error, required, className = "", ...props }: InputProps) {
  const errorId = `${name}-error`;

  return (
    <div className={`relative ${className}`.trim()}>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`h-10 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition-colors placeholder:text-muted focus:ring-2 ${
          error
            ? "border-danger focus:ring-danger/20"
            : "border-line focus:border-brand focus:ring-brand/15"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="absolute top-full left-0 mt-1 w-full truncate text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
