import clsx from "clsx";
import React from "react";

import styles from "./Typography.module.css";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TextVariant = "primary" | "secondary" | "tertiary" | "quaternary";
export type TextSemantic =
  | "general"
  | "accent"
  | "negative"
  | "warning"
  | "positive"
  | "interactive"
  | "helping";
export type TextElement = "p" | "span" | "div" | "label";

interface TextProps {
  size?: TextSize;
  variant?: TextVariant;
  semantic?: TextSemantic;
  as?: TextElement;
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  size = "md",
  variant,
  semantic,
  as = "p",
  className,
  children,
  ...props
}) => {
  const Component = as;

  return (
    <Component
      className={clsx(styles.text, className)}
      data-size={size}
      data-variant={variant}
      data-semantic={semantic}
      {...props}
    >
      {children}
    </Component>
  );
};
