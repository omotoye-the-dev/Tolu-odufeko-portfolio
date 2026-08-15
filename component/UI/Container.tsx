import type { ReactNode } from "react";
import { clsx } from "clsx";

export interface ContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly as?: "div" | "section" | "article" | "main";
}

export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={clsx(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-10 lg:px-16",
        className
      )}
    >
      {children}
    </Component>
  );
}

export default Container;
