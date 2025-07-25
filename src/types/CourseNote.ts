export interface CourseNoteResponseDTO {
  id: number;
  noteTitle: string;
  filePath: string;
  fileType: string;
  uploadedAt: number;
  uploadedBy: string;
  lectureTitle: string;
}

export interface CourseNoteRequestDTO {
  lectureId: number;
  noteTitle:  string;
  filePath:   string;
  fileType?:  string;
  uploadedBy: number;
}
