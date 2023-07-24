import { Dispatch, createContext, useContext, useEffect, useReducer } from 'react';

import { RollupConfig } from '@/components/RollupConfigInput';
import { BatchPoster, RollupContracts, Validator } from '@/types/RollupContracts';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { StepMap, useStep } from '@/hooks/useStep';

type DeploymentPageContextState = {
  rollupContracts?: RollupContracts;
  rollupConfig?: RollupConfig;
  validators?: Validator[];
  batchPoster?: BatchPoster;
};

const defaultRollupConfig: RollupConfig = {
  confirmPeriodBlocks: 150,
  stakeToken: ethers.constants.AddressZero,
  baseStake: '0.1',
  owner: '',
  extraChallengeTimeBlocks: 0,
  // Needs to be changed after PR by Lee about new Wasm root
  wasmModuleRoot: '0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21',
  loserStakeEscrow: ethers.constants.AddressZero,
  chainId: Math.floor(Math.random() * 100000000000) + 1,
  chainName: 'My Arbitrum L3 Chain',
  chainConfig: ethers.constants.HashZero,
  genesisBlockNum: 0,
  sequencerInboxMaxTimeVariation: {
    delayBlocks: 5760,
    futureBlocks: 48,
    delaySeconds: 86400,
    futureSeconds: 3600,
  },
};

function getDefaultRollupConfig(owner: string = '') {
  return { ...defaultRollupConfig, owner };
}

const deploymentPageContextStateDefaultValue: DeploymentPageContextState = {
  rollupConfig: defaultRollupConfig,
  rollupContracts: undefined,
  validators: undefined,
  batchPoster: undefined,
};

function getDeploymentPageContextStateInitialValue(): DeploymentPageContextState {
  if (typeof window === 'undefined') {
    return deploymentPageContextStateDefaultValue;
  }

  const stateInLocalStorage = localStorage.getItem('arbitrum:orbit:state');

  if (stateInLocalStorage === null) {
    return deploymentPageContextStateDefaultValue;
  }

  return JSON.parse(stateInLocalStorage);
}

type DeploymentPageContextAction =
  | { type: 'set_rollup_contracts'; payload: RollupContracts }
  | { type: 'set_rollup_config'; payload: RollupConfig }
  | { type: 'set_validators'; payload: Validator[] }
  | { type: 'set_batch_poster'; payload: BatchPoster }
  | { type: 'reset'; payload: string };

type DeploymentPageContextValue = [
  DeploymentPageContextState,
  Dispatch<DeploymentPageContextAction>,
];

export const DeploymentPageContext = createContext<DeploymentPageContextValue>([
  getDeploymentPageContextStateInitialValue(),
  () => {},
]);

function reducer(
  state: DeploymentPageContextState,
  action: DeploymentPageContextAction,
): DeploymentPageContextState {
  switch (action.type) {
    case 'set_rollup_contracts':
      return { ...state, rollupContracts: action.payload };

    case 'set_rollup_config':
      return { ...state, rollupConfig: action.payload };

    case 'set_validators':
      return { ...state, validators: action.payload };

    case 'set_batch_poster':
      return { ...state, batchPoster: action.payload };

    case 'reset':
      return {
        ...deploymentPageContextStateDefaultValue,
        rollupConfig: getDefaultRollupConfig(action.payload),
      };

    default:
      return state;
  }
}

export function DeploymentPageContextProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { isValidStep, goToStep } = useStep();
  const [state, dispatch] = useReducer(reducer, address, (address) => ({
    ...getDeploymentPageContextStateInitialValue(),
    rollupConfig: getDefaultRollupConfig(address),
  }));

  useEffect(() => {
    localStorage.setItem('arbitrum:orbit:state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!isValidStep) {
      goToStep(StepMap.RollupDeploymentConfiguration);
    }
  }, [isValidStep]);

  return (
    <DeploymentPageContext.Provider value={[state, dispatch]}>
      {children}
    </DeploymentPageContext.Provider>
  );
}

export function useDeploymentPageContext() {
  return useContext(DeploymentPageContext);
}
