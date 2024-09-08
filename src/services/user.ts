// services/userService.ts
import { axiosInstance } from "../utils/axiosInstance";

// Fetch user info
export const fetchUserInfo = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axiosInstance.post(
    "/api/v1/users/me",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Update user info
export const updateUserInfo = async (data: {
  fullName: string;
  phone: string;
}) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const response = await axiosInstance.put("/api/v1/users/update", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
