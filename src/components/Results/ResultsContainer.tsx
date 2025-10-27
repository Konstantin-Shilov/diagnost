import { Link } from "@tanstack/react-router";
import React from "react";

import type { DiagnosticResult } from "@/core/types";

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
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
        }}
      >
        <h1 style={{ margin: "0 0 10px 0", color: "#007bff" }}>Результаты диагностики</h1>
        <p style={{ margin: "0", color: "#666", fontSize: "16px" }}>
          Дата прохождения: {formatDate(result.timestamp)}
        </p>
      </div>

      {/* Overall Score */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            padding: "25px",
            backgroundColor: "white",
            border: "2px solid #dee2e6",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#495057" }}>Общий балл</h3>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: getBurnoutColor(burnoutLevel.level),
              margin: "10px 0",
            }}
          >
            {totalScore}
          </div>
          <p style={{ margin: "0", color: "#666" }}>
            из {maxTotalScore} ({burnoutLevel.percentage}%)
          </p>
        </div>

        <div
          style={{
            padding: "25px",
            backgroundColor: "white",
            border: `2px solid ${getBurnoutColor(burnoutLevel.level)}`,
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#495057" }}>Уровень выгорания</h3>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: getBurnoutColor(burnoutLevel.level),
              margin: "10px 0",
              textTransform: "uppercase",
            }}
          >
            {burnoutLevel.level === "low" && "Низкий"}
            {burnoutLevel.level === "moderate" && "Умеренный"}
            {burnoutLevel.level === "high" && "Высокий"}
            {burnoutLevel.level === "severe" && "Серьезный"}
            {burnoutLevel.level === "critical" && "Критический"}
          </div>
          <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>{burnoutLevel.description}</p>
        </div>
      </div>

      {/* Greenberg Stage */}
      <div
        style={{
          padding: "25px",
          backgroundColor: "white",
          border: "2px solid #007bff",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", color: "#007bff" }}>Стадия по модели Гринберга</h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#007bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            {greenbergStage.stage}
          </div>

          <div>
            <h4 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>{greenbergStage.name}</h4>
            <p style={{ margin: "0", color: "#666" }}>{greenbergStage.description}</p>
          </div>
        </div>

        <div>
          <h5 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Характерные черты:</h5>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            {greenbergStage.characteristics.map((characteristic, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {characteristic}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div
        style={{
          padding: "25px",
          backgroundColor: "#e8f5e8",
          border: "2px solid #28a745",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", color: "#28a745" }}>Рекомендации</h3>

        <div
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #d4edda",
              }}
            >
              {recommendation}
            </div>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff3cd",
          border: "2px solid #ffeaa7",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#856404" }}>⚠️ Важное предупреждение</h4>
        <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5" }}>
          Данный тест НЕ ЯВЛЯЕТСЯ медицинским инструментом и не предназначен для постановки
          диагноза. Результаты носят исключительно информационный характер. При серьезных проблемах
          с психическим здоровьем обратитесь к квалифицированному специалисту.
        </p>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {onSaveResult && (
          <button
            onClick={onSaveResult}
            style={{
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💾 Сохранить результат
          </button>
        )}

        {onExportPDF && (
          <button
            onClick={onExportPDF}
            style={{
              padding: "12px 24px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📄 Скачать PDF
          </button>
        )}

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
          🔄 Пройти снова
        </Link>

        <Link
          to="/history"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          📊 История результатов
        </Link>
      </div>
    </div>
  );
};
