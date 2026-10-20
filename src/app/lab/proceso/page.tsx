import type { Metadata } from "next";
import { Header } from "@/components/Header";
import ProcessTimeline from "@/components/ProcessTimeline";

export const metadata: Metadata = { title: "Proceso — Innocaps Lab" };

export default function Page() {
  return (
    <>
      <Header />
      <ProcessTimeline />
    </>
  );
}
