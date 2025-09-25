'use client';
import { useState, useEffect } from 'react';

export default function WalletConnect() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortenAddress = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  const getPetra = () => {
    if ('aptos' in window) return (window as any).aptos;
    else {
      window.open('https://petra.app/', '_blank');
      return null;
    }
  };

  const connectWallet = async () => {
    setConnecting(true);
    setError(null);
    const wallet = getPetra();
    if (!wallet) return setConnecting(false);

    try {
      const res = await wallet.connect();
      setAccount(res.address);
      setConnected(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    const wallet = getPetra();
    if (!wallet) return;
    try {
      await wallet.disconnect();
      setConnected(false);
      setAccount(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to disconnect');
    }
  };

  // Auto-detect connection
  useEffect(() => {
    const wallet = getPetra();
    if (!wallet) return;
    wallet.onAccountChange?.((acc: any) => {
      if (acc) {
        setAccount(acc.address);
        setConnected(true);
      } else {
        setAccount(null);
        setConnected(false);
      }
    });
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {connected && account ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 font-mono">{shortenAddress(account)}</span>
          <button
            onClick={disconnectWallet}
            className="bg-red-600/90 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700/90 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className={`px-4 py-2 bg-green-500 rounded-full text-sm font-semibold text-white hover:bg-green-600 transition-all duration-200 ${
            connecting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {connecting ? 'Connecting...' : 'Connect Petra'}
        </button>
      )}
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
