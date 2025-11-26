import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Form Guardian - Next.js Examples',
  description: 'Examples of form-guardian with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

