import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kafunparapara.vercel.app"),
  title: "KAFUN PARAPARA - 花粉パラパラ",
  description: "ギャルが花粉の発生源。花粉トラッキングサイト。",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "KAFUN PARAPARA - 花粉パラパラ",
    description: "ギャルが花粉の発生源。花粉トラッキングサイト。",
    images: ["/ogp.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAFUN PARAPARA - 花粉パラパラ",
    description: "ギャルが花粉の発生源。花粉トラッキングサイト。",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Noto+Serif+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
