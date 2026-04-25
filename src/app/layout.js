import "./globals.css";
import { DM_Sans, DM_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";

// ── Font Configuration ──
// We keep DM Sans as the primary for its modern, clean curves.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "700", "800"], // Added 800 for extra-bold premium headers
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

// ── SEO & Meta Strategy ──
export const metadata = {
  title: {
    template: '%s | VeriX Cloud',
    default: 'VeriX Cloud - Modern Identity Infrastructure',
  },
  description: 'High-fidelity identity verification and biometric document management.',
  icons: {
    icon: '/favicon.ico', // Ensure this is present for brand consistency
  }
};

// ── Viewport Hardening (Next.js 14.2+) ──
export const viewport = {
  // Theme color updated to Alice Blue (#EDF6F9) for mobile browser chrome integration
  themeColor: '#EDF6F9', 
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Senior Tip: Using '1' for maximum-scale is an accessibility anti-pattern
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body 
        className={`
          min-h-screen font-sans
          bg-[var(--bg-base)] text-[var(--text-primary)]
          selection:bg-[var(--accent-soft)] selection:text-[var(--accent-primary)]
        `}
      >
        <AuthProvider>
          {/* LayoutWrapper is the 'Conductor' of the UI.
            We remove the nested <main> here because LayoutWrapper 
            already provides a semantic <main> with scrolling logic.
          */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}