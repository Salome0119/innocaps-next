import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innocaps Lab - Nanoencapsulación y Biotecnología",
  description: "Innocaps Lab - Nanotecnología",
  icons: { icon: [{ url: "/logo.svg", type: "image/svg+xml" }] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-white antialiased">{children}</body>
    </html>
  );
}
