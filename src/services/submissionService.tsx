import api from "./axios";
import type {
  AssignmentSubmissionRequestDTO,
  AssignmentSubmissionResponseDTO,
} from "../types/AssignmentSubmission";

import type { GradeSubmissionRequestDTO } from "../types/GradeSubmission";

// STUDENT: fetch current user’s submission (or null)
export async function fetchMySubmission(
  assignmentId: number
): Promise<AssignmentSubmissionResponseDTO | null> {
  try {
    const res = await api.get<AssignmentSubmissionResponseDTO>(
      `/submissions/assignment/${assignmentId}/my`
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

// STUDENT: submit a new answer
export async function submitAssignment(
  dto: AssignmentSubmissionRequestDTO
): Promise<AssignmentSubmissionResponseDTO> {
  const res = await api.post<AssignmentSubmissionResponseDTO>(
    `/submissions`,
    dto
  );
  return res.data;
}

// INSTRUCTOR: fetch *all* submissions for an assignment
export async function getAllSubmissions(
  assignmentId: number
): Promise<AssignmentSubmissionResponseDTO[]> {
  const res = await api.get<AssignmentSubmissionResponseDTO[]>(
    `/submissions/assignment/${assignmentId}`
  );
  return res.data;
}

// INSTRUCTOR: grade (or re-grade) a submission
export async function gradeSubmission(
  submissionId: number,
  dto: GradeSubmissionRequestDTO
): Promise<AssignmentSubmissionResponseDTO> {
  const res = await api.put<AssignmentSubmissionResponseDTO>(
    `/submissions/${submissionId}/grade`,
    dto
  );
  return res.data;
}
