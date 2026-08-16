import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingActions from "@/components/layout/floating-actions";

/**
 * NOTE: This project is designed to use "Fraunces" (display) and
 * "Plus Jakarta Sans" (body) via next/font/google. In this build
 * sandbox, outbound requests to fonts.googleapis.com are blocked,
 * so next/font is swapped for a CSS @font-face import in globals.css
 * that pulls the same two families. On Vercel / any normal host with
 * open internet access, you can freely switch back to next/font/google:
 *
 *   import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
 *   const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
 *   const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
 *   // then add `${fraunces.variable} ${jakarta.variable}` to the body className below.
 */

export const metadata: Metadata = {
  title: "Zayith Academy — Learn • Create • Inspire",
  description:
    "Zayith Academy is a premium art academy offering foundation to professional art training, workshops, an art store and community events for every age and skill level.",
  keywords: ["art academy", "art classes", "drawing classes", "painting classes", "Zayith Academy", "art workshop"],
  openGraph: {
    title: "Zayith Academy — Learn • Create • Inspire",
    description: "Professional art training for every age and skill level.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body overflow-x-hidden">
        <ThemeProvider>
          <Navbar />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
          <FloatingActions />
        </ThemeProvider>
      </body>
    </html>
  );
}