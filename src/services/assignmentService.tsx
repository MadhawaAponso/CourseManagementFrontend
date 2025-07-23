// src/services/assignmentService.ts
import api from "./axios";
import type { AssignmentResponseDTO , AssignmentRequestDTO } from "../types/Assignments";
// import { data } from "react-router-dom";

export async function getUpcomingAssignments(): Promise<AssignmentResponseDTO[]> {
  const res = await api.get<AssignmentResponseDTO[]>("/assignments/upcoming/student");

  return res.data;
}
export const getAssignmentsByLecture = (lectureId: number) =>
  api.get<AssignmentResponseDTO[]>(`/lectures/${lectureId}/assignments`).then(r => r.data);

export const createAssignment = (payload: AssignmentRequestDTO) =>
  api.post<AssignmentResponseDTO>("/assignments", payload).then(r => r.data);

export const updateAssignment = (id: number, payload: AssignmentRequestDTO) =>
  api.put<AssignmentResponseDTO>(`/assignments/${id}`, payload).then(r => r.data);

export const deleteAssignment = (id: number) =>
  api.delete<void>(`/assignments/${id}`);