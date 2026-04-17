import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hall Pass - High School Life Simulator",
  description: "Navigate high school as your chosen archetype. Build relationships, customize your room, and shape your story.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
