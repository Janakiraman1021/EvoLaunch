'use client';

import { Outfit, Playfair_Display } from 'next/font/google'
import './globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { usePathname } from 'next/navigation'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  style: ['italic', 'normal'],
  variable: '--font-playfair',
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isLanding = pathname === '/landing';

    return (
        <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
            <body className="flex h-screen overflow-hidden bg-background text-primary font-body antialiased selection:bg-gold/30">
<<<<<<< HEAD
                <Sidebar />
                <main className="flex-1 ml-0 md:ml-80 h-screen overflow-y-auto p-6 md:p-12 relative scroll-smooth overflow-x-hidden">
=======
                {!isLanding && <Sidebar />}
                <main className={`flex-1 ${isLanding ? 'ml-0' : 'ml-20'} h-screen overflow-y-auto p-12 relative scroll-smooth overflow-x-hidden`}>
>>>>>>> c8590694f42c58dad44aa70e08be20974f5ec649
                    {/* Institutional Background Elements */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                        <div className="absolute inset-0 neural-grid opacity-20" />
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full animate-gold-pulse" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full animate-gold-pulse" style={{ animationDelay: '4s' }} />
                        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-gold/3 blur-[120px] rounded-full animate-gold-pulse" style={{ animationDelay: '2s' }} />
                    </div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                      <Header />
                      <div className="fade-in">
                        {children}
                      </div>
                    </div>
                </main>
            </body>
        </html>
    )
}
