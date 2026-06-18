import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",       // body font — swap is fine
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "block",      // display font — block prevents FOUT during reveals
  // Preload the weights we actually use:
  // font-light (300), font-normal (400), italic variants
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Dearly — Turn emotions into experiences",
  description:
    "Transform raw emotions, memories, and thoughts into cinematic, shareable web experiences.",
  openGraph: {
    title: "Dearly",
    description: "Turn emotions into experiences.",
    type: "website",
  },
  // Prevent mobile browsers from scaling text
  // Protects typography hierarchy on small viewports
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  )
}