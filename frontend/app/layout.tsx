'use client';

import './globals.css'
import Navigation from '@/components/Navigation'

// Note: Metadata only works in server components, moved to individual pages

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-white">
                <Navigation />
                {children}
            </body>
        </html>
    )
}
