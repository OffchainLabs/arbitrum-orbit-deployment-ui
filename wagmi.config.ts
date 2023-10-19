import { fetch } from '@wagmi/cli/plugins';

import { ChainId } from '@/types/ChainId';
import { fetchAbi, getRequestUrl } from '@/utils/fetchAbi';

type ContractConfig = {
  name: string;
  address: Record<ChainId, `0x${string}`>;
};

const rollupCreatorContractConfig: ContractConfig = {
  name: 'RollupCreator',
  address: {
    [ChainId.ArbitrumGoerli]: '0xA7a3e192086518e39E389B9C719467D4605ECA92',
    [ChainId.ArbitrumSepolia]: '0x7BF720af84D88b0319eb446aDf3f9F6E2453e9ca',
  },
};

function allEqual<T>(array: T[]) {
  return array.every((value) => value === array[0]);
}

export async function assertContractsMatch(contract: { address: Record<number, `0x${string}`> }) {
  const abis = await Promise.all(
    Object.entries(contract.address)
      // fetch abis for all chains
      .map(([chainId, address]) => fetchAbi(Number(chainId), address)),
  );

  // make sure all abis are the same
  if (!allEqual(abis.map((abi) => JSON.stringify(abi)))) {
    throw new Error(`ABIs don't match`);
  }

  console.log('Contracts match.');
}

export default async function () {
  await assertContractsMatch(rollupCreatorContractConfig);

  // since we made sure that all contracts have same abis, it doesn't really matter which one we choose
  const chainId = ChainId.ArbitrumGoerli;
  const address = rollupCreatorContractConfig.address[chainId];

  function request() {
    return { url: getRequestUrl(chainId, address) };
  }

  return {
    out: 'src/generated.ts',
    plugins: [
      fetch({
        request,
        contracts: [rollupCreatorContractConfig],
        cacheDuration: 0,
      }),
    ],
  };
}
