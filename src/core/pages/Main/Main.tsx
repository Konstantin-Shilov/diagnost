import { Button } from "@/components/Button";
import { Text, Title } from "@/components/Typography";

import styles from "./Main.module.css";

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <Title size="xl" level="h1" semantic="accent" className={styles.title}>
        Диагностика эмоционального выгорания
      </Title>

      <Text size="lg" variant="primary" className={styles.subtitle}>
        Привет! Я помогу определить уровень выгорания и его внутренние причины.
      </Text>

      <div className={styles.methodologySection}>
        <Text variant="secondary" className={styles.methodologyTitle}>
          Диагностика основана на:
        </Text>
        <ul className={styles.methodologyList}>
          <li>
            <Text>MBI (Кристина Маслач)</Text>
          </li>
          <li>
            <Text>Модели Гринберга (адаптация БПСП, 5 стадий)</Text>
          </li>
          <li>
            <Text>Биопсихосоциальном анализе (тело – эмоции – мысли – поведение)</Text>
          </li>
          <li>
            <Text>3000+ диагностик выгорания</Text>
          </li>
        </ul>
        <Text variant="secondary" className={styles.methodologyNote}>
          Диагностика подходит не только для профессионального вида выгорания, а для всех —
          материнское, в отношениях и т.д.
        </Text>
      </div>

      <div className={styles.buttonGroup}>
        <Button as="link" to="/survey" variant="primary">
          Начать диагностику
        </Button>

        <Button as="link" to="/about" variant="secondary">
          О методике
        </Button>
      </div>
    </div>
  );
};
