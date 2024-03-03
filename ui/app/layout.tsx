import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import FooterNav from "./components/FooterNav";

const oldComputer = localFont({ src: "./fonts/old_computer.woff" });
const vintageClass = "blur-[0.04cap]";

export const metadata: Metadata = {
  title: "Awareness",
  description: "for y'r health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`overscroll-none ${oldComputer.className} ${vintageClass}`}
      >
        {children}
        <FooterNav />
      </body>
    </html>
  );
}
