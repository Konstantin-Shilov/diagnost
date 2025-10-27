import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Диагностика эмоционального выгорания</h1>

      <p>
        Добро пожаловать в сервис для диагностики эмоционального выгорания. Этот инструмент поможет
        вам оценить ваше текущее состояние и определить уровень эмоционального выгорания.
      </p>

      <div style={{ marginTop: "30px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Link
          to="/survey"
          style={{
            display: "inline-block",
            padding: "15px 30px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Начать диагностику
        </Link>

        <Link
          to="/history"
          style={{
            display: "inline-block",
            padding: "15px 30px",
            backgroundColor: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          История результатов
        </Link>

        <Link
          to="/about"
          style={{
            display: "inline-block",
            padding: "15px 30px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          О диагностике
        </Link>
      </div>

      <section style={{ marginTop: "40px" }}>
        <h2>Как это работает?</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>1. Опрос</h3>
            <p>Ответьте на вопросы по 5 блокам: симптомы, состояние, внутренние причины</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>2. Анализ</h3>
            <p>Система автоматически проанализирует ваши ответы и определит уровень выгорания</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>3. Результаты</h3>
            <p>Получите детальный отчет с рекомендациями и возможностью сохранения в PDF</p>
          </div>
        </div>
      </section>
    </div>
  );
}
