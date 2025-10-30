import { Link } from "@tanstack/react-router";
import React from "react";

import type { DiagnosticResult } from "@/core/types";
import { Text, Title } from "@/components/Typography";
import styles from "./ResultsContainer.module.css";

interface ResultsContainerProps {
  result: DiagnosticResult;
  onExportPDF?: () => void;
  onSaveResult?: () => void;
}

export const ResultsContainer: React.FC<ResultsContainerProps> = ({
  result,
  onExportPDF,
  onSaveResult,
}) => {
  const { burnoutLevel, greenbergStage, totalScore, maxTotalScore, recommendations } = result;

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
      {/* Header */}
      <div className={styles.header}>
        <Title size="xl" level="h1" semantic="accent" className={styles.title}>
          Результаты диагностики
        </Title>
        <Text variant="tertiary" className={styles.date}>
          Дата прохождения: {formatDate(result.timestamp)}
        </Text>
      </div>

      {/* Overall Score */}
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

        <div
          className={`${styles.burnoutCard} ${getBurnoutColorClass(burnoutLevel.level)}`}
        >
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

      {/* Greenberg Stage */}
      <div className={styles.greenbergSection}>
        <Title size="lg" level="h3" semantic="accent" className={styles.greenbergTitle}>
          Стадия по модели Гринберга
        </Title>

        <div className={styles.stageHeader}>
          <div className={styles.stageBadge}>
            {greenbergStage.stage}
          </div>

          <div className={styles.stageInfo}>
            <Title size="md" level="h4" variant="primary" className={styles.stageName}>
              {greenbergStage.name}
            </Title>
            <Text variant="secondary" className={styles.stageDescription}>
              {greenbergStage.description}
            </Text>
          </div>
        </div>

        <div>
          <Title size="sm" level="h5" variant="secondary" className={styles.characteristicsTitle}>
            Характерные черты:
          </Title>
          <ul className={styles.characteristicsList}>
            {greenbergStage.characteristics.map((characteristic, index) => (
              <li key={index} className={styles.characteristicItem}>
                <Text as="span">{characteristic}</Text>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
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

      {/* Medical Disclaimer */}
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

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {onSaveResult && (
          <button
            onClick={onSaveResult}
            className={`${styles.button} ${styles.saveButton}`}
          >
            💾 Сохранить результат
          </button>
        )}

        {onExportPDF && (
          <button
            onClick={onExportPDF}
            className={`${styles.button} ${styles.pdfButton}`}
          >
            📄 Скачать PDF
          </button>
        )}

        <Link
          to="/survey"
          className={`${styles.button} ${styles.retryButton}`}
        >
          🔄 Пройти снова
        </Link>

        <Link
          to="/history"
          className={`${styles.button} ${styles.historyButton}`}
        >
          📊 История результатов
        </Link>
      </div>
    </div>
  );
};
