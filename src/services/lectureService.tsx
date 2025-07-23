// src/services/lectureService.ts
import api from "./axios";
import type {
  LectureResponseDTO,
  LectureRequestDTO,
} from "../types/Lecture";

// STUDENT: get lectures for current week
export async function getCurrentWeekLectures(): Promise<LectureResponseDTO[]> {
  const res = await api.get<LectureResponseDTO[]>("/lectures/week/current/student");
  return res.data;
}

// ANYONE: fetch one lecture by its ID
export async function getLectureById(id: number): Promise<LectureResponseDTO> {
  const res = await api.get<LectureResponseDTO>(`/lectures/${id}`);
  return res.data;
}

// INSTRUCTOR: create a new lecture
export async function createLecture(
  payload: LectureRequestDTO
): Promise<LectureResponseDTO> {
  const res = await api.post<LectureResponseDTO>("/lectures", payload);
  return res.data;
}

// INSTRUCTOR: update an existing lecture
export async function updateLecture(
  id: number,
  payload: LectureRequestDTO
): Promise<LectureResponseDTO> {
  const res = await api.put<LectureResponseDTO>(`/lectures/${id}`, payload);
  return res.data;
}

// INSTRUCTOR: delete a lecture
export async function deleteLecture(id: number): Promise<void> {
  await api.delete(`/lectures/${id}`);
}
