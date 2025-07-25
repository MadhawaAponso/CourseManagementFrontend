// src/types/GradeSubmission.ts
export interface GradeSubmissionRequestDTO {
  score: number;
  feedback?: string;
  gradedBy: number;
}
