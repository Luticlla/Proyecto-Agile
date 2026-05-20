import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer  from "@/components/Footer";
import { AuthProvider } from "@/hooks";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-arcade'
});

export const metadata: Metadata = {
  title: { template: "%s | Full Forma", default: "Full Forma | GYM Peruano" },
  description: "Full Forma, El gym que te pondra en forma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable, pressStart2P.variable)}>
      <body className="font-poppins antialiased bg-black">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

