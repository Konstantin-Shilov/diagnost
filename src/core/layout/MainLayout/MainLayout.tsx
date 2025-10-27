import { Link } from "@tanstack/react-router";
import React from "react";

import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      <header
        style={{
          width: "100%",
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textDecoration: "none",
              color: "#007bff",
            }}
          >
            Диагностика выгорания
          </Link>

          <div style={{ display: "flex", gap: "20px" }}>
            <Link
              to="/"
              style={{ textDecoration: "none", color: "#495057" }}
              activeProps={{ style: { color: "#007bff", fontWeight: "bold" } }}
            >
              Главная
            </Link>
            <Link
              to="/survey"
              style={{ textDecoration: "none", color: "#495057" }}
              activeProps={{ style: { color: "#007bff", fontWeight: "bold" } }}
            >
              Диагностика
            </Link>
            <Link
              to="/history"
              style={{ textDecoration: "none", color: "#495057" }}
              activeProps={{ style: { color: "#007bff", fontWeight: "bold" } }}
            >
              История
            </Link>
            <Link
              to="/about"
              style={{ textDecoration: "none", color: "#495057" }}
              activeProps={{ style: { color: "#007bff", fontWeight: "bold" } }}
            >
              О сервисе
            </Link>
          </div>
        </nav>
      </header>

      <main className={styles.content}>{children}</main>

      <footer
        style={{
          width: "100%",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #dee2e6",
          textAlign: "center" as const,
          color: "#6c757d",
          fontSize: "14px",
        }}
      >
        <p>
          © 2024 Диагностика эмоционального выгорания. Данный сервис не является медицинским
          инструментом.
        </p>
      </footer>
    </div>
  );
};
