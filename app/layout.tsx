import type { Metadata } from "next";
import "./globals.css";
import DefaultFooter from "@/components/footers/DefaultFooter";
import DefaultHeader from "@/components/headers/DefaultHeader";

export const metadata: Metadata = {
  title: "Vercel Daily News",
  description: "Nextjs certification assessment project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="flex flex-col min-h-screen box-border">
        <DefaultHeader />
        <main className="flex-1">
          {children}
        </main>
        <DefaultFooter />
      </body>
    </html>
  );
}
