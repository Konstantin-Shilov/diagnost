import { createFileRoute } from "@tanstack/react-router";

import { Text, Title } from "@/components/Typography";

import styles from "./about.module.css";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className={styles.container}>
      <Title size="xl" level="h1" semantic="accent" className={styles.mainTitle}>
        О диагностике эмоционального выгорания
      </Title>

      <section className={styles.section}>
        <Title size="lg" level="h2" variant="primary">
          Что такое эмоциональное выгорание?
        </Title>
        <Text size="lg" variant="secondary">
          Эмоциональное выгорание — это состояние физического, эмоционального и ментального
          истощения, которое возникает в результате длительного воздействия стрессовых ситуаций. Это
          не просто усталость, а системное нарушение, затрагивающее все сферы жизни.
        </Text>
      </section>

      <section className={styles.section}>
        <Title size="lg" level="h2" variant="primary">
          Методология диагностики
        </Title>
        <Text size="lg" variant="secondary" className={styles.sectionText}>
          Наша диагностика основана на комплексном подходе, объединяющем несколько научно
          обоснованных методик:
        </Text>
        <div className={styles.methodologyBlock}>
          <div className={styles.methodItem}>
            <Title size="md" level="h3" variant="primary">
              MBI (Maslach Burnout Inventory)
            </Title>
            <Text>
              Опросник Кристины Маслач — золотой стандарт диагностики выгорания. Оценивает три
              ключевых компонента: эмоциональное истощение, деперсонализацию и редукцию личных
              достижений.
            </Text>
          </div>

          <div className={styles.methodItem}>
            <Title size="md" level="h3" variant="primary">
              Модель Гринберга (адаптация БПСП)
            </Title>
            <Text>
              Пятистадийная модель развития выгорания, адаптированная через призму
              биопсихосоциального подхода (БПСП). Каждая стадия анализируется по пяти измерениям:
            </Text>
            <ul className={styles.bpspList}>
              <li>
                <Text>
                  <strong>Тело</strong> — физические проявления и симптомы
                </Text>
              </li>
              <li>
                <Text>
                  <strong>Эмоции</strong> — эмоциональное состояние и переживания
                </Text>
              </li>
              <li>
                <Text>
                  <strong>Мысли</strong> — когнитивные паттерны и убеждения
                </Text>
              </li>
              <li>
                <Text>
                  <strong>Поведение</strong> — поведенческие проявления и привычки
                </Text>
              </li>
              <li>
                <Text>
                  <strong>Риск</strong> — прогноз и потенциальные последствия
                </Text>
              </li>
            </ul>
          </div>

          <div className={styles.methodItem}>
            <Title size="md" level="h3" variant="primary">
              Опыт 3000+ диагностик
            </Title>
            <Text>
              Методика откалибрована на основе реального опыта проведения более 3000 диагностик
              выгорания в различных сферах деятельности.
            </Text>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <Title size="lg" level="h2" variant="primary">
          5 стадий выгорания по Гринбергу (адаптация БПСП)
        </Title>
        <div className={styles.stagesList}>
          <div className={styles.stageItem}>
            <Title size="md" level="h3" semantic="accent">
              Стадия 1: Энтузиазм
            </Title>
            <Text variant="secondary">
              Высокая вовлечённость, готовность много работать, оптимизм. Характеризуется высокой
              энергией и драйвом, но есть риск игнорирования ранних сигналов усталости.
            </Text>
          </div>

          <div className={styles.stageItem}>
            <Title size="md" level="h3" semantic="accent">
              Стадия 2: Усталость
            </Title>
            <Text variant="secondary">
              Накопленная усталость, первые признаки истощения ресурсов. Появляются нарушения сна,
              раздражительность, начинается прокрастинация.
            </Text>
          </div>

          <div className={styles.stageItem}>
            <Title size="md" level="h3" semantic="accent">
              Стадия 3: Хронические симптомы
            </Title>
            <Text variant="secondary">
              Стабильное снижение энергии, частые недомогания, отстранённость. Снижение иммунитета,
              апатия, формальное выполнение обязанностей.
            </Text>
          </div>

          <div className={styles.stageItem}>
            <Title size="md" level="h3" semantic="warning">
              Стадия 4: Истощение
            </Title>
            <Text variant="secondary">
              Глубокая усталость, тревога, потеря контроля над ситуацией. Бессонница, эмоциональные
              срывы, конфликты, негативное мышление.
            </Text>
          </div>

          <div className={styles.stageItem}>
            <Title size="md" level="h3" semantic="negative">
              Стадия 5: Угасание
            </Title>
            <Text variant="secondary">
              Полное эмоциональное и физическое истощение, отстранённость от жизни. Хронические
              заболевания, пустота, безнадёжность, изоляция. Высокий риск депрессии.
            </Text>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <Title size="lg" level="h2" variant="primary">
          Универсальность диагностики
        </Title>
        <Text size="lg" variant="secondary">
          Диагностика подходит не только для профессионального выгорания, но и для других видов:
          материнское выгорание, выгорание в отношениях, учебное выгорание и т.д. Выгорание — это
          универсальный процесс истощения ресурсов в любой сфере жизни.
        </Text>
      </section>

      <section className={styles.section}>
        <Title size="lg" level="h2" semantic="warning">
          ⚠️ Важное предупреждение
        </Title>
        <div className={styles.warning}>
          <Text>
            <strong>ВНИМАНИЕ:</strong>
          </Text>
          <Text>
            Данный сервис НЕ ЯВЛЯЕТСЯ медицинским инструментом и не предназначен для постановки
            диагноза или замены профессиональной медицинской консультации.
          </Text>
          <Text>
            Результаты носят исключительно информационный характер и предназначены для самоанализа и
            общего понимания вашего эмоционального состояния.
          </Text>
          <Text>
            При наличии серьезных проблем с психическим здоровьем обратитесь к квалифицированному
            специалисту (психологу, психотерапевту или психиатру).
          </Text>
        </div>
      </section>
    </div>
  );
}
