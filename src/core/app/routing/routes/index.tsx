import { createFileRoute, Link } from "@tanstack/react-router";

import { Text, Title } from "@/components/Typography";
import styles from "./index.module.css";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className={styles.container}>
      <Title size="xl" level="h1" semantic="accent">
        Диагностика эмоционального выгорания
      </Title>

      <Text size="lg" variant="secondary" className={styles.description}>
        Добро пожаловать в сервис для диагностики эмоционального выгорания. Этот инструмент поможет
        вам оценить ваше текущее состояние и определить уровень эмоционального выгорания.
      </Text>

      <div className={styles.buttonGroup}>
        <Link
          to="/survey"
          className={styles.primaryButton}
        >
          Начать диагностику
        </Link>

        <Link
          to="/history"
          className={styles.secondaryButton}
        >
          История результатов
        </Link>

        <Link
          to="/about"
          className={styles.successButton}
        >
          О диагностике
        </Link>
      </div>

      <section className={styles.section}>
        <Title size="lg" level="h2" variant="primary">Как это работает?</Title>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <Title size="md" level="h3" semantic="accent">1. Опрос</Title>
            <Text variant="secondary">Ответьте на вопросы по 5 блокам: симптомы, состояние, внутренние причины</Text>
          </div>

          <div className={styles.card}>
            <Title size="md" level="h3" semantic="accent">2. Анализ</Title>
            <Text variant="secondary">Система автоматически проанализирует ваши ответы и определит уровень выгорания</Text>
          </div>

          <div className={styles.card}>
            <Title size="md" level="h3" semantic="accent">3. Результаты</Title>
            <Text variant="secondary">Получите детальный отчет с рекомендациями и возможностью сохранения в PDF</Text>
          </div>
        </div>
      </section>
    </div>
  );
}
