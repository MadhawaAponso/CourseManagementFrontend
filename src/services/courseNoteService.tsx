// src/services/courseNoteService.ts
import api from "./axios";
import type { CourseNoteResponseDTO, CourseNoteRequestDTO } from "../types/CourseNote";

export const getNotesByLecture = (lectureId: number) =>
  api.get<CourseNoteResponseDTO[]>(`/lectures/${lectureId}/notes`).then(r => r.data);

export const createNote = (payload: CourseNoteRequestDTO) =>
  api.post<CourseNoteResponseDTO>("/notes", payload).then(r => r.data);

export const updateNote = (id: number, payload: CourseNoteRequestDTO) =>
  api.put<CourseNoteResponseDTO>(`/notes/${id}`, payload).then(r => r.data);

export const deleteNote = (id: number) =>
  api.delete<void>(`/notes/${id}`);
