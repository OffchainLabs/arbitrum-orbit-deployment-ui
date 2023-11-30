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
    [ChainId.ArbitrumSepolia]: '0x06E341073b2749e0Bb9912461351f716DeCDa9b0',
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
  const chainId = ChainId.ArbitrumSepolia;
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
