import type { Metadata } from "next";
import { Header } from "@/components/Header";
import TechnologyPage from "@/components/TechnologyPage";

export const metadata: Metadata = { title: "Tecnología - Innocaps Lab" };

export default function Page() {
  return (
    <main>
      <Header />
      <TechnologyPage />
    </main>
  );
}
