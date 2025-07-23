export interface AssignmentSubmissionRequestDTO {
  assignmentId:   number;
  submissionText: string;
}
export interface AssignmentSubmissionResponseDTO {
  id:              number;
  studentName:     string;
  submissionText:  string;
  submittedAt:     string;           // ISO timestamp
  isLate:          boolean;
  score?:          number;
  feedback?:       string;
  gradedAt?:       string;
  gradedBy?:       string;
  assignmentTitle: string;
  status:          string;
}
