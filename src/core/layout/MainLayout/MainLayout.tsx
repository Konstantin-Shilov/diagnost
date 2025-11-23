import type React from "react";

import { Header } from "@/components/Header";
import { Text } from "@/components/Typography";

import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <Header />

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
