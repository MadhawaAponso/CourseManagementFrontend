export interface EnrollmentRequestDTO {
  studentId: number;
  courseId: number;
}
export enum EnrollmentStatus {
  active = "active",
  completed = "completed",
  dropped = "dropped",

}

export interface EnrollmentResponseDTO {
  id: number;
  studentName: string;
  courseName: string;
  courseCode: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  dropAllowed: boolean;
}