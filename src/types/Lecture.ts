import type { CourseNoteResponseDTO } from "./CourseNote";
import type { AssignmentResponseDTO } from "./Assignments";

// src/types/Lecture.ts
export interface LectureResponseDTO {
  id: number;
  courseId: number;            // ← now it’s there
  courseCode: string;
  courseName: string;
  lectureTitle: string;
  description: string;
  onlineLectureLink: string;
  weekNumber: number;
  scheduledDate: string;       // map LocalDateTime → ISO string in JSON
  instructorName: string;
  notes: CourseNoteResponseDTO[];
  assignments: AssignmentResponseDTO[];
}


export interface LectureRequestDTO {
  lectureTitle: string;
  description?: string;
  scheduledDate: string;  // ISO date (e.g. "2025-08-01")
  weekNumber: number;
  onlineLectureLink?: string;
  // courseId: number;
}
