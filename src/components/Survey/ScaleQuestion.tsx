import React from "react";

import type { Answer, Question } from "@/core/types";

interface ScaleQuestionProps {
  question: Question;
  value?: number;
  onChange: (answer: Answer) => void;
}

export const ScaleQuestion: React.FC<ScaleQuestionProps> = ({ question, value, onChange }) => {
  const { scaleMin = 1, scaleMax = 5, scaleLabels } = question;

  const handleChange = (newValue: number) => {
    onChange({
      questionId: question.id,
      value: newValue,
    });
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3 style={{ marginBottom: "15px", fontSize: "18px", lineHeight: "1.4" }}>{question.text}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {scaleLabels && (
            <span style={{ fontSize: "14px", color: "#666", minWidth: "120px" }}>
              {scaleLabels.min}
            </span>
          )}

          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {Array.from({ length: scaleMax - scaleMin + 1 }, (_, index) => {
              const scaleValue = scaleMin + index;
              return (
                <label
                  key={scaleValue}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "5px",
                  }}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue}
                    onChange={() => handleChange(scaleValue)}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>{scaleValue}</span>
                </label>
              );
            })}
          </div>

          {scaleLabels && (
            <span
              style={{ fontSize: "14px", color: "#666", minWidth: "120px", textAlign: "right" }}
            >
              {scaleLabels.max}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
