import type { Metadata } from 'next'
import { AuthProvider } from '../../../contexts/AuthContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobLander - AI-Powered Resume Builder',
  description: 'Create professional resumes with AI assistance and find your dream job',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
