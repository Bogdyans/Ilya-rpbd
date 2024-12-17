import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/app/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Auth App',
  description: 'Basic authentication app with Next.js',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className={`${inter.className} h-screen flex-col bg-emerald-50 items-center`}>
      <AuthProvider>{children}</AuthProvider>
      </body>
      </html>
  )
}

