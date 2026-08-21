import type { Metadata, Viewport } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";

const display = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Capanair",
    template: "%s | Capanair",
  },
  description: "Tu aerolínea para esta edición del Capafest.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B2545",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-sky-light text-navy-800 antialiased font-sans">{children}</body>
    </html>
  );
}
