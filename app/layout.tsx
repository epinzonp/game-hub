import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CastleBackground from "./components/CastleBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Ahorcado",
  description: "Adivina la palabra antes de que el muñeco caiga en la lava",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative isolate h-full overflow-auto bg-[#1a1033]">
        <CastleBackground />
        <main className="relative z-10 flex min-h-full">{children}</main>
      </body>
    </html>
  );
}
