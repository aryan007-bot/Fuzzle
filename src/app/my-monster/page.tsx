'use client';

import { useMonsterGame } from "../hooks/useMonsterGame";
import { MonsterCard } from "../components/MonsterCard";
import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function MyMonster() {
  const { connected } = useWallet();
  const { userMonster, loading, error, mintMonster } = useMonsterGame();
  const [name, setName] = useState("");
  const [minting, setMinting] = useState(false);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setMinting(true);
      await mintMonster(name);
      setName("");
    } catch (err) {
      console.error("Failed to mint:", err);
    } finally {
      setMinting(false);
    }
  };

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your wallet to view or create your monster.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        My Monster
      </h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {userMonster ? (
        <div className="max-w-md mx-auto">
          <MonsterCard monster={userMonster} />
          
          <div className="mt-8 p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Monster Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Level</span>
                <span className="font-mono">{Math.floor(userMonster.xp / 100) + 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">XP Progress</span>
                <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600"
                    style={{ width: `${(userMonster.xp % 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Battles</span>
                <span className="font-mono">0</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/50 p-8 rounded-lg backdrop-blur-sm border border-purple-500/20">
            <h2 className="text-2xl font-semibold mb-6">Mint Your Monster</h2>
            <form onSubmit={handleMint} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Monster Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white"
                  placeholder="Enter a name for your monster"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={minting || !name.trim()}
                className={`w-full py-3 px-6 text-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-colors ${
                  minting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {minting ? 'Minting...' : 'Mint Monster'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}