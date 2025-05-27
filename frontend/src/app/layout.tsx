import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Document Chat App',
  description: 'Chat with your documents using AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-background min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  )
}
