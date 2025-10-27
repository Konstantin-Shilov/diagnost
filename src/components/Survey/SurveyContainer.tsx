import { useNavigate } from "@tanstack/react-router";
import React, { useEffect } from "react";

import { defaultSurveyConfig } from "@/core/data/surveyConfig";
import { AnalysisService } from "@/core/services/analysisService";
import { useResultsStore, useSurveyStore } from "@/core/store";
import type { Answer } from "@/core/types";

import { ProgressBar } from "./ProgressBar";
import { ScaleQuestion } from "./ScaleQuestion";

export const SurveyContainer: React.FC = () => {
  const navigate = useNavigate();
  const {
    config,
    setConfig,
    startSurvey,
    nextQuestion,
    previousQuestion,
    nextBlock,
    previousBlock,
    saveAnswer,
    completeSurvey,
    getCurrentBlock,
    getCurrentQuestion,
    getProgress,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    // isFirstQuestion,
    currentBlockIndex,
    currentQuestionIndex,
    responses,
    isCompleted,
    setResult,
  } = useSurveyStore();

  const { saveResult, setCurrentResult } = useResultsStore();

  useEffect(() => {
    if (!config) {
      setConfig(defaultSurveyConfig);
      startSurvey();
    }
  }, [config, setConfig, startSurvey]);

  useEffect(() => {
    if (isCompleted && config && responses.length > 0) {
      // Calculate results
      const result = AnalysisService.analyzeResults(responses, config.scoringRules);

      // Save result
      setResult(result);
      setCurrentResult(result);
      saveResult(result);

      // Navigate to results page
      navigate({ to: `/results/${result.id}` });
    }
  }, [isCompleted, config, responses, navigate, setResult, setCurrentResult, saveResult]);

  if (!config) {
    return <div>Загрузка...</div>;
  }

  const currentBlock = getCurrentBlock();
  const currentQuestion = getCurrentQuestion();

  if (!currentBlock || !currentQuestion) {
    return <div>Ошибка загрузки вопроса</div>;
  }

  const getCurrentAnswer = (): number | undefined => {
    const blockResponse = responses.find((r) => r.blockId === currentBlock.id);
    const answer = blockResponse?.answers.find((a) => a.questionId === currentQuestion.id);
    return answer?.value as number | undefined;
  };

  const handleAnswer = (answer: Answer) => {
    saveAnswer(answer);
  };

  const handleNext = () => {
    if (isLastQuestion()) {
      completeSurvey();
    } else if (currentQuestionIndex === currentBlock.questions.length - 1) {
      nextBlock();
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0 && currentBlockIndex > 0) {
      previousBlock();
      // Set to last question of previous block
      // const prevBlock = config.blocks[currentBlockIndex - 1];
      // This will be handled by the store
    } else {
      previousQuestion();
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <ProgressBar
        progress={getProgress()}
        currentBlock={currentBlock.title}
        totalBlocks={config.blocks.length}
        currentBlockIndex={currentBlockIndex}
      />

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 10px 0", color: "#007bff" }}>{currentBlock.title}</h2>
          {currentBlock.description && (
            <p style={{ margin: "0", color: "#666", fontSize: "16px" }}>
              {currentBlock.description}
            </p>
          )}
        </div>

        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#007bff",
                color: "white",
                padding: "5px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Вопрос {currentQuestionIndex + 1} из {currentBlock.questions.length}
            </span>
          </div>

          <ScaleQuestion
            question={currentQuestion}
            value={getCurrentAnswer()}
            onChange={handleAnswer}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious()}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "2px solid #6c757d",
            backgroundColor: "white",
            color: "#6c757d",
            fontSize: "16px",
            cursor: canGoPrevious() ? "pointer" : "not-allowed",
            opacity: canGoPrevious() ? 1 : 0.5,
            transition: "all 0.2s ease",
          }}
        >
          ← Назад
        </button>

        <button
          onClick={handleNext}
          disabled={!canGoNext()}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "2px solid #007bff",
            backgroundColor: canGoNext() ? "#007bff" : "#e9ecef",
            color: canGoNext() ? "white" : "#6c757d",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: canGoNext() ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
        >
          {isLastQuestion() ? "Завершить" : "Далее"} →
        </button>
      </div>

      {/* Debug info - remove in production */}
      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          backgroundColor: "#f1f3f4",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <strong>Debug:</strong> Block {currentBlockIndex + 1}/{config.blocks.length}, Question{" "}
        {currentQuestionIndex + 1}/{currentBlock.questions.length}, Progress: {getProgress()}%
      </div>
    </div>
  );
};
