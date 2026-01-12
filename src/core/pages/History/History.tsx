import { Button } from "@/components/Button";
import { Text, Title } from "@/components/Typography";
import { useResultsStore } from "@/core/store";

import styles from "./History.module.css";

export const HistoryPage = () => {
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
            <Button onClick={handleClearAll} variant="danger" size="sm">
              Очистить всё
            </Button>
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
          <Button as="link" to="/survey" variant="primary">
            Пройти диагностику
          </Button>
        </div>
      ) : (
        <div className={styles.resultsGrid}>
          {results
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((result) => (
              <div key={result.id} className={styles.resultCard}>
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
                      <Text>Общий балл:</Text>
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
                      <Text>Стадия Гринберга:</Text>
                      <br />
                      <Text as="span">{result.greenbergStage.name}</Text>
                    </div>
                  </div>

                  <Text variant="secondary" className={styles.resultDescription}>
                    {result.burnoutLevel.description}
                  </Text>
                </div>

                <div className={styles.resultActions}>
                  <Button
                    as="link"
                    to="/results/$id"
                    params={{ id: result.id }}
                    variant="primary"
                    size="sm"
                  >
                    Подробнее
                  </Button>

                  <Button
                    onClick={() => handleDeleteResult(result.id)}
                    variant="secondary"
                    size="sm"
                  >
                    Удалить
                  </Button>
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
          <Button as="link" to="/survey" variant="success">
            Пройти диагностику снова
          </Button>
        </div>
      )}
    </div>
  );
};
