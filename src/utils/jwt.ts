export function getRolesFromToken(): string[] {
  const token = localStorage.getItem("token");
  if (!token) return [];
  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded.realm_access?.roles || [];
  } catch {
    return [];
  }
}
