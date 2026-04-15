import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reserva Latina",
  description: "SaaS modular para reservas y operación de restaurantes latinos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`light ${manrope.variable} ${inter.variable} h-full antialiased`}>
      < body className="min-h-full flex flex-col bg-background text-on-background font-sans overflow-x-hidden selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
