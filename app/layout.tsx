import type { Metadata } from "next";
import "./globals.css";
import DefaultFooter from "@/components/footers/DefaultFooter";
import DefaultHeader from "@/components/headers/DefaultHeader";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: {
    default: "Vercel Daily News",
    template: "%s | Vercel Daily News"
  },
  description: "News and insights for modern web developers. Changelogs, engineering deep-dives, customer stories and community updates.",
  openGraph: {
    title: "Vercel Daily News",
    description: "News and insights for modern web developers. Changelogs, engineering deep-dives, customer stories and community updates.",
    type: "website",
    locale: "en_US",
    siteName: "Vercel Daily News"
  }
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
        <Providers>
          <DefaultHeader />
          <main className="flex-1">
            {children}
          </main>
          <DefaultFooter />
        </Providers>
      </body>
    </html>
  );
}
