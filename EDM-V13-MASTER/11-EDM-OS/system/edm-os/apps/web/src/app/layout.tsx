import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "EDM OS — Construction Operating System",
  description: "The operating system for EDM Holdings.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
      </head>
      <body>{children}</body>
    </html>
  );
}
