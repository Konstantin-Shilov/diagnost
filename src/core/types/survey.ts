export type QuestionType = "scale" | "multiple-choice" | "boolean";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: { min: string; max: string };
}

export interface SurveyBlock {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value: number | string | boolean;
}

export interface SurveyResponse {
  blockId: string;
  answers: Answer[];
}

export interface BurnoutLevel {
  level: "low" | "moderate" | "high" | "severe" | "critical";
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}

export interface GreenbergStage {
  stage: 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  bpsp: {
    body: string;
    emotions: string;
    thoughts: string;
    behavior: string;
  };
  whyDangerous: string;
  fact: string;
}

export interface DiagnosticResult {
  id: string;
  timestamp: Date;
  responses: SurveyResponse[];
  burnoutLevel: BurnoutLevel;
  greenbergStage: GreenbergStage;
  totalScore: number;
  maxTotalScore: number;
  recommendations: string[];
}

export interface SurveyConfig {
  blocks: SurveyBlock[];
  scoringRules: ScoringRules;
}

export interface ScoringRules {
  burnoutLevels: {
    low: { min: number; max: number };
    moderate: { min: number; max: number };
    high: { min: number; max: number };
    severe: { min: number; max: number };
    critical: { min: number; max: number };
  };
  greenbergStages: {
    1: { min: number; max: number };
    2: { min: number; max: number };
    3: { min: number; max: number };
    4: { min: number; max: number };
    5: { min: number; max: number };
  };
}

export interface SurveyState {
  currentBlockIndex: number;
  currentQuestionIndex: number;
  responses: SurveyResponse[];
  isCompleted: boolean;
  startTime: Date | null;
  endTime: Date | null;
}
