import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const configError = params.error === "config";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <LoginForm configError={configError} />
    </div>
  );
}
