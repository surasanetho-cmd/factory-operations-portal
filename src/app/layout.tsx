import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Factory Operations Portal",
  description: "ระบบติดตามและจัดการงานโรงงาน",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" data-theme="dark">
      <body>
        {children}
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
