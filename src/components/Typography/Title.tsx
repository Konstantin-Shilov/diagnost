import clsx from "clsx";
import React from "react";

import styles from "./Typography.module.css";

export type TitleSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TitleLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TitleVariant = "primary" | "secondary" | "tertiary" | "quaternary";
export type TitleSemantic =
  | "general"
  | "accent"
  | "negative"
  | "warning"
  | "positive"
  | "interactive"
  | "helping";

interface TitleProps {
  size?: TitleSize;
  level?: TitleLevel;
  variant?: TitleVariant;
  semantic?: TitleSemantic;
  className?: string;
  children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({
  size = "md",
  level = "h2",
  variant,
  semantic,
  className,
  children,
  ...props
}) => {
  const Component = level;

  return (
    <Component
      className={clsx(styles.title, className)}
      data-size={size}
      data-variant={variant}
      data-semantic={semantic}
      {...props}
    >
      {children}
    </Component>
  );
};
