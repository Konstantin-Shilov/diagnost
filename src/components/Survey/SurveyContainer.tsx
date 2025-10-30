import { useNavigate } from "@tanstack/react-router";
import React, { useEffect } from "react";

import { Text, Title } from "@/components/Typography";
import { defaultSurveyConfig } from "@/core/data/surveyConfig";
import { AnalysisService } from "@/core/services/analysisService";
import { useResultsStore, useSurveyStore } from "@/core/store";
import type { Answer } from "@/core/types";

import { ProgressBar } from "./ProgressBar";
import { ScaleQuestion } from "./ScaleQuestion";
import styles from "./SurveyContainer.module.css";

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
    return <Text>Загрузка...</Text>;
  }

  const currentBlock = getCurrentBlock();
  const currentQuestion = getCurrentQuestion();

  if (!currentBlock || !currentQuestion) {
    return <Text semantic="negative">Ошибка загрузки вопроса</Text>;
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
    <div className={styles.container}>
      <ProgressBar
        progress={getProgress()}
        currentBlock={currentBlock.title}
        totalBlocks={config.blocks.length}
        currentBlockIndex={currentBlockIndex}
      />

      <div className={styles.blockContainer}>
        <div className={styles.blockHeader}>
          <Title size="lg" level="h2" semantic="accent" className={styles.blockTitle}>
            {currentBlock.title}
          </Title>
          {currentBlock.description && (
            <Text variant="secondary" className={styles.blockDescription}>
              {currentBlock.description}
            </Text>
          )}
        </div>

        <div className={styles.questionCard}>
          <div className={styles.questionHeader}>
            <Text size="sm" as="span" className={styles.questionBadge}>
              Вопрос {currentQuestionIndex + 1} из {currentBlock.questions.length}
            </Text>
          </div>

          <ScaleQuestion
            question={currentQuestion}
            value={getCurrentAnswer()}
            onChange={handleAnswer}
          />
        </div>
      </div>

      <div className={styles.navigation}>
        <button onClick={handlePrevious} disabled={!canGoPrevious()} className={styles.backButton}>
          ← Назад
        </button>

        <button
          onClick={handleNext}
          disabled={!canGoNext()}
          className={`${styles.nextButton} ${canGoNext() ? styles.enabled : ""}`}
        >
          {isLastQuestion() ? "Завершить" : "Далее"} →
        </button>
      </div>

      {/* Debug info - remove in production */}
      <div className={styles.debug}>
        <strong>Debug:</strong> Block {currentBlockIndex + 1}/{config.blocks.length}, Question{" "}
        {currentQuestionIndex + 1}/{currentBlock.questions.length}, Progress: {getProgress()}%
      </div>
    </div>
  );
};
