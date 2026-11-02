import PageHeader from "../../components/PageHeader/PageHeader";
import PasswordRecovery from "../../components/PasswordRecovery/PasswordRecovery";

export default function Register() {
  return (
    <>
      <PageHeader
        title="Восстановление пароля"
        description="Восстановите пароль, чтобы войти в аккаунт"
      />

      <main style={{ position: "relative", margin: "-150px 0 40px" }}>
        <PasswordRecovery />
      </main>
    </>
  );
}
