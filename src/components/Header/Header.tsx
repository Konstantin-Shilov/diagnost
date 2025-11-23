import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BurgerButton } from "@/components/BurgerButton";
import { Text } from "@/components/Typography";

import styles from "./Header.module.css";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/survey", label: "Диагностика" },
  { to: "/history", label: "История" },
  { to: "/about", label: "О сервисе" },
] as const;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <need to close menu after changing location>
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.logo}>
            <Text semantic="accent">Диагностика выгорания</Text>
          </Link>

          {/* Desktop navigation */}
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={styles.navLink}
                activeProps={{ className: `${styles.navLink} ${styles.active}` }}
              >
                <Text>{item.label}</Text>
              </Link>
            ))}
          </div>

          {/* Burger button (mobile only) */}
          <div className={styles.burgerWrapper}>
            <BurgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </nav>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className={styles.headerSpacer} />

      {/* Mobile menu */}
      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={styles.mobileNavLink}
              activeProps={{ className: `${styles.mobileNavLink} ${styles.active}` }}
            >
              <Text>{item.label}</Text>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
