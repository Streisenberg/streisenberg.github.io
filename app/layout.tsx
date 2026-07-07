import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Enes Dasdemir | Computational Biologist",
    template: "%s | Enes Dasdemir",
  },
  description:
    "Enes Dasdemir - Computational Biologist specializing in spatial multi-omics, bone marrow biology, and AML research. An immersive 3D portfolio journey from Istanbul to Houston.",
  keywords: [
    "Enes Dasdemir",
    "spatial multi-omics",
    "single-cell RNA-seq",
    "bone marrow",
    "AML",
    "computational biology",
    "bioinformatics",
    "MD Anderson",
  ],
  authors: [{ name: "Enes Dasdemir" }],
  openGraph: {
    title: "Enes Dasdemir | Computational Biologist",
    description: "An immersive 3D portfolio journey through spatial biology research",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

