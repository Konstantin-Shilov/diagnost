import { Link } from "@tanstack/react-router";
import React from "react";

import { Text } from "@/components/Typography";
import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link
            to="/"
            className={styles.logo}
          >
            <Text semantic="accent">Диагностика выгорания</Text>
          </Link>

          <div className={styles.navLinks}>
            <Link
              to="/"
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.active}` }}
            >
              <Text>Главная</Text>
            </Link>
            <Link
              to="/survey"
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.active}` }}
            >
              <Text>Диагностика</Text>
            </Link>
            <Link
              to="/history"
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.active}` }}
            >
              <Text>История</Text>
            </Link>
            <Link
              to="/about"
              className={styles.navLink}
              activeProps={{ className: `${styles.navLink} ${styles.active}` }}
            >
              <Text>О сервисе</Text>
            </Link>
          </div>
        </nav>
      </header>

      <main className={styles.content}>{children}</main>

      <footer className={styles.footer}>
        <Text size="sm" variant="tertiary">
          © 2024 Диагностика эмоционального выгорания. Данный сервис не является медицинским
          инструментом.
        </Text>
      </footer>
    </div>
  );
};
