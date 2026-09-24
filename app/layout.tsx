import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polytechs · Espace QSE",
  description: "Pilotage qualité, sécurité et environnement.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
