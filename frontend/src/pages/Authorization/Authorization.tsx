import PageHeader from "../../components/PageHeader/PageHeader";
import AuthorizationForm from "../../components/AuthorizationForm/AuthorizationForm";

export default function Register() {
  return (
    <>
      <PageHeader
        title="Авторизация"
        description="Войдите в аккаунт, чтобы управлять билетами."
      />

      <main style={{ position: "relative", margin: "-150px 0 40px" }}>
        <AuthorizationForm />
      </main>
    </>
  );
}
