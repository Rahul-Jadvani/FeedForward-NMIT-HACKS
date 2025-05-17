
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { mainnet, polygon, base, baseSepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a Wagmi config with Base Sepolia testnet
const config = createConfig({
  chains: [baseSepolia, base, mainnet, polygon],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
});

const { wallets } = getDefaultWallets({
  appName: 'FeedForward',
  projectId: 'ff683129afcdbb121a43dbb9786c86de', // WalletConnect Project ID
});

// Create a React-Query client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={baseSepolia}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
