import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../../api/passwordReset";

import styles from "./PasswordRecovery.module.css";
import authStyles from "../AuthorizationForm/AuthorizationForm.module.css";
import registerStyles from "../RegisterForm/RegisterForm.module.css";

import emailIcon from "../../assets/email.svg";
import showPasswordIcon from "../../assets/show_password.svg";
import hidePasswordIcon from "../../assets/hide_password.svg";
import arrowIcon from "../../assets/arrow.svg";
import closeIcon from "../../assets/close.svg";

type Step = "email" | "sent" | "code" | "password" | "success";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const codeRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (step !== "sent" && step !== "code") return;
    if (now >= resendAt) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, resendAt, now]);

  useEffect(() => {
    if (step === "code") {
      codeRef.current?.focus();
    }
  }, [step]);

  const remaining = Math.max(0, Math.ceil((resendAt - now) / 1000));

  function backToLogin() {
    navigate("/login");
  }

  async function handleSendCode() {
    if (loading || (step !== "email" && remaining > 0)) return;

    setError("");

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Введите корректный адрес электронной почты");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(normalizedEmail);

      setEmail(normalizedEmail);
      setCode("");

      const currentTime = Date.now();

      setResendAt(currentTime + RESEND_SECONDS * 1000);
      setNow(currentTime);
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить код");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode() {
    if (loading) return;

    setError("");

    if (!/^\d{6}$/.test(code)) {
      setError("Введите шестизначный код");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyResetCode(email, code);

      if (!response.resetToken) {
        throw new Error("Сервер не вернул токен восстановления");
      }

      setResetToken(response.resetToken);
      setCode("");
      setStep("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось проверить код");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePassword() {
    if (loading) return;

    setError("");

    if (!/^[a-zA-Z0-9]{8,}$/.test(password)) {
      setError(
        "Пароль должен содержать минимум 8 символов. Разрешены только латинские буквы и цифры",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(resetToken, password, confirmPassword);

      setResetToken("");
      setPassword("");
      setConfirmPassword("");
      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось изменить пароль",
      );
    } finally {
      setLoading(false);
    }
  }

  function renderError() {
    return error ? (
      <p className={authStyles.error} role="alert">
        {error}
      </p>
    ) : null;
  }

  function renderBackButton() {
    return (
      <button type="button" className={styles.backButton} onClick={backToLogin}>
        <img src={arrowIcon} alt="" className={styles.arrowIcon} />
        Вернуться ко входу
      </button>
    );
  }

  function renderResendButton() {
    const minutes = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (remaining % 60).toString().padStart(2, "0");

    return (
      <button
        type="button"
        className={styles.resendButton}
        disabled={loading || remaining > 0}
        onClick={() => void handleSendCode()}
      >
        {remaining > 0
          ? `Отправить код ещё раз через ${minutes}:${seconds}`
          : "Отправить код ещё раз"}
      </button>
    );
  }

  return (
    <div className={`${registerStyles.form} ${styles.card}`}>
      {step !== "email" && step !== "success" && (
        <button
          type="button"
          className={styles.closeButton}
          onClick={backToLogin}
          aria-label="Закрыть восстановление пароля"
        >
          <img src={closeIcon} alt="" className={styles.closeIcon} />
        </button>
      )}

      {step === "email" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSendCode();
          }}
          noValidate
        >
          <p className={styles.intro}>
            Укажите адрес электронной почты и мы отправим код для сброса пароля
          </p>

          <div className={registerStyles.field}>
            <label htmlFor="recovery-email">Email</label>

            <div className={authStyles.inputWrapper}>
              <img src={emailIcon} alt="" className={authStyles.inputIcon} />

              <input
                id="recovery-email"
                type="email"
                placeholder="Введите email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          {renderError()}

          <button
            type="submit"
            className={`${registerStyles.submitButton} ${styles.primaryButton}`}
            disabled={loading}
          >
            {loading ? "Отправляем..." : "Отправить код"}
          </button>

          {renderBackButton()}
        </form>
      )}

      {step === "sent" && (
        <div className={styles.centered}>
          <div className={styles.iconCircle}>
            <img src={emailIcon} alt="" />
          </div>

          <h2>Код отправлен</h2>

          <p className={styles.description}>
            Если адрес зарегистрирован, мы отправили шестизначный код на вашу
            почту.
          </p>

          {renderError()}

          <button
            type="button"
            className={`${registerStyles.submitButton} ${styles.primaryButton}`}
            onClick={() => {
              setError("");
              setStep("code");
            }}
          >
            Продолжить
          </button>

          {renderResendButton()}
          {renderBackButton()}
        </div>
      )}

      {step === "code" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleVerifyCode();
          }}
          noValidate
        >
          <h2 className={styles.stepTitle}>Введите код</h2>

          <p className={styles.description}>
            Введите шестизначный код, который мы отправили на {email}.
          </p>

          <div className={styles.codeInputWrapper}>
            <input
              ref={codeRef}
              className={styles.hiddenCodeInput}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH),
                )
              }
              aria-label="Шестизначный код подтверждения"
            />

            <div className={styles.codeBoxes} aria-hidden="true">
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <div
                  key={index}
                  className={`${styles.codeBox} ${
                    index === Math.min(code.length, CODE_LENGTH - 1)
                      ? styles.activeCodeBox
                      : ""
                  }`}
                >
                  {code[index] ?? ""}
                </div>
              ))}
            </div>
          </div>

          {renderError()}

          <button
            type="submit"
            className={`${registerStyles.submitButton} ${styles.primaryButton}`}
            disabled={loading || code.length !== CODE_LENGTH}
          >
            {loading ? "Проверяем..." : "Продолжить"}
          </button>

          {renderResendButton()}
          {renderBackButton()}
        </form>
      )}

      {step === "password" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSavePassword();
          }}
          noValidate
        >
          <h2 className={styles.stepTitle}>Новый пароль</h2>

          <p className={styles.description}>
            Придумайте новый пароль для вашего аккаунта.
          </p>

          <div className={registerStyles.field}>
            <label htmlFor="new-password">Новый пароль</label>

            <div className={styles.passwordWrapper}>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Введите новый пароль"
                value={password}
                autoComplete="new-password"
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className={registerStyles.eyeButton}
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                <img
                  src={showPassword ? showPasswordIcon : hidePasswordIcon}
                  alt=""
                />
              </button>
            </div>
          </div>

          <div className={`${registerStyles.field} ${styles.confirmField}`}>
            <label htmlFor="confirm-new-password">Повторите пароль</label>
            <div className={styles.passwordWrapper}>
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Повторите пароль"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              <button
                type="button"
                className={registerStyles.eyeButton}
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={
                  showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                }
              >
                <img
                  src={
                    showConfirmPassword ? showPasswordIcon : hidePasswordIcon
                  }
                  alt=""
                />
              </button>
            </div>
          </div>

          <p className={styles.requirements}>
            Пароль должен содержать минимум 8 символов. Разрешены только
            латинские буквы и цифры.
          </p>

          {renderError()}

          <button
            type="submit"
            className={`${registerStyles.submitButton} ${styles.primaryButton}`}
            disabled={loading}
          >
            {loading ? "Сохраняем..." : "Сохранить пароль"}
          </button>

          {renderBackButton()}
        </form>
      )}

      {step === "success" && (
        <div className={styles.centered}>
          <div className={styles.successCircle} aria-hidden="true">
            ✓
          </div>

          <h2>Пароль успешно восстановлен</h2>

          <p className={styles.description}>
            Теперь вы можете войти в свой аккаунт с новым паролем.
          </p>

          <Link
            to="/login"
            className={`${registerStyles.submitButton} ${styles.primaryButton}`}
          >
            Перейти ко входу
          </Link>
        </div>
      )}
    </div>
  );
}
