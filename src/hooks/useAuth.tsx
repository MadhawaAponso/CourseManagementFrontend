import { useMemo } from "react";
import {jwtDecode} from "jwt-decode";

export interface JwtPayload {
  exp: number;
  preferred_username: string;
  realm_access?: { roles: string[] };
  userId: number;
}

export function useAuth() {
  const token = localStorage.getItem("token");

  return useMemo(() => {
    if (!token) {
      return {
        isAuthenticated: false,
        roles: [] as string[],
        userId: null as number | null,
        isInstructor: false,
        isStudent: false,
      };
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expired = decoded.exp * 1000 < Date.now();
      const roles = decoded.realm_access?.roles ?? [];
      return {
        isAuthenticated: !expired,
        roles,
        userId: decoded.userId,
        isInstructor: roles.includes("instructor"),
        isStudent: roles.includes("student"),
      };
    } catch {
      return {
        isAuthenticated: false,
        roles: [] as string[],
        userId: null as number | null,
        isInstructor: false,
        isStudent: false,
      };
    }
  }, [token]);
}

// import { useMemo } from "react";
// import {jwtDecode} from "jwt-decode";

// export interface JwtPayload {
//   exp: number;
//   preferred_username: string;
//   realm_access?: { roles: string[] };
//   userId: number;
// }

// export function useAuth() {
//   const token = localStorage.getItem("token");

//   return useMemo(() => {
//     if (!token) return { isAuthenticated: false, roles: [] as string[] };

//     try {
//       const decoded = jwtDecode<JwtPayload>(token);
//       const expired = decoded.exp * 1000 < Date.now();
//       const roles = decoded.realm_access?.roles ?? [];
//       return { isAuthenticated: !expired, roles };
//     } catch {
//       return { isAuthenticated: false, roles: [] as string[] };
//     }
//   }, [token]);
// }
