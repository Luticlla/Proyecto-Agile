import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Press_Start_2P } from "next/font/google";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/hooks";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-arcade'
});

export const metadata: Metadata = {
  title: { template: "%s | FULLFORMA", default: "FULLFORMA | GYM Peruano" },
  description: "FULLFORMA, El gym que te pondra en forma",
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
