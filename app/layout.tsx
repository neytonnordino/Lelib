import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import Header from "./sections/Header";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700", "800"], // Pode ajustar os pesos conforme o que for usar
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
}); 

export const metadata: Metadata = {
  title: "Lelib",
  description: "The library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable} antialiased`}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
