import { createFileRoute, Link } from "@tanstack/react-router";

import { useResultsStore } from "@/core/store";
import { Text, Title } from "@/components/Typography";
import styles from "./history.module.css";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { results, deleteResult, clearAllResults } = useResultsStore();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getBurnoutLevelText = (level: string) => {
    switch (level) {
      case "low":
        return "Низкий";
      case "moderate":
        return "Умеренный";
      case "high":
        return "Высокий";
      case "severe":
        return "Серьезный";
      case "critical":
        return "Критический";
      default:
        return level;
    }
  };

  const getBurnoutLevelClass = (level: string) => {
    switch (level) {
      case "low":
        return styles.low;
      case "moderate":
        return styles.moderate;
      case "high":
        return styles.high;
      case "severe":
        return styles.severe;
      case "critical":
        return styles.critical;
      default:
        return styles.default;
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm("Вы уверены, что хотите удалить все результаты? Это действие нельзя отменить.")
    ) {
      clearAllResults();
    }
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот результат?")) {
      deleteResult(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title size="xl" level="h1" semantic="accent" className={styles.title}>
          История прохождений
        </Title>

        {results.length > 0 && (
          <div className={styles.headerActions}>
            <button
              onClick={handleClearAll}
              className={styles.clearButton}
            >
              Очистить всё
            </button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className={styles.emptyState}>
          <Title size="lg" level="h3" variant="primary" className={styles.emptyTitle}>
            История пуста
          </Title>
          <Text variant="secondary" className={styles.emptyText}>
            Вы еще не проходили диагностику эмоционального выгорания
          </Text>
          <Link
            to="/survey"
            className={styles.startButton}
          >
            Пройти диагностику
          </Link>
        </div>
      ) : (
        <div className={styles.resultsGrid}>
          {results
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((result) => (
              <div
                key={result.id}
                className={styles.resultCard}
              >
                <div>
                  <div className={styles.resultHeader}>
                    <Title size="md" level="h3" variant="primary" className={styles.resultDate}>
                      {formatDate(result.timestamp)}
                    </Title>

                    <Text
                      as="span"
                      className={`${styles.levelBadge} ${getBurnoutLevelClass(result.burnoutLevel.level)}`}
                    >
                      {getBurnoutLevelText(result.burnoutLevel.level)}
                    </Text>

                    <Text as="span" className={styles.stageBadge}>
                      Стадия {result.greenbergStage.stage}
                    </Text>
                  </div>

                  <div className={styles.resultStats}>
                    <div>
                      <Text as="strong">Общий балл:</Text>
                      <br />
                      <Text
                        as="span"
                        className={`${styles.scoreText} ${getBurnoutLevelClass(result.burnoutLevel.level)}`}
                      >
                        {result.totalScore}/{result.maxTotalScore} ({result.burnoutLevel.percentage}
                        %)
                      </Text>
                    </div>

                    <div>
                      <Text as="strong">Стадия Гринберга:</Text>
                      <br />
                      <Text as="span">{result.greenbergStage.name}</Text>
                    </div>
                  </div>

                  <Text variant="secondary" className={styles.resultDescription}>
                    {result.burnoutLevel.description}
                  </Text>
                </div>

                <div className={styles.resultActions}>
                  <Link
                    params={{
                      id: result.id,
                    }}
                    to="/results/$id"
                    className={styles.detailsButton}
                  >
                    Подробнее
                  </Link>

                  <button
                    onClick={() => handleDeleteResult(result.id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.summary}>
          <Text variant="tertiary" className={styles.summaryText}>
            Всего прохождений: {results.length}
          </Text>
          <Link
            to="/survey"
            className={styles.retryButton}
          >
            Пройти диагностику снова
          </Link>
        </div>
      )}
    </div>
  );
}
