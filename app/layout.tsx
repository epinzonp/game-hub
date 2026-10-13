import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import CastleBackground from "./components/CastleBackground";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GAMEHUB | Juegos casuales para jugar en familia",
    template: "%s | GAMEHUB",
  },
  applicationName: "GAMEHUB",
  description:
    "Descubre juegos casuales para jugar, competir y divertirte en familia.",
  openGraph: {
    title: "GAMEHUB",
    description:
      "Descubre juegos casuales para jugar, competir y divertirte en familia.",
    siteName: "GAMEHUB",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GAMEHUB",
    description:
      "Descubre juegos casuales para jugar, competir y divertirte en familia.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="relative isolate h-full overflow-auto bg-[#1a1033]">
        <CastleBackground />
        <div className="relative z-10 flex min-h-full">{children}</div>
      </body>
    </html>
  );
}
