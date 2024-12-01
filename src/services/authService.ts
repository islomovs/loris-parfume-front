import { axiosLoginInstance } from "../utils/axiosInstance";

export type TRegisterFormData = {
  fullName: string;
  phone: string;
  password: string;
  rePassword: string;
};

export type TLoginFormData = {
  phone: string;
  password: string;
};

export type TResetPasswordFormData = {
  phone: string;
};

export type TResetNewPasswordFormData = {
  newPassword: string;
  reNewPassword: string;
};

export const login = async (data: TLoginFormData) => {
  try {
    const response = await axiosLoginInstance.post("/api/v1/auth", data);
    return response.data;
  } catch (err: any) {
    console.error(`Error: `, err);
    throw err;
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

export type TAuthFormData = {
  fullName?: string;
  phone: string;
};

export const auth = async (data: TAuthFormData) => {
  try {
    const response = await axiosLoginInstance.post(`/api/v1/auth`, data);
    return response.data;
  } catch (err: any) {
    console.error("Failed to authenticate user:", err);
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
  newPassword: string | undefined,
  reNewPassword: string | undefined
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
