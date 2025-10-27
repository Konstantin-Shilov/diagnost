import { createFileRoute, Link } from "@tanstack/react-router";

import { useResultsStore } from "@/core/store";

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

  const getBurnoutColor = (level: string) => {
    switch (level) {
      case "low":
        return "#28a745";
      case "moderate":
        return "#ffc107";
      case "high":
        return "#fd7e14";
      case "severe":
        return "#dc3545";
      case "critical":
        return "#6f42c1";
      default:
        return "#6c757d";
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
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: "0", color: "#007bff" }}>История прохождений</h1>

        {results.length > 0 && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleClearAll}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Очистить всё
            </button>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#6c757d" }}>История пуста</h3>
          <p style={{ margin: "0 0 25px 0", color: "#6c757d" }}>
            Вы еще не проходили диагностику эмоционального выгорания
          </p>
          <Link
            to="/survey"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Пройти диагностику
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {results
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((result) => (
              <div
                key={result.id}
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  border: "1px solid #dee2e6",
                  borderRadius: "12px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ margin: "0", fontSize: "18px" }}>
                      {formatDate(result.timestamp)}
                    </h3>

                    <span
                      style={{
                        padding: "4px 12px",
                        backgroundColor: getBurnoutColor(result.burnoutLevel.level),
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {getBurnoutLevelText(result.burnoutLevel.level)}
                    </span>

                    <span
                      style={{
                        padding: "4px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Стадия {result.greenbergStage.stage}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <strong>Общий балл:</strong>
                      <br />
                      <span
                        style={{
                          color: getBurnoutColor(result.burnoutLevel.level),
                          fontWeight: "bold",
                        }}
                      >
                        {result.totalScore}/{result.maxTotalScore} ({result.burnoutLevel.percentage}
                        %)
                      </span>
                    </div>

                    <div>
                      <strong>Стадия Гринберга:</strong>
                      <br />
                      {result.greenbergStage.name}
                    </div>
                  </div>

                  <p
                    style={{
                      margin: "0",
                      color: "#666",
                      fontSize: "14px",
                      lineHeight: "1.4",
                    }}
                  >
                    {result.burnoutLevel.description}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Link
                    to={`/results/${result.id}`}
                    style={{
                      display: "inline-block",
                      padding: "8px 16px",
                      backgroundColor: "#007bff",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Подробнее
                  </Link>

                  <button
                    onClick={() => handleDeleteResult(result.id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {results.length > 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
          }}
        >
          <p style={{ margin: "0 0 15px 0", color: "#6c757d" }}>
            Всего прохождений: {results.length}
          </p>
          <Link
            to="/survey"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Пройти диагностику снова
          </Link>
        </div>
      )}
    </div>
  );
}
