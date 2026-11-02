const BASE_URL = "/api/auth";

export interface MessageResponse {
  message: string;
}

export interface VerifyCodeResponse {
  resetToken: string;
}

async function post<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error(
        "Неверные данные, просроченный код или превышено число попыток",
      );
    }

    if (response.status === 429) {
      throw new Error("Слишком много запросов. Попробуйте позже");
    }

    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function forgotPassword(email: string) {
  return post<MessageResponse>("/forgot-password", { email });
}

export function verifyResetCode(email: string, code: string) {
  return post<VerifyCodeResponse>("/verify-reset-code", {
    email,
    code,
  });
}

export function resetPassword(
  resetToken: string,
  password: string,
  confirmPassword: string,
) {
  return post<MessageResponse>("/reset-password", {
    resetToken,
    password,
    confirmPassword,
  });
}
