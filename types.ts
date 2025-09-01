export enum Area {
  Matematica = 'Matemática',
  Lengua = 'Lengua',
  CsNaturales = 'Cs. Naturales',
  CsSociales = 'Cs. Sociales',
}

export interface Question {
  id: number;
  area: Area;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SessionResult {
  question: Question;
  chosenIndex: number | null;
  isCorrect: boolean;
  timeAtAnswerMs: number;
}

export interface QuizResult {
  sessionResults: SessionResult[];
  totalTimeSeconds: number;
}

export interface LeaderboardEntry {
  nick: string;
  score: number;
  timeSeconds: number;
  dateISO: string;
}
