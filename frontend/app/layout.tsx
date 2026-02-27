'use client';

import './globals.css'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { usePathname } from 'next/navigation'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isLanding = pathname === '/landing';

    return (
        <html lang="en">
            <body className="flex h-screen overflow-hidden bg-background text-primary font-body antialiased selection:bg-gold/30">
                {!isLanding && <Sidebar />}
                <main className={`flex-1 ${isLanding ? 'ml-0' : 'ml-20'} h-screen overflow-y-auto p-12 relative scroll-smooth overflow-x-hidden`}>
                    {/* Institutional Background Elements */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
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
