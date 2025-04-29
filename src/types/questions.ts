
export interface Question {
  text: string;
  options: Option[];
  raw: string;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface MatchResult {
  question1: Question;
  question2: Question | null;
  matchCount: number;
  matchStatus: MatchStatus;
  matchDetails?: string;
  reviewQuestions?: Question[]; // Questions that need manual review
}

export enum MatchStatus {
  NoMatch = "NO_MATCH",
  SingleMatch = "SINGLE_MATCH",
  MultipleMatches = "MULTIPLE_MATCHES",
  NeedsReview = "NEEDS_REVIEW"
}

export interface MatchStatistics {
  totalQuestions1: number;
  totalQuestions2: number;
  singleMatchCount: number;
  multipleMatchCount: number;
  noMatchCount: number;
  needsReviewCount: number;
  matchPercentage: number;
}
