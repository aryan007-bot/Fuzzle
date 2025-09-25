'use client';

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import { Monster } from "../types/game";

export function useMonsterGame() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [userMonster, setUserMonster] = useState<Monster | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's monster if they have one
  useEffect(() => {
    if (account?.address) {
      fetchUserMonster(account.address.toString());
    }
  }, [account?.address]);

  const fetchUserMonster = async (address: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual contract call to fetch monster
      // This is a mock implementation
      const response = await fetch(`/api/monsters/${address}`);
      if (response.ok) {
        const monster = await response.json();
        setUserMonster(monster);
      }
    } catch (err) {
      setError('Failed to fetch monster');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mintMonster = async (name: string) => {
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      const payload = {
        data: {
          type: "entry_function_payload",
          // Fully qualified function: <ADDRESS>::<module>::<function>
          function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::mojomonster::monster::mint_monster`,
          type_arguments: [],
          arguments: [name],
        },
      };

      const response = await signAndSubmitTransaction(payload as any);
      // Wait for transaction confirmation
      // TODO: Add transaction status checking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh monster data
      await fetchUserMonster(account.address.toString());
      
      return response;
    } catch (err) {
      setError('Failed to mint monster');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBattle = async (betAmount: number) => {
    if (!account?.address || !userMonster) {
      throw new Error('Wallet not connected or no monster owned');
    }

    try {
      setLoading(true);
      const payload = {
        data: {
          type: "entry_function_payload",
          function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::mojomonster::battle::create_battle`,
          type_arguments: [],
          arguments: [userMonster.id, betAmount.toString()],
        },
      };

      const response = await signAndSubmitTransaction(payload as any);
      return response;
    } catch (err) {
      setError('Failed to create battle');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinBattle = async (battleId: string) => {
    if (!account?.address || !userMonster) {
      throw new Error('Wallet not connected or no monster owned');
    }

    try {
      setLoading(true);
      const payload = {
        data: {
          type: "entry_function_payload",
          function: `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}::mojomonster::battle::join_battle`,
          type_arguments: [],
          arguments: [battleId, userMonster.id],
        },
      };

      const response = await signAndSubmitTransaction(payload as any);
      return response;
    } catch (err) {
      setError('Failed to join battle');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userMonster,
    loading,
    error,
    mintMonster,
    createBattle,
    joinBattle
  };
}