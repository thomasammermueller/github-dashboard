import type { Metadata } from "next";
import { Providers } from "./providers";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Dashboard",
  description: "A personal GitHub dashboard for managing issues, PRs, and notifications",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-950">
        <Providers>
          <Sidebar />
          <Header />
          <main className="ml-64 pt-16 min-h-screen">
            <div className="p-6">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
