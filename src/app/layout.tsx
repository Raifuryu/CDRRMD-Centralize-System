import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CDRRMD - Centralized System",
  description: "Generated by create next app",
};

// Assuming LayoutProps is defined/imported correctly
interface LayoutProps {
  children: React.ReactNode;
  eaDir: string; // Ensure this matches the actual definition of LayoutProps
}

export default function RootLayout({
  children,
  eaDir, // Include eaDir in the component's props
}: LayoutProps) {
  // Use LayoutProps here
  return (
    <html lang="en" dir={eaDir}>
      {/* Use eaDir to set the direction */}
      <body className={inter.className}>
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
