import type { Metadata } from "next";
import { Header } from "@/components/Header";
import SynthesisInProgress from "@/components/SynthesisInProgress";

export const metadata: Metadata = { title: "Contacto — Innocaps Lab" };

export default function Page() {
  return (
    <>
      <Header />
      <SynthesisInProgress variant={1} />
    </>
  );
}
