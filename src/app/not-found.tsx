import type { Metadata } from "next";
import SynthesisInProgress from "@/components/SynthesisInProgress";

export const metadata: Metadata = {
  title: "404 — Síntesis en Proceso | Innocaps Lab",
};

export default function NotFound() {
  return <SynthesisInProgress is404={true} variant={2} />;
}
