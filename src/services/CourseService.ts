// src/services/courseService.ts
import api from "./axios";
import type { CourseRequestDTO } from "../types/CourseResponse";
import type { CourseResponseDTO } from "../types/CourseResponse";

export function createCourse(dto: CourseRequestDTO): Promise<CourseResponseDTO> {
  return api.post<CourseResponseDTO>("/courses", dto).then(r => r.data);
}
