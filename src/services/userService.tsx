// src/services/userService.ts
import api from "./axios";
import type { UserResponseDTO } from "../types/Users";

export async function fetchCurrentUser(): Promise<UserResponseDTO> {
  const res = await api.get<UserResponseDTO>("/users/me");
  return res.data;
}
