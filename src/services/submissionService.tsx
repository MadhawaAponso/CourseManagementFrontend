// src/services/submissionService.ts
import api from "./axios";
import type {
  AssignmentSubmissionRequestDTO,
  AssignmentSubmissionResponseDTO,
} from "../types/AssignmentSubmission";

// fetch current user’s submission (or null)
export async function fetchMySubmission(
  assignmentId: number
): Promise<AssignmentSubmissionResponseDTO | null> {
  const res = await api.get<AssignmentSubmissionResponseDTO>(
    `/submissions/assignment/${assignmentId}/my`
  );
  return res.data;
}

// submit a new answer
export async function submitAssignment(
  dto: AssignmentSubmissionRequestDTO
): Promise<AssignmentSubmissionResponseDTO> {
  const res = await api.post<AssignmentSubmissionResponseDTO>(
    `/submissions`,
    dto
  );
  return res.data;
}
