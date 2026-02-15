import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YouGames - Crea i Tuoi Giochi! 🎮',
  description: 'Piattaforma per bambini per creare giochi meravigliosi con l\'intelligenza artificiale',
  keywords: 'giochi, bambini, educazione, creatività, coding',
  authors: [{ name: 'YouGames Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
