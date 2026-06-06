import { LoginForm } from "./login-form";
import { HashSessionHandler } from "@/components/auth/hash-session-handler";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const configError = params.error === "config";
  const authError = params.error === "auth";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <HashSessionHandler />
        <LoginForm configError={configError} authError={authError} />
      </div>
    </div>
  );
}
