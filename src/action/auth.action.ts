"use server";

import {
  forgotPasswordSchemaType,
  OtpSchemaType,
  RegisterSchemaType,
  ResetPasswordSchemaType,
} from "@/schemas/auth.schema";

const getBaseUrl = () => {
  const raw =
    process.env.BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:5000/api";
  return raw.trim().replace(/;+$/, "").replace(/\/api$/, "") + "/api";
};

// userRegister
export async function userRegister(data: RegisterSchemaType) {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Something went wrong",
    };
  }
}

// forgotPasswords
export async function forgotPasswords(data: forgotPasswordSchemaType) {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Something went wrong",
    };
  }
}

// resetPassword - supports both resetPassword(payload) and resetPassword(token, payload)
export async function resetPassword(
  tokenOrData: string | ResetPasswordSchemaType,
  data?: ResetPasswordSchemaType,
) {
  try {
    const baseUrl = getBaseUrl();
    let url = `${baseUrl}/auth/resetPassword`;
    let body: any = {};

    if (typeof tokenOrData === "string") {
      url = `${baseUrl}/auth/resetPassword/${tokenOrData}`;
      body = { password: data?.newPassword };
    } else {
      // Called as resetPassword(payload)
      body = {
        email: tokenOrData.email,
        password: tokenOrData.newPassword,
        newPassword: tokenOrData.newPassword,
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Something went wrong",
    };
  }
}

// verifyResetCode
export async function verifyResetCode(
  email: string,
  data: OtpSchemaType | { otp: string },
) {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: data.otp }),
    });
    const result = await res.json();
    return {
      ok: res.ok,
      data: result,
      error: result?.message || null,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Something went wrong",
    };
  }
}
