import type { Metadata } from "next";
import localFont from "next/font/local";
import TRPCProvider from "./components/core/trpc-provider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PC Builder Admin",
  description:
    "Admin dashboard for PC Builder platform - Manage components, products, and configurations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
