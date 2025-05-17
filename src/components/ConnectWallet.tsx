
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
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
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
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-theme-green to-theme-purple text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
                    className="flex items-center gap-1 px-2 py-1 h-9 bg-transparent-black/30 backdrop-blur-md border-theme-accent/70 text-theme-blue hover:bg-theme-accent/20 rounded-full"
                  >
                    {chain.name}
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-1 h-9 bg-transparent-black/30 backdrop-blur-md border-theme-green/70 text-theme-green hover:bg-theme-green/20 rounded-full"
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
