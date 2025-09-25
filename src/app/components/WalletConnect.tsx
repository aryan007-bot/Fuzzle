'use client';

import React from 'react';
import WalletButton from './WalletButton'; // fixed

export default function WalletConnect() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <WalletButton />
    </div>
  );
}
