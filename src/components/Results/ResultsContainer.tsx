import React from "react";

import { Button } from "@/components/Button";
import { Text, Title } from "@/components/Typography";
import { defaultSurveyConfig } from "@/core/data/surveyConfig";
import type { DiagnosticResult } from "@/core/types";

import styles from "./ResultsContainer.module.css";

interface ResultsContainerProps {
  result: DiagnosticResult;
  onExportPDF?: () => void;
}

export const ResultsContainer: React.FC<ResultsContainerProps> = ({ result, onExportPDF }) => {
  const { burnoutLevel, greenbergStage, totalScore, maxTotalScore, recommendations, responses } =
    result;

  const getBurnoutColorClass = (level: string) => {
    switch (level) {
      case "low":
        return styles.lowLevel;
      case "moderate":
        return styles.moderateLevel;
      case "high":
        return styles.highLevel;
      case "severe":
        return styles.severeLevel;
      case "critical":
        return styles.criticalLevel;
      default:
        return styles.defaultLevel;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title size="xl" level="h1" semantic="accent" className={styles.title}>
          Результаты диагностики
        </Title>
        <Text variant="tertiary" className={styles.date}>
          Дата прохождения: {formatDate(result.timestamp)}
        </Text>
      </div>

      <div className={styles.scoreGrid}>
        <div className={styles.scoreCard}>
          <Title size="md" level="h3" variant="secondary" className={styles.cardTitle}>
            Общий балл
          </Title>
          <div className={`${styles.scoreNumber} ${getBurnoutColorClass(burnoutLevel.level)}`}>
            {totalScore}
          </div>
          <Text size="sm" variant="tertiary" className={styles.scoreDetails}>
            из {maxTotalScore} ({burnoutLevel.percentage}%)
          </Text>
        </div>

        <div className={`${styles.burnoutCard} ${getBurnoutColorClass(burnoutLevel.level)}`}>
          <Title size="md" level="h3" variant="secondary" className={styles.cardTitle}>
            Уровень выгорания
          </Title>
          <div className={`${styles.burnoutLevel} ${getBurnoutColorClass(burnoutLevel.level)}`}>
            {burnoutLevel.level === "low" && "Низкий"}
            {burnoutLevel.level === "moderate" && "Умеренный"}
            {burnoutLevel.level === "high" && "Высокий"}
            {burnoutLevel.level === "severe" && "Серьезный"}
            {burnoutLevel.level === "critical" && "Критический"}
          </div>
          <Text size="sm" variant="tertiary" className={styles.burnoutDescription}>
            {burnoutLevel.description}
          </Text>
        </div>
      </div>

      <div className={styles.greenbergSection}>
        <Title size="lg" level="h3" semantic="accent" className={styles.greenbergTitle}>
          Стадия по модели Гринберга
        </Title>

        <div className={styles.stageHeader}>
          <div className={styles.stageBadge}>{greenbergStage.stage}</div>

          <div className={styles.stageInfo}>
            <Title size="md" level="h4" variant="primary" className={styles.stageName}>
              {greenbergStage.name}
            </Title>
            <Text variant="secondary" className={styles.stageDescription}>
              {greenbergStage.description}
            </Text>
          </div>
        </div>

        {greenbergStage.bpsp && (
          <div>
            <Title size="sm" level="h5" variant="secondary" className={styles.characteristicsTitle}>
              Что происходит на уровне БПСП:
            </Title>
            <ul className={styles.characteristicsList}>
              <li className={styles.characteristicItem}>
                <Text as="span">
                  <strong>Тело:</strong> {greenbergStage.bpsp.body}
                </Text>
              </li>
              <li className={styles.characteristicItem}>
                <Text as="span">
                  <strong>Эмоции:</strong> {greenbergStage.bpsp.emotions}
                </Text>
              </li>
              <li className={styles.characteristicItem}>
                <Text as="span">
                  <strong>Мысли:</strong> {greenbergStage.bpsp.thoughts}
                </Text>
              </li>
              <li className={styles.characteristicItem}>
                <Text as="span">
                  <strong>Поведение:</strong> {greenbergStage.bpsp.behavior}
                </Text>
              </li>
            </ul>
          </div>
        )}

        <div className={styles.whyDangerousSection}>
          <Title size="sm" level="h5" variant="secondary" className={styles.whyDangerousTitle}>
            Почему это опасно:
          </Title>
          <Text variant="secondary" className={styles.whyDangerousText}>
            {greenbergStage.whyDangerous}
          </Text>
        </div>

        <div className={styles.factSection}>
          <Title size="sm" level="h5" variant="secondary" className={styles.factTitle}>
            Факт:
          </Title>
          <Text variant="secondary" className={styles.factText}>
            {greenbergStage.fact}
          </Text>
        </div>
      </div>

      <div className={styles.recommendationsSection}>
        <Title size="lg" level="h3" semantic="positive" className={styles.recommendationsTitle}>
          Рекомендации
        </Title>

        <div className={styles.recommendationsGrid}>
          {recommendations.map((recommendation, index) => (
            <div key={index} className={styles.recommendationCard}>
              <Text>{recommendation}</Text>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.importanceSection}>
        <Title size="lg" level="h3" variant="primary" className={styles.importanceTitle}>
          Почему важно не откладывать
        </Title>

        <Text variant="secondary" className={styles.importanceIntro}>
          По данным ВОЗ, выгорание испытывают 76% людей в мире.
        </Text>

        <ul className={styles.importanceList}>
          <li>
            <Text>В России — до 87%, особенно среди специалистов с высокой ответственностью.</Text>
          </li>
          <li>
            <Text>
              Исследования показывают: отпуск помогает лишь временно. Через 2–6 недель большинство
              возвращается в то же состояние.
            </Text>
          </li>
          <li>
            <Text>
              Причина — автоматизмы. До 95% времени человек действует из автоматических реакций,
              убеждений и прошлых стратегий, которые продолжают вести к выгоранию, даже если тело
              отдыхает.
            </Text>
          </li>
        </ul>

        <Text variant="secondary" className={styles.importanceConclusion}>
          Если не менять глубинные причины, выгорание переходит на следующую стадию — с ухудшением
          психоэмоционального и физического здоровья.
        </Text>
      </div>

      <div className={styles.detailedAnswersSection}>
        <Title size="lg" level="h3" semantic="accent" className={styles.detailedAnswersTitle}>
          Детальные ответы
        </Title>
        <Text variant="secondary" className={styles.detailedAnswersSubtitle}>
          Ваши ответы на вопросы диагностики. Эта информация может быть полезна специалисту для
          более глубокого анализа вашего состояния.
        </Text>

        {responses.map((response) => {
          const block = defaultSurveyConfig.blocks.find((b) => b.id === response.blockId);
          if (!block) return null;

          return (
            <div key={response.blockId} className={styles.answerBlock}>
              <Title size="md" level="h4" variant="primary" className={styles.blockTitle}>
                {block.title}
              </Title>

              <div className={styles.answersList}>
                {response.answers.map((answer) => {
                  const question = block.questions.find((q) => q.id === answer.questionId);
                  if (!question) return null;

                  const getAnswerLabel = () => {
                    if (typeof answer.value === "number") {
                      if (question.scaleLabels) {
                        // Для вопросов с текстовыми метками (например, "Никогда" / "Постоянно")
                        if (question.scaleMin === 0 && question.scaleMax === 3) {
                          const labels = ["Никогда", "Иногда", "Часто", "Постоянно"];
                          return `${answer.value} — ${labels[answer.value]}`;
                        }
                        // Для числовых шкал (например, 1-10)
                        return `${answer.value}`;
                      }
                      return answer.value.toString();
                    }
                    return String(answer.value);
                  };

                  return (
                    <div key={answer.questionId} className={styles.answerItem}>
                      <Text variant="secondary" className={styles.questionText}>
                        {question.text}
                      </Text>
                      <div className={styles.answerValue}>
                        <Text as="span" className={styles.answerValueText}>
                          {getAnswerLabel()}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.disclaimer}>
        <Title size="md" level="h4" semantic="warning" className={styles.disclaimerTitle}>
          ⚠️ Важное предупреждение
        </Title>
        <Text size="sm" className={styles.disclaimerText}>
          Данный тест НЕ ЯВЛЯЕТСЯ медицинским инструментом и не предназначен для постановки
          диагноза. Результаты носят исключительно информационный характер. При серьезных проблемах
          с психическим здоровьем обратитесь к квалифицированному специалисту.
        </Text>
      </div>

      <div className={styles.actionButtons}>
        {onExportPDF && (
          <Button onClick={onExportPDF} variant="danger">
            📄 Скачать PDF
          </Button>
        )}

        <Button as="link" to="/survey" variant="success">
          🔄 Пройти снова
        </Button>

        <Button as="link" to="/history" variant="secondary">
          📊 История результатов
        </Button>
      </div>
    </div>
  );
};
