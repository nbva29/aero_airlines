import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PageHeader.module.css";
import logo from "../../assets/logo.svg";
import languageIcon from "../../assets/language.svg";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  const [language, setLanguage] = useState<"RU" | "EN">("RU");

  function changeLanguage() {
    setLanguage(language === "RU" ? "EN" : "RU");
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="AERO" />
          </Link>

          <nav className={styles.navigation}>
            <Link to="/tickets">Мои билеты</Link>
            <Link to="/profile">Профиль</Link>
          </nav>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.language}
            onClick={changeLanguage}
          >
            <img src={languageIcon} alt="" width={24} height={24} />
            {language}
          </button>

          <Link to="/login" className={styles.login}>
            Войти
          </Link>

          <Link to="/register" className={styles.register}>
            Зарегистрироваться
          </Link>
        </div>
      </header>

      <div className={styles.background}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </>
  );
}
