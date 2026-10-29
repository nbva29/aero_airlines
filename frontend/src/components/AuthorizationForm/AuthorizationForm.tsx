import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AuthorizationForm.module.css";
import registerStyles from "../RegisterForm/RegisterForm.module.css";

import emailIcon from "../../assets/email.svg";
import passwordIcon from "../../assets/password.svg";
import showPasswordIcon from "../../assets/show_password.svg";
import hidePasswordIcon from "../../assets/hide_password.svg";

export default function AuthorizationForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    <form className={registerStyles.form} onSubmit={handleSubmit} noValidate>
      <div className={`${registerStyles.fields} ${styles.fields}`}>
        <div className={registerStyles.field}>
          <label htmlFor="email">Почта</label>

          <div className={styles.inputWrapper}>
            <img src={emailIcon} alt="" className={styles.inputIcon} />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Введите почту"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={registerStyles.field}>
          <label htmlFor="password">Пароль</label>

          <div className={styles.inputWrapper}>
            <img src={passwordIcon} alt="" className={styles.inputIcon} />

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
              className={registerStyles.eyeButton}
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
      </div>

      <p className={`${registerStyles.loginText} ${styles.forgotPassword}`}>
        <Link to="/forgot-password">Забыли пароль?</Link>
      </p>

      <button
        type="submit"
        className={`${registerStyles.submitButton} ${styles.submitButton}`}
      >
        Войти
      </button>
    </form>
  );
}
