import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { DiagnosticResult } from "@/core/types";

interface ResultsStore {
  results: DiagnosticResult[];
  currentResult: DiagnosticResult | null;

  // Actions
  saveResult: (result: DiagnosticResult) => void;
  loadResults: () => void;
  getResult: (id: string) => DiagnosticResult | null;
  deleteResult: (id: string) => void;
  clearAllResults: () => void;
  setCurrentResult: (result: DiagnosticResult | null) => void;

  // Getters
  getLatestResult: () => DiagnosticResult | null;
  getResultsCount: () => number;
  getResultsByDateRange: (startDate: Date, endDate: Date) => DiagnosticResult[];
}

export const useResultsStore = create<ResultsStore>()(
  persist(
    (set, get) => ({
      results: [],
      currentResult: null,

      saveResult: (result) => {
        const state = get();
        const existingIndex = state.results.findIndex((r) => r.id === result.id);

        if (existingIndex >= 0) {
          set({
            results: state.results.map((r, index) => (index === existingIndex ? result : r)),
          });
        } else {
          set({
            results: [...state.results, result],
          });
        }
      },

      loadResults: () => {
        // Results are automatically loaded from localStorage via persist middleware
      },

      getResult: (id) => {
        const state = get();
        return state.results.find((r) => r.id === id) || null;
      },

      deleteResult: (id) => {
        const state = get();
        set({
          results: state.results.filter((r) => r.id !== id),
          currentResult: state.currentResult?.id === id ? null : state.currentResult,
        });
      },

      clearAllResults: () => {
        set({
          results: [],
          currentResult: null,
        });
      },

      setCurrentResult: (result) => {
        set({ currentResult: result });
      },

      getLatestResult: () => {
        const state = get();
        if (state.results.length === 0) return null;

        return state.results.reduce((latest, current) =>
          new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest,
        );
      },

      getResultsCount: () => {
        const state = get();
        return state.results.length;
      },

      getResultsByDateRange: (startDate, endDate) => {
        const state = get();
        return state.results.filter((result) => {
          const resultDate = new Date(result.timestamp);
          return resultDate >= startDate && resultDate <= endDate;
        });
      },
    }),
    {
      name: "burnout-survey-results",
      version: 1,
    },
  ),
);
