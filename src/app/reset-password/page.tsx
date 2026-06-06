import { ResetPasswordForm } from "./reset-password-form";
import { HashSessionHandler } from "@/components/auth/hash-session-handler";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        <HashSessionHandler />
        <ResetPasswordForm />
      </div>
    </div>
  );
}
