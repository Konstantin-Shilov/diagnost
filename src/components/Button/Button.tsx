import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import React from "react";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButtonProps extends BaseButtonProps {
  as?: "button";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ButtonAsLinkProps extends BaseButtonProps {
  as: "link";
  to: string;
  params?: Record<string, string>;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = "primary", size = "md", fullWidth = false, className = "", children } = props;

  if (props.as === "link") {
    const { to, params } = props;
    return (
      <Link
        to={to}
        params={params}
        className={clsx(styles.button, className)}
        data-variant={variant}
        data-size={size}
        data-full-width={fullWidth || undefined}
      >
        {children}
      </Link>
    );
  }

  const { type = "button", disabled = false, onClick } = props;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(styles.button, className)}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
    >
      {children}
    </button>
  );
};
