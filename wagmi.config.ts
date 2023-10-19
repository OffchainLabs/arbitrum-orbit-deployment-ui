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
    [ChainId.ArbitrumGoerli]: '0xB3f62C1c92D5224d0EC3A8d1efc8a44495B12BEc',
    [ChainId.ArbitrumSepolia]: '0x8f6C1B4d75fA3a0D43ca750F308b1F3DDA8d92F7',
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
