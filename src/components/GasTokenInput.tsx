import { ChainType } from '@/types/ChainType';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { twJoin } from 'tailwind-merge';
import { zeroAddress } from 'viem';
import { erc20ABI, useContractRead, useToken } from 'wagmi';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { AnchorLabel } from './AnchorLabel';

enum GAS_TOKEN_KIND {
  ETH = 'ETH',
  CUSTOM = 'CUSTOM',
}
const ether = { name: 'Ether', symbol: 'ETH' };

export const GasTokenInput = (props: { setTokenDecimals: Dispatch<SetStateAction<number>> }) => {
  const [{ rollupConfig, chainType }] = useDeploymentPageContext();
  const {
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  // todo: debounce? though don't think anyone will actually type it character by character
  const nativeToken = watch('nativeToken');

  const { data: nativeTokenData = ether, isError: tokenNotFound } = useToken({
    address: nativeToken === zeroAddress ? undefined : (nativeToken as `0x${string}`),
  });

  const [selectedToken, setSelectedToken] = useState(
    nativeToken === zeroAddress ? GAS_TOKEN_KIND.ETH : GAS_TOKEN_KIND.CUSTOM,
  );

  // Fetch token decimals
  const { data: tokenDecimals } = useContractRead(
    // checks if it's not ETH to avoid unnecessary calls
    nativeToken !== zeroAddress
      ? {
          address: nativeToken,
          abi: erc20ABI,
          functionName: 'decimals',
        }
      : {},
  );

  // Reset state for rollup chains incase user switches back to rollup from anytrust
  useEffect(() => {
    if (chainType === ChainType.Rollup) {
      props.setTokenDecimals(18);
      setSelectedToken(GAS_TOKEN_KIND.ETH);
      setValue('nativeToken', zeroAddress);
    }
  }, [chainType]);

  useEffect(() => {
    if (selectedToken === GAS_TOKEN_KIND.ETH || tokenDecimals === undefined) {
      props.setTokenDecimals(18);
    } else {
      props.setTokenDecimals(tokenDecimals);
    }
  }, [selectedToken, tokenDecimals]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    clearErrors('nativeToken');
    setSelectedToken(event.target.value as GAS_TOKEN_KIND);
    if (event.target.value === GAS_TOKEN_KIND.ETH) {
      setValue('nativeToken', zeroAddress);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AnchorLabel anchor="gas-token" label="Gas Token" />
      <select
        className={twJoin('w-full rounded-lg border border-[#6D6D6D] px-3 py-2 shadow-input')}
        value={selectedToken}
        onChange={handleSelectChange}
        disabled={chainType === ChainType.Rollup}
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
            (tokenNotFound || errors.nativeToken) && 'border-red-500',
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
          {tokenNotFound ? (
            <span className="text-yellow-600">
              Failed to detect a valid ERC-20 contract at the given address.
            </span>
          ) : (
            <span>
              The chain will use{' '}
              <b>
                {nativeTokenData?.name} ({nativeTokenData?.symbol})
              </b>{' '}
              as the native token for paying gas fees.
            </span>
          )}
          {errors.nativeToken && (
            <span className="text-red-500">{errors.nativeToken.message as string}</span>
          )}
        </>
      )}
    </div>
  );
};
