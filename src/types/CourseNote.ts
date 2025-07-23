export interface CourseNoteResponseDTO {
  id: number;
  noteTitle: string;
  filePath: string;
  fileType: string;
  uploadedAt: string;
  uploadedBy: string;
  lectureTitle: string;
}

export interface CourseNoteRequestDTO{
  lectureId:number;
  noteTitle:string;
  filePath:string;
  fileType:string;
  uploadedBy:number
}