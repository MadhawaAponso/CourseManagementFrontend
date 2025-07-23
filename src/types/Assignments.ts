export interface AssignmentResponseDTO {
  id: number;
  assignmentTitle: string;
  description: string;
  dueDate: string;
  maxScore: number;
  createdBy: string;
  lectureTitle: string;
  createdAt: string;
  lectureId:number
}
export interface AssignmentRequestDTO {
  lectureId: number;
  assignmentTitle: string;
  description: string;
  dueDate: string;      
  maxScore?: number;    
  createdBy: number;
}
