// src/services/authService.ts
import axios from "./axios";
import type {
  UserRequestDTO,
  UserResponseDTO,
  LoginRequest,
  LoginResponse,
} from "../types/Users";

const KC_TOKEN_URL =
  "http://localhost:8081/realms/course-management/protocol/openid-connect/token";
const KC_LOGOUT_URL =
  "http://localhost:8081/realms/course-management/protocol/openid-connect/logout";


export const registerUser = async (
  data: UserRequestDTO
): Promise<UserResponseDTO> => {
  const res = await axios.post<UserResponseDTO>("/auth/register", data);
  return res.data;
};


export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", "course-management-client");
  params.append("client_secret", "YM4dDFcibF22yepMvuaRn8zfVi5H02NG");
  params.append("username", data.username);
  params.append("password", data.password);
  params.append("scope", "openid");

  const response = await axios.post<LoginResponse>(KC_TOKEN_URL, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { access_token, refresh_token } = response.data;
  localStorage.setItem("token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  return response.data;
};


export const logoutUser = async (): Promise<void> => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (refreshToken) {
    const params = new URLSearchParams();
    params.append("client_id", "course-management-client");
    params.append("client_secret", "YM4dDFcibF22yepMvuaRn8zfVi5H02NG");
    params.append("refresh_token", refreshToken);

    try {
      await axios.post(KC_LOGOUT_URL, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch (e) {
      console.warn("Keycloak logout failed, continuing anyway", e);
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
};
