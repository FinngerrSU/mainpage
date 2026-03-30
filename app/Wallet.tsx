'use client';

import { ConnectButton,useCurrentAccount } from "@mysten/dapp-kit-react";

export default function ConnectWalletBtn() {
    const account = useCurrentAccount();

    // 1. DISCONNECTED STATE (Solid Dark Button)
    if (!account) {
        return (
          
            <ConnectButton
                
                className="bg-gray-900! text-white! font-bold! text-sm! rounded-xl! border-none! px-4! py-2! hover:bg-gray-800! hover:-translate-y-0.5! transition-all! shadow-sm!"
            >
            Connect 
            </ConnectButton>
            
        );
    }

    // 2. CONNECTED STATE (Light Pill with Dropdown Menu)
    return (
        <ConnectButton
            className="bg-white! text-gray-900! font-bold! text-sm! rounded-xl! border! border-gray-200! px-4! py-2! hover:bg-gray-50! transition-all! shadow-sm! flex! items-center! gap-2!"
        />
    );
}