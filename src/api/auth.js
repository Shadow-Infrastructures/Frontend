import { apiRequest } from "./client";

/** Authentication requests for the centralized TreeHouse backend. */
export async function loginRequest(email, password) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response?.data || response;
}

export async function registerRequest(payload) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response?.data || response;
}

export async function getUserRequest(userId) {
  const response = await apiRequest(`/user/${userId}`);
  return response?.data || response;
}
