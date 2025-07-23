// src/services/assignmentService.ts
import api from "./axios";
import type { AssignmentResponseDTO } from "../types/Assignments";
// import { data } from "react-router-dom";

export async function getUpcomingAssignments(): Promise<AssignmentResponseDTO[]> {
  const res = await api.get<AssignmentResponseDTO[]>("/assignments/upcoming/student");
  
  console.log(res)
  console.log(res.data)
  return res.data;
}
