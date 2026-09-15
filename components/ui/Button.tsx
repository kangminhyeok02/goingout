import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800",
  secondary:
    "bg-white text-teal-700 border border-teal-200 hover:bg-teal-50",
  ghost: "text-zinc-600 hover:bg-zinc-100",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
