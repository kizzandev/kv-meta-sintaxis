import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/components/Topbar";

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KV Meta Sintaxis",
  description:
    "KV Meta Syntaxis is an interactive web tool for creating, analyzing, and\
    visualizing custom programming language grammars. Define rules in a clear\
    meta-syntax format, view automatic railroad diagrams, detect recursion or\
    unreachable rules, and generate example pseudo code instantly.",
  keywords:
    "meta syntax, grammar editor, syntax visualization, railroad\
    diagrams, parser generator, language design, pseudo code generator,\
    rule analysis, formal grammar, syntax tool",
  authors: [{ name: "Kevin Zanzi" }],
  openGraph: {
    title: "KV Meta Sintaxis",
    description:
      "Design and explore grammars visually. Analyze, simulate, and generate pseudo code from your own meta syntax.",
    type: "website",
    url: "https://kvms.vercel.app/",
  },
  twitter: {
    title: "KV Meta Sintaxis",
    description: "Design and analyze your own meta syntax.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} mx-[20px] mb-[20px] h-screen overflow-hidden antialiased`}
      >
        <Header></Header>
        <main className="flex h-full max-h-[90svh] flex-row text-gray-200">
          {children}
        </main>
      </body>
    </html>
  );
}
