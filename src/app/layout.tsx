import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "LolosRemote — Cek Kecocokan CV dengan Lowongan Remote dalam Hitungan Detik",
    template: "%s | LolosRemote",
  },
  description:
    "Alat gratis berbasis AI untuk mengecek kecocokan CV Anda dengan lowongan kerja remote, lengkap dengan skor 0-100 dan tracker lamaran pribadi. Tanpa daftar akun.",
  applicationName: "LolosRemote",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "LolosRemote",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster position="top-center" richColors closeButton offset={116} mobileOffset={{ top: 112 }} />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
