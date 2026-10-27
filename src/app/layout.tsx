import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { SITE } from "@/content/site";
import { copy } from "@/content/copy";
import "./globals.css";

// SSR renders Indonesian (the default); metadata matches it. The client updates the title per language.
const meta = copy.id.meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: meta.title,
  description: meta.description,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    title: meta.title,
    description: meta.description,
    siteName: SITE.name,
    locale: "id_ID",
    alternateLocale: ["en_US", "ar_AR"],
  },
  twitter: { card: "summary", title: meta.title, description: meta.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#001233",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang/dir are updated on the client when the language changes.
    <html lang="id" dir="ltr" className={fontVariables} suppressHydrationWarning>
      <body>
        <noscript>
          <style>{`[style*="opacity: 0"],[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
