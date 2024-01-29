import { ChainType } from '@/types/ChainType';
import { ChangeEvent, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';
import { zeroAddress } from 'viem';
import { useToken } from 'wagmi';
import { useDeploymentPageContext } from './DeploymentPageContext';

enum GAS_TOKEN_KIND {
  ETH = 'ETH',
  CUSTOM = 'CUSTOM',
}
const ether = { name: 'Ether', symbol: 'ETH' };

export const GasTokenInput = () => {
  const [{ rollupConfig, chainType }] = useDeploymentPageContext();
  const { register, setValue, watch } = useFormContext();

  // todo: debounce? though don't think anyone will actually type it character by character
  const nativeToken = watch('nativeToken');

  const { data: nativeTokenData = ether, isError: nativeTokenIsError } = useToken({
    address: nativeToken === zeroAddress ? undefined : (nativeToken as `0x${string}`),
  });

  const [selectedToken, setSelectedToken] = useState(
    nativeToken === zeroAddress ? GAS_TOKEN_KIND.ETH : GAS_TOKEN_KIND.CUSTOM,
  );

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value as GAS_TOKEN_KIND);
    if (event.target.value === GAS_TOKEN_KIND.ETH) {
      setValue('nativeToken', zeroAddress);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold">Gas Token</label>
      <select
        className={twJoin('w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input')}
        value={selectedToken}
        onChange={handleSelectChange}
      >
        <option value={GAS_TOKEN_KIND.ETH}>ETH</option>
        <option value={GAS_TOKEN_KIND.CUSTOM}>Custom</option>
      </select>
      {selectedToken === GAS_TOKEN_KIND.CUSTOM && (
        <input
          {...register('nativeToken')}
          defaultValue={rollupConfig?.nativeToken || ''}
          disabled={chainType === ChainType.Rollup}
          className={twJoin(
            'w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input',
            nativeTokenIsError && 'border-red-500',
            chainType === ChainType.Rollup && 'cursor-not-allowed bg-gray-200 opacity-50',
          )}
        />
      )}
      {chainType === ChainType.Rollup && (
        <span className="text-sm text-zinc-500">
          Only AnyTrust chains support custom Native Tokens
        </span>
      )}
      {chainType === ChainType.AnyTrust && (
        <>
          {nativeTokenIsError ? (
            <span className="text-yellow-600">
              Failed to detect a valid ERC-20 contract at the given address.
            </span>
          ) : (
            <span>
              The chain will use{' '}
              <b>
                {nativeTokenData.name} ({nativeTokenData.symbol})
              </b>{' '}
              as the native token for paying gas fees.
            </span>
          )}
        </>
      )}
    </div>
  );
};
