import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  Answer,
  DiagnosticResult,
  SurveyConfig,
  // SurveyResponse,
  SurveyState,
} from "@/core/types";

interface SurveyStore extends SurveyState {
  config: SurveyConfig | null;
  result: DiagnosticResult | null;

  // Actions
  setConfig: (config: SurveyConfig) => void;
  startSurvey: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  nextBlock: () => void;
  previousBlock: () => void;
  saveAnswer: (answer: Answer) => void;
  completeSurvey: () => void;
  resetSurvey: () => void;
  setResult: (result: DiagnosticResult) => void;

  // Getters
  getCurrentBlock: () => any | null;
  getCurrentQuestion: () => any | null;
  getProgress: () => number;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  isLastQuestion: () => boolean;
  isFirstQuestion: () => boolean;
}

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set, get) => ({
      currentBlockIndex: 0,
      currentQuestionIndex: 0,
      responses: [],
      isCompleted: false,
      startTime: null,
      endTime: null,
      config: null,
      result: null,

      setConfig: (config) => set({ config }),

      startSurvey: () =>
        set({
          startTime: new Date(),
          currentBlockIndex: 0,
          currentQuestionIndex: 0,
          responses: [],
          isCompleted: false,
          endTime: null,
          result: null,
        }),

      nextQuestion: () => {
        const state = get();
        if (!state.config) return;

        const currentBlock = state.config.blocks[state.currentBlockIndex];
        if (state.currentQuestionIndex < currentBlock.questions.length - 1) {
          set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
        }
      },

      previousQuestion: () => {
        const state = get();
        if (state.currentQuestionIndex > 0) {
          set({ currentQuestionIndex: state.currentQuestionIndex - 1 });
        }
      },

      nextBlock: () => {
        const state = get();
        if (!state.config) return;

        if (state.currentBlockIndex < state.config.blocks.length - 1) {
          set({
            currentBlockIndex: state.currentBlockIndex + 1,
            currentQuestionIndex: 0,
          });
        }
      },

      previousBlock: () => {
        const state = get();
        if (state.currentBlockIndex > 0) {
          set({
            currentBlockIndex: state.currentBlockIndex - 1,
            currentQuestionIndex: 0,
          });
        }
      },

      saveAnswer: (answer) => {
        const state = get();
        if (!state.config) return;

        const currentBlock = state.config.blocks[state.currentBlockIndex];
        let blockResponse = state.responses.find((r) => r.blockId === currentBlock.id);

        if (!blockResponse) {
          blockResponse = {
            blockId: currentBlock.id,
            answers: [],
          };
          set({ responses: [...state.responses, blockResponse] });
        } else {
          const existingAnswerIndex = blockResponse.answers.findIndex(
            (a) => a.questionId === answer.questionId,
          );

          if (existingAnswerIndex >= 0) {
            blockResponse.answers[existingAnswerIndex] = answer;
          } else {
            blockResponse.answers.push(answer);
          }

          set({
            responses: state.responses.map((r) =>
              r.blockId === currentBlock.id && blockResponse ? blockResponse : r,
            ),
          });
        }
      },

      completeSurvey: () =>
        set({
          isCompleted: true,
          endTime: new Date(),
        }),

      resetSurvey: () =>
        set({
          currentBlockIndex: 0,
          currentQuestionIndex: 0,
          responses: [],
          isCompleted: false,
          startTime: null,
          endTime: null,
          result: null,
        }),

      setResult: (result) => set({ result }),

      getCurrentBlock: () => {
        const state = get();
        if (!state.config) return null;
        return state.config.blocks[state.currentBlockIndex] || null;
      },

      getCurrentQuestion: () => {
        const state = get();
        const currentBlock = state.getCurrentBlock();
        if (!currentBlock) return null;
        return currentBlock.questions[state.currentQuestionIndex] || null;
      },

      getProgress: () => {
        const state = get();
        if (!state.config) return 0;

        const totalQuestions = state.config.blocks.reduce(
          (total, block) => total + block.questions.length,
          0,
        );

        let answeredQuestions = 0;
        for (let i = 0; i < state.currentBlockIndex; i++) {
          answeredQuestions += state.config.blocks[i].questions.length;
        }
        answeredQuestions += state.currentQuestionIndex;

        return Math.round((answeredQuestions / totalQuestions) * 100);
      },

      canGoNext: () => {
        const state = get();
        if (!state.config) return false;

        const currentBlock = state.config.blocks[state.currentBlockIndex];
        const currentQuestion = currentBlock.questions[state.currentQuestionIndex];

        // Check if current question is answered
        const blockResponse = state.responses.find((r) => r.blockId === currentBlock.id);
        const answer = blockResponse?.answers.find((a) => a.questionId === currentQuestion.id);

        return answer !== undefined;
      },

      canGoPrevious: () => {
        const state = get();
        return state.currentBlockIndex > 0 || state.currentQuestionIndex > 0;
      },

      isLastQuestion: () => {
        const state = get();
        if (!state.config) return false;

        const isLastBlock = state.currentBlockIndex === state.config.blocks.length - 1;
        const currentBlock = state.config.blocks[state.currentBlockIndex];
        const isLastQuestionInBlock =
          state.currentQuestionIndex === currentBlock.questions.length - 1;

        return isLastBlock && isLastQuestionInBlock;
      },

      isFirstQuestion: () => {
        const state = get();
        return state.currentBlockIndex === 0 && state.currentQuestionIndex === 0;
      },
    }),
    {
      name: "burnout-survey-state",
      partialize: (state) => ({
        responses: state.responses,
        currentBlockIndex: state.currentBlockIndex,
        currentQuestionIndex: state.currentQuestionIndex,
        startTime: state.startTime,
        isCompleted: state.isCompleted,
      }),
    },
  ),
);
