import type { DiagnosticResult } from "./survey";

export interface StorageData {
  results: DiagnosticResult[];
  lastResultId?: string;
}

export interface StorageService {
  saveResult: (result: DiagnosticResult) => void;
  getAllResults: () => DiagnosticResult[];
  getResult: (id: string) => DiagnosticResult | null;
  deleteResult: (id: string) => void;
  clearAllResults: () => void;
}

export const STORAGE_KEYS = {
  SURVEY_RESULTS: "burnout-survey-results",
  CURRENT_SURVEY: "burnout-current-survey",
} as const;
