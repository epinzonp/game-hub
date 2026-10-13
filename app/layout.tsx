import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://game-hub-epinzonp.vercel.app"),
  title: {
    default: "GAMEHUB | Juegos casuales para jugar en familia",
    template: "%s | GAMEHUB",
  },
  applicationName: "GAMEHUB",
  description:
    "Descubre juegos casuales para jugar, competir y divertirte en familia.",
  openGraph: {
    title: "GAMEHUB | Juegos casuales para jugar en familia",
    description:
      "Descubre juegos casuales para jugar, competir y divertirte en familia.",
    siteName: "GAMEHUB",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "GAME HUB: juegos casuales con Fox Pilot y 67 Phantom.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GAMEHUB | Juegos casuales para jugar en familia",
    description:
      "Descubre juegos casuales para jugar, competir y divertirte en familia.",
    images: [
      {
        url: "/social-card.png",
        alt: "GAME HUB: juegos casuales con Fox Pilot y 67 Phantom.",
      },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "bg-[#180e13]",
        "antialiased",
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="relative isolate h-full overflow-auto bg-[#180e13]">
        <ConvexClientProvider>
          <div className="relative z-10 flex min-h-full">{children}</div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
