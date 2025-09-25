import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import { Providers } from './providers';
import WalletConnect from '@/app/components/WalletConnect';
 // ✅ cleaner import

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'MojoMonster Battles',
  description: 'Mint, Battle, and Trade unique monsters on the Aptos blockchain',
  icons: {
    icon: '/images/logo-removebg-preview.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className="font-sans bg-gray-900 text-white min-h-screen">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow pt-6">
              {children}
            </main>

            {/* Floating WalletConnect on every page */}
            <div className="fixed bottom-6 right-6 z-50">
              <WalletConnect />
            </div>

            <footer className="bg-gray-900 border-t border-gray-800">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} MojoMonster Battles. Built on{' '}
                  <a 
                    href="https://aptoslabs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Aptos
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
