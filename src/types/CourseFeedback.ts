export interface CourseFeedbackResponseDTO {
  id: number;
  courseId: number;
  studentName: string | null;
  feedbackText: string;
  rating: number;
  submittedAt: string;
  isAnonymous: boolean;
}
