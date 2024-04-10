import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { MenuItem } from '@offchainlabs/cobalt';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CustomAvatar } from './CustomAvatar';

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

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
          >
            {(() => {
              if (!connected) {
                return (
                  <MenuItem
                    title="Connect Wallet"
                    onClick={openConnectModal}
                    Icon={<PlusCircleIcon className="h-[24px] w-[24px] stroke-1" />}
                    className="border-lime-dark bg-lime-dark py-3"
                  />
                );
              }

              return (
                <div className="flex flex-col justify-start gap-4">
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="flex gap-3 px-2 py-1 text-left"
                  >
                    {account.ensAvatar ? (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={account.ensAvatar}
                        style={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <CustomAvatar size={24} address={account.address} />
                    )}
                    {account.ensName || account.displayName || account.address}
                  </button>
                  {chain.unsupported ? (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="w-full rounded-md bg-[#762716] px-2 py-1 text-left text-white"
                    >
                      <div className="flex items-center gap-2">
                        <img src="/CircleWarning.svg" style={{ width: 24, height: 24 }} />
                        <div className="flex flex-col justify-start gap-2">
                          <span className="font-medium">Wrong network</span>
                          <span className="text-xs">Please change your network in your wallet</span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button onClick={openChainModal} className="flex gap-3 px-2 py-1" type="button">
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                          className="flex items-center justify-center"
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 24, height: 24 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
