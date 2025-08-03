"use client";

import { usePathname } from "next/navigation";
import Header from "../sections/Header";

export default function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isSignInPage = pathname === "/signin";

  return (
    <>
      {!isSignInPage && <Header />}
      {children}
    </>
  );
} 