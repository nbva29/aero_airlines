import PageHeader from "../../components/PageHeader/PageHeader";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

export default function Register() {
  return (
    <>
      <PageHeader
        title="Регистрация"
        description="Создайте аккаунт AERO, чтобы бронировать быстрее."
      />

      <main style={{ position: "relative", margin: "-150px 0 40px" }}>
        <RegisterForm />
      </main>
    </>
  );
}
