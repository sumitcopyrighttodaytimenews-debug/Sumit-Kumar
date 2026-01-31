
export type Option = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Question {
  id: number;
  correctOption: Option;
}

export interface ScanResult {
  questionId: number;
  detectedOption: Option | 'MULTIPLE' | 'NONE';
  isCorrect: boolean;
}

export interface OMRData {
  results: ScanResult[];
  totalScore: number;
  totalQuestions: number;
  rawJson?: string;
}

export enum AppState {
  SETUP = 'SETUP',
  SCANNING = 'SCANNING',
  RESULTS = 'RESULTS'
}
