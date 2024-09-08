import * as yup from "yup";

export const registerSchema = yup.object({
  fullName: yup.string().required("Full name is required"),
  phone: yup
    .string()
    .matches(/^\+998\d{9}$/, "Phone number must be in the format +9980000000")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  rePassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export const loginSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\+998\d{9}$/, "Phone number must be in the format +9980000000")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
});
