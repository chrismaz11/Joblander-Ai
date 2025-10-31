import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobLander - AI-Powered Job Application Platform",
  description: "Build professional resumes, track applications, and land your dream job.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
