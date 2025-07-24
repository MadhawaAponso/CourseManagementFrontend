import api from "./axios";
import type { CourseResponseDTO } from "../types/CourseResponse";
import type { EnrollmentRequestDTO , EnrollmentResponseDTO } from "../types/Enrollment";


export function getAvailableCourses(studentId: number) {
  return api.get<CourseResponseDTO[]>("/enrollments/available", {
    params: { studentId },
  }).then((r) => r.data);
}


export function enrollCourse(dto: EnrollmentRequestDTO) {
  return api.post<EnrollmentResponseDTO>("/enrollments", dto)
    .then((r) => r.data);
}


export function dropEnrollment(enrollmentId: number) {
  return api.delete<void>(`/enrollments/${enrollmentId}`);
}
