import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "danger-ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "icon";
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark",
  secondary: "border border-line bg-surface text-ink hover:border-ink/20 hover:bg-paper",
  ghost: "text-muted hover:bg-paper hover:text-ink",
  danger: "bg-danger text-white hover:bg-danger/90",
  "danger-ghost": "text-muted hover:bg-danger-soft hover:text-danger",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "h-8 w-8",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 motion-safe:active:scale-95 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
