export interface RegisterRequest {
  firstName: string;
  patronymic: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
}

async function authRequest(
  url: string,
  data: RegisterRequest | LoginRequest,
): Promise<AuthResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Такая почта уже зарегистрирована");
    }

    if (response.status === 401) {
      throw new Error("Неверная почта или пароль");
    }

    if (response.status === 400) {
      throw new Error("Проверьте правильность заполнения полей");
    }

    throw new Error(`Ошибка сервера: ${response.status}`);
  }

  return response.json();
}

export function register(data: RegisterRequest) {
  return authRequest("/api/auth/register", data);
}

export function login(data: LoginRequest) {
  return authRequest("/api/auth/login", data);
}
