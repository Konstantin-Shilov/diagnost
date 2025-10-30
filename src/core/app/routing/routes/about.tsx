import { createFileRoute } from "@tanstack/react-router";

import { Text, Title } from "@/components/Typography";

import styles from "./about.module.css";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <Title size="xl" level="h1" semantic="accent">
        О диагностике эмоционального выгорания
      </Title>

      <section>
        <Title size="lg" level="h2" variant="primary">
          Что такое эмоциональное выгорание?
        </Title>
        <Text size="lg" variant="secondary">
          Эмоциональное выгорание — это состояние физического, эмоционального и ментального
          истощения, которое возникает в результате длительного воздействия стрессовых ситуаций.
        </Text>
      </section>

      <section>
        <Title size="lg" level="h2" variant="primary">
          Модель Гринберга
        </Title>
        <Text size="lg" variant="secondary">
          Данная диагностика основана на пятистадийной модели эмоционального выгорания по Гринбергу:
        </Text>
        <ol>
          <li>
            <Text as="span">
              <strong>Стадия 1:</strong> «Медовый месяц» - высокая мотивация
            </Text>
          </li>
          <li>
            <Text as="span">
              <strong>Стадия 2:</strong> Застой - снижение энтузиазма
            </Text>
          </li>
          <li>
            <Text as="span">
              <strong>Стадия 3:</strong> Хроническое недовольство - раздражительность
            </Text>
          </li>
          <li>
            <Text as="span">
              <strong>Стадия 4:</strong> Выгорание - апатия и цинизм
            </Text>
          </li>
          <li>
            <Text as="span">
              <strong>Стадия 5:</strong> Привычное выгорание - полное истощение
            </Text>
          </li>
        </ol>
      </section>

      <section>
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
            специалисту.
          </Text>
        </div>
      </section>
    </div>
  );
}
