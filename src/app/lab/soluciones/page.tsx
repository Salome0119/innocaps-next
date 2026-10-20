import type { Metadata } from "next";
import { Header } from "@/components/Header";
import SolutionsPage from "@/components/SolutionsPage";

export const metadata: Metadata = { title: "Soluciones - Innocaps Lab" };

export default function Page() {
  return (
    <main>
      <Header />
      <SolutionsPage />
    </main>
  );
}
