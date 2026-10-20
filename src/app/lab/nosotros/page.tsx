import type { Metadata } from "next";
import { Header } from "@/components/Header";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = { title: "Nosotros — Innocaps Lab" };

export default function Page() {
  return (
    <>
      <Header />
      <AboutPage />
    </>
  );
}
