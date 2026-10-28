import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import showPasswordIcon from "../../assets/show_password.svg";
import hidePasswordIcon from "../../assets/hide_password.svg";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
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
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Номер телефона</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+7 000 000-00-00"
            value={form.phone}
            onChange={handleChange}
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
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <img
                src={showPassword ? hidePasswordIcon : showPasswordIcon}
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
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
              }
            >
              <img
                src={showConfirmPassword ? hidePasswordIcon : showPasswordIcon}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Создать аккаунт
      </button>

      <p className={styles.loginText}>
        Уже есть аккаунт?
        <Link to="/login">Войти</Link>
      </p>
    </form>
  );
}
