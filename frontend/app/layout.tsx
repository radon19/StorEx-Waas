import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "StorEx",
  description: "Solana-native trading terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <Providers>
        <body className="min-h-full flex flex-col">
          <Header />
          {children}
        </body>
      </Providers>
    </html>
  );
}