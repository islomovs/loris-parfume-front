import { axiosLoginInstance } from "../utils/axiosInstance";

export type TRegisterFormData = {
  fullName: string;
  phone: string;
  password: string;
  rePassword: string;
};

export type TLoginFormData = {
  phone: string;
  password?: string;
};

export const login = async (data: TLoginFormData) => {
  try {
    const response = await axiosLoginInstance.post("/api/v1/auth/login", data);
    return response.data;
  } catch (err: any) {
    if (err.response && err.response.status === 409) {
      console.error("Conflict error: ", err.response.data);
      return err;
    } else {
      console.error(`Error: ${err.message}`);
      return err;
    }
  }
};

export const register = async (data: TRegisterFormData) => {
  try {
    const response = await axiosLoginInstance.post(`/api/v1/auth/signUp`, data);
    return response.data;
  } catch (err: any) {
    console.error("Failed to register user:", err);
    throw err;
  }
};

export const sendVerificationCode = async (
  phoneNumber: string,
  verificationCode: string
) => {
  try {
    const response = await axiosLoginInstance.post("/api/v1/auth/verifyCode", {
      code: verificationCode,
      phone: phoneNumber,
    });
    return response.data;
  } catch (err) {
    console.error("Verification failed:", err);
    throw err;
  }
};

export const resendVerificationCode = async (phoneNumber: string) => {
  try {
    const response = await axiosLoginInstance.post("/api/v1/auth/resendCode", {
      phone: phoneNumber,
    });
    console.log("Code resent successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Code resent:", err);
    throw err;
  }
};

// Function to generate a reset password code
export const generateResetPasswordCode = async (phone: string) => {
  try {
    const response = await axiosLoginInstance.post(
      `/api/v1/auth/generateResetPasswordCode?phone=${phone}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to generate reset password code:", err);
    throw err;
  }
};

// Function to verify the reset password code
export const verifyResetPasswordCode = async (phone: string, code: string) => {
  try {
    const response = await axiosLoginInstance.post(
      `/api/v1/auth/verifyResetPasswordCode?phone=${phone}&code=${code}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to verify reset password code:", err);
    throw err;
  }
};

// Function to reset the password
export const resetPassword = async (
  phone: string,
  code: string,
  newPassword: string,
  reNewPassword: string
) => {
  try {
    const response = await axiosLoginInstance.post(
      `/api/v1/auth/resetPassword?phone=${phone}&code=${code}&newPassword=${newPassword}&reNewPassword=${reNewPassword}`
    );
    return response.data;
  } catch (err: any) {
    console.error("Failed to reset password:", err);
    throw err;
  }
};
