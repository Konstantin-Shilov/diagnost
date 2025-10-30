import React from "react";

import { Text, Title } from "@/components/Typography";
import type { Answer, Question } from "@/core/types";

import styles from "./ScaleQuestion.module.css";

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
    <div className={styles.container}>
      <Title size="md" level="h3" variant="primary" className={styles.questionText}>
        {question.text}
      </Title>

      <div className={styles.scaleContainer}>
        <div className={styles.scaleRow}>
          {scaleLabels && (
            <Text size="sm" variant="tertiary" as="span" className={styles.scaleLabel}>
              {scaleLabels.min}
            </Text>
          )}

          <div className={styles.scaleOptions}>
            {Array.from({ length: scaleMax - scaleMin + 1 }, (_, index) => {
              const scaleValue = scaleMin + index;
              return (
                <label key={scaleValue} className={styles.scaleOption}>
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue}
                    onChange={() => handleChange(scaleValue)}
                    className={styles.scaleInput}
                  />
                  <Text size="sm" as="span" className={styles.scaleValue}>
                    {scaleValue}
                  </Text>
                </label>
              );
            })}
          </div>

          {scaleLabels && (
            <Text
              size="sm"
              variant="tertiary"
              as="span"
              className={`${styles.scaleLabel} ${styles.scaleLabelEnd}`}
            >
              {scaleLabels.max}
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};
