// src/services/courseNoteService.ts
import api from "./axios";
import type { CourseNoteResponseDTO, CourseNoteRequestDTO } from "../types/CourseNote";

export const getNotesByLecture = (lectureId: number) =>
  api.get<CourseNoteResponseDTO[]>(`notes/lecture/${lectureId}`).then(r => r.data);

export const createNote = (payload: CourseNoteRequestDTO) =>
  api.post<CourseNoteResponseDTO>("/notes", payload).then(r => r.data);

export const updateNote = (id: number, payload: CourseNoteRequestDTO) =>
  api.put<CourseNoteResponseDTO>(`/notes/${id}`, payload).then(r => r.data);

export const deleteNote = (id: number) =>
  api.delete<void>(`/notes/${id}`);

export const uploadFileBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const res = await api.post<{ path: string }>("/notes/upload", {
        fileName: file.name,
        base64
      });
      resolve(res.data.path);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
