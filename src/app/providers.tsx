'use client';

import { useEffect, useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onError = (error: any) => {
    console.error('Wallet Error:', error);
    try {
      if (error?.name === 'PetraApiError') {
        if ((error?.message || '').toLowerCase().includes('not installed')) {
          window.open('https://petra.app', '_blank');
        } else if ((error?.message || '').toLowerCase().includes('unlock')) {
          console.log('Please unlock your Petra wallet');
        }
      }
    } catch (e) {
      // swallow
    }
  };

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      onError={onError}
      // optInWallets lets you prefer certain standard wallets (AIP-62)
      optInWallets={["Petra"]}
    >
      {/* Prevent hydration mismatch by only rendering when mounted */}
      {mounted ? children : null}
    </AptosWalletAdapterProvider>
  );
}