import type{ LectureResponseDTO } from "./Lecture";
import type { CourseFeedbackResponseDTO } from "./CourseFeedback";

export interface CourseResponseDTO {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  instructorName: string;
  createdByName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  lectures: LectureResponseDTO[];
  feedbacks: CourseFeedbackResponseDTO[];
}

export interface CourseRequestDTO {
  courseCode:    string;
  courseName:    string;
  description?:  string;
  instructorId:  number;
  createdById:   number;
  startDate:     string; 
  endDate:       string; 
}
