import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  readonly className?: string;
  readonly rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const ROUNDED_MAP: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({
  className,
  rounded = "md",
  ...restProps
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse bg-dark-one/10",
        ROUNDED_MAP[rounded],
        className
      )}
      {...restProps}
    />
  );
}

export default Skeleton;
