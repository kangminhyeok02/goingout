import type { CSSProperties, ReactNode } from "react";

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
