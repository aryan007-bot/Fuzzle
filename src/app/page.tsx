'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
// Import DndWrapper from the local components folder
import { DndWrapper } from './components/DndWrapper';

// If DndWrapper does not exist, create it at src/components/DndWrapper.tsx with the following minimal code:
// export const DndWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

// Define the types for the cauldron component's props
interface CauldronProps {
  alt: string;
  src: string;
  href: string;
}

const DraggableSpore = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'monstrum',
    item: { id: 'blue-spore' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Next/Image doesn't forward refs, so attach the drag ref to a wrapper div.
  return (
    <div
      ref={drag}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] transition-all duration-300"
      style={{ cursor: 'grab', opacity: isDragging ? 0.5 : 1 }}
    >
      <Image
        width={250}
        height={250}
        src="/images/blue_spore.svg"
        alt="Blue Spore Monstrum"
        className="animate-floating-spore drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]"
      />
    </div>
  );
};

// Use the CauldronProps interface for type safety
import { useRouter } from 'next/navigation';

function WalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<any | null>(null);
  const [showDiag, setShowDiag] = useState(false);

  useEffect(() => {
    // Restore from storage if present
    const saved = localStorage.getItem('aptos_address');
    if (saved) {
      setAddress(saved);
      setConnected(true);
    }
  }, []);

  // Listen to provider events if available (Petra / other injected wallets)
  useEffect(() => {
    const provider = (window as any).aptos || (window as any).martian || (window as any).aptosProvider;
    if (!provider || !provider.on) return;

    const handleAccountChanged = (acc: any) => {
      console.debug('wallet account event', acc);
      const addr = acc?.address || acc;
      if (addr) {
        setAddress(addr);
        setConnected(true);
        localStorage.setItem('aptos_address', addr);
      } else {
        setAddress(null);
        setConnected(false);
        localStorage.removeItem('aptos_address');
      }
    };

    const handleDisconnect = () => {
      console.debug('wallet disconnect event');
      setAddress(null);
      setConnected(false);
      localStorage.removeItem('aptos_address');
    };

    try { provider.on('accountChanged', handleAccountChanged); } catch (e) { console.debug('no accountChanged'); }
    try { provider.on('accountChange', handleAccountChanged); } catch (e) { console.debug('no accountChange'); }
    try { provider.on('disconnect', handleDisconnect); } catch (e) { console.debug('no disconnect'); }

    return () => {
      try { provider.off && provider.off('accountChanged', handleAccountChanged); } catch (e) {}
      try { provider.off && provider.off('accountChange', handleAccountChanged); } catch (e) {}
      try { provider.off && provider.off('disconnect', handleDisconnect); } catch (e) {}
    };
  }, []);

  const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const connect = async () => {
    setLastError(null);
    setProviderInfo(null);
    setShowDiag(false);

    const provider = (window as any).aptos || (window as any).martian || (window as any).aptosProvider;
    console.log('Aptos provider candidate:', provider);
    if (!provider) {
      setLastError('No injected Aptos wallet detected on window. Try installing Petra (https://petra.app) or another Aptos wallet extension.');
      setShowDiag(true);
      if (confirm('No Aptos wallet detected. Open Petra website to install?')) {
        window.open('https://petra.app', '_blank');
      }
      return;
    }

    // gather provider info for diagnostics
    try {
      const info: any = {};
      info.hasConnect = typeof provider.connect === 'function';
      info.hasAccount = typeof provider.account === 'function';
      info.hasRequest = typeof provider.request === 'function';
      info.hasDisconnect = typeof provider.disconnect === 'function';
      info.hasOn = typeof provider.on === 'function';
      info.rawKeys = Object.keys(provider).slice(0, 50);
      setProviderInfo(info);
    } catch (e) {
      console.debug('provider introspect failed', e);
      setProviderInfo({ error: String(e) });
    }

    try {
      // try common provider methods
      let addr: string | undefined | null = null;

      if (typeof provider.connect === 'function') {
        const res = await provider.connect();
        addr = res?.address || res || null;
      }

      if (!addr && typeof provider.account === 'function') {
        const acc = await provider.account();
        addr = acc?.address || acc || null;
      }

      if (!addr && typeof provider.request === 'function') {
        try {
          // some providers use request method
          const res = await provider.request({ method: 'connect' });
          addr = res?.address || res || null;
        } catch (e) {
          console.debug('provider.request connect failed', e);
        }
      }

      if (addr) {
        setAddress(addr);
        setConnected(true);
        localStorage.setItem('aptos_address', addr);
      } else {
        console.warn('No address returned from provider', provider);
        const msg = 'Wallet responded but did not return an address. Make sure the extension is unlocked and you approved the connection.';
        setLastError(msg);
        setShowDiag(true);
        // also open provider inspector for debugging
      }
    } catch (err) {
      console.error('Wallet connect failed', err);
      const msg = (err as any)?.message || String(err);
      setLastError(msg);
      setShowDiag(true);
    }
  };

  const disconnect = async () => {
    const provider = (window as any).aptos || (window as any).martian || (window as any).aptosProvider;
    try {
      if (provider?.disconnect) await provider.disconnect();
    } catch (err) {
      console.warn('Disconnect failed', err);
    }
    setAddress(null);
    setConnected(false);
    localStorage.removeItem('aptos_address');
  };

  return (
    <div className="flex items-center gap-3">
      {connected && address ? (
        <div className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-full text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 block" aria-hidden />
          <span className="font-mono text-sm">{short(address)}</span>
          <button
            onClick={disconnect}
            className="ml-2 text-sm text-white/90 bg-red-600 px-3 py-1 rounded-full hover:brightness-110"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connect}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Connect Wallet
        </button>
      )}
      {/* diagnostic panel for connect failures */}
      {lastError && (
        <div className="mt-2 px-3 py-2 text-xs rounded-md bg-black/40 border border-white/10 text-rose-200 max-w-xs">
          <div className="font-semibold">Wallet connect error</div>
          <div className="truncate">{lastError}</div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => { setShowDiag(s => !s); }} className="text-xs underline">{showDiag ? 'Hide' : 'Show'} details</button>
            <button onClick={() => { localStorage.removeItem('aptos_address'); setLastError(null); setProviderInfo(null); }} className="text-xs">Clear</button>
          </div>
          {showDiag && providerInfo && (
            <pre className="mt-2 max-h-40 overflow-auto text-xs text-left bg-black/60 p-2 rounded">{JSON.stringify(providerInfo, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

const DroppableCauldron: React.FC<CauldronProps> = ({ alt, src, href }) => {
  const router = useRouter();
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'monstrum',
    drop: (item, monitor) => {
      console.log(`A monstrum was dropped on the ${alt}!`, item);
      // Navigate to the cauldron page on drop (keeps Link for clicks)
      router.push(href);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const glowEffect = isOver 
    ? { filter: `drop-shadow(0 0 30px rgba(${alt.includes('Red') ? '239, 68, 68' : alt.includes('Blue') ? '59, 130, 246' : '34, 197, 94'}, 0.8))` }
    : {};

  return (
    <Link href={href}>
      <div ref={drop} className="col-span-1 group relative transition-transform duration-300 transform-gpu hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <Image
          width={200}
          height={200}
          src={src}
          alt={alt}
          className="mx-auto drop-shadow-xl transition-all duration-300"
          style={glowEffect}
        />
      </div>
    </Link>
  );
};

export default function Home() {
  const bgImage = '/images/sky_desktop.png';
  const appName = "Aetherium Forge";

  return (
    <DndWrapper>
      <main
        className="relative hero-center bg-cover bg-center overflow-hidden text-white"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-bg-overlay z-0" />
        <header className="absolute top-4 left-4 z-30">
          <Image
            width={72}
            height={72}
            src="/images/logo-removebg-preview.png"
            alt="Fuzzle Logo"
            className="w-18 h-18 rounded-full drop-shadow-2xl"
            aria-label="Fuzzle logo"
          />
        </header>
        {/* Wallet button top-right */}
        <div className="absolute top-4 right-4 z-40">
          <WalletButton />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl text-center px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 md:mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            {appName}
          </h1>
          <p className="text-base md:text-lg max-w-2xl text-white/90 drop-shadow-md leading-relaxed">
            Drag and drop your <span className="font-semibold">Monstrum</span> into an <span className="font-extrabold">{appName}</span> cauldron to create a new monster.
          </p>

          <div className="relative w-full max-w-md mx-auto mt-6 group">
            <Image
              width={320}
              height={320}
              src="/images/petri_dish.svg"
              alt="Petri Dish"
              className="w-full h-auto drop-shadow-2xl animate-pulse-light"
            />
            <DraggableSpore />
          </div>

          <div id="cauldrons" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 w-full max-w-3xl">
            <DroppableCauldron href="/tuffy" src="/images/red_cauldron.svg" alt="Red Cauldron" />
            <DroppableCauldron href="/fluffy" src="/images/blue_cauldron.svg" alt="Blue Cauldron" />
            <DroppableCauldron href="/green" src="/images/green_cauldron.svg" alt="Green Cauldron" />
          </div>
          
          <p className="text-center mt-8 text-sm md:text-base max-w-lg drop-shadow-md text-white/85">
            Spawn, maintain, trade & collect all 100 monsters in the collection.
          </p>
        </div>
      </main>
    </DndWrapper>
  );
}