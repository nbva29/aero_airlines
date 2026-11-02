import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputMask } from "@react-input/mask";
import { register } from "../../api/auth";

import styles from "./RegisterForm.module.css";
import showPasswordIcon from "../../assets/show_password.svg";
import hidePasswordIcon from "../../assets/hide_password.svg";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Заполните обязательные поля");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Введите корректную почту");
      return;
    }

    if (form.phone && !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(form.phone)) {
      setError("Введите номер телефона полностью");
      return;
    }

    if (!/^[a-zA-Z0-9]{8,}$/.test(form.password)) {
      setError(
        "Пароль должен содержать минимум 8 символов. Разрешены только латинские буквы и цифры",
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        firstName: form.firstName.trim(),
        patronymic: "",
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      if (!response.accessToken) {
        throw new Error("Сервер не вернул токен авторизации");
      }

      navigate("/login", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось зарегистрироваться",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="firstName">Имя</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Введите имя"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="given-name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">Фамилия</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Введите фамилию"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="family-name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Почта</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Введите почту"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Номер телефона</label>
          <InputMask
            id="phone"
            name="phone"
            type="tel"
            mask="+7 (___) ___-__-__"
            replacement={{ _: /\d/ }}
            showMask={false}
            placeholder="+7 (999) 999-99-99"
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Пароль</label>

          <div className={styles.passwordWrapper}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Введите пароль"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <img
                src={showPassword ? showPasswordIcon : hidePasswordIcon}
                alt=""
              />
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Повторите пароль</label>

          <div className={styles.passwordWrapper}>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Повторите пароль"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
              }
            >
              <img
                src={showConfirmPassword ? showPasswordIcon : hidePasswordIcon}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Регистрация..." : "Создать аккаунт"}
      </button>

      <p className={styles.loginText}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </form>
  );
}
