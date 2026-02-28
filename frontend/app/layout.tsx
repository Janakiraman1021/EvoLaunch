'use client';

import { Outfit } from 'next/font/google'
import './globals.css'
import Sidebar from '../components/Sidebar'
import AISidebar from '../components/AISidebar'
import Header from '../components/Header'
import SparklingParticles from '../components/SparklingParticles'
import ModeSelector from '../components/ModeSelector'
import { usePathname } from 'next/navigation'
import Head from 'next/head' // <-- Add this import
import { useMode } from '../lib/hooks/useMode'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

// REMOVE the metadata export here

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isLanding = pathname === '/' || pathname === '/landing';
    const { mode, setMode, isInitialized } = useMode();

    return (
        <html lang="en" className={`${outfit.variable}`}>
            <Head>
                <title>EvoLaunch</title>
                <meta name="description" content="The future of web development" />
                {/* Add other meta tags as needed */}
            </Head>
            <body className="flex h-screen overflow-hidden bg-background text-primary font-body antialiased">
                <ModeSelector isOpen={isInitialized && mode === null && !isLanding} onSelect={setMode} />
                {!isLanding && mode !== 'ai' && <Sidebar onSwitchMode={() => setMode(null)} />}
                {!isLanding && mode === 'ai' && <AISidebar onSwitchMode={() => setMode(null)} />}
                <main className={`flex-1 ${isLanding ? 'ml-0 p-0' : 'ml-40 p-12'} h-screen overflow-y-auto relative scroll-smooth overflow-x-hidden`}>
                    {/* Institutional Background Elements */}
                    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
                        <div className="absolute inset-0 neural-grid opacity-20" />
                        <SparklingParticles />
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full animate-gold-pulse" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full animate-gold-pulse" style={{ animationDelay: '4s' }} />
                        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-gold/3 blur-[120px] rounded-full animate-gold-pulse" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className={`${isLanding ? '' : 'max-w-7xl mx-auto'} relative z-10`}>
                        {!isLanding && <Header />}
                        <div className="fade-in">
                            {children}
                        </div>
                    </div>
                </main>
            </body>
        </html>
    )
}
