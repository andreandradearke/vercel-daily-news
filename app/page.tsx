import type { Metadata } from "next";
import Home from "@/page-components/Home";

export const metadata: Metadata = {
  title: "Home",
  description: "The latest news, updates, and insights for modern web developers from Vercel Daily News.",
  openGraph: {
    title: "Vercel Daily News - Home",
    description: "The latest news, updates, and insights for modern web developers.",
    type: "website"
  }
};

export default function HomePage() {
  return (
    <Home />
  );
}