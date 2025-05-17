
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className="flex items-center gap-2"
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="gradient" 
                    size="sm"
                    className="animate-pulse-glow shadow-ff-blue/30 border border-ff-blue/30 backdrop-blur-sm"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="glass-card flex items-center gap-1 px-3 py-1 h-9 border-ff-blue/30"
                  >
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="gradient"
                    className="flex items-center gap-1 px-3 py-1 h-9"
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
