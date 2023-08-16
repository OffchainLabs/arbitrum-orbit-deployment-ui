'use client';
import { ConfigWallet, RollupContracts, Validator } from '@/types/RollupContracts';
import { RollupStepMap } from '@/types/Steps';
import { RollupConfig } from '@/types/rollupConfigDataType';
import {
  Dispatch,
  RefObject,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { useAccount } from 'wagmi';
import { useStep } from '@/hooks/useStep';
import { ChainType } from '@/types/ChainType';
import { RollupConfigFormValues } from './RollupConfigInput';

type DeploymentPageContextState = {
  rollupContracts?: RollupContracts;
  rollupConfig: RollupConfig;
  validators?: Validator[];
  batchPoster?: ConfigWallet;
  chainType?: ChainType;
  isLoading: boolean;
};

const defaultRollupConfig: RollupConfig = {
  confirmPeriodBlocks: 150,
  stakeToken: 'ETH',
  baseStake: 0.1,
  owner: '',
  extraChallengeTimeBlocks: 0,
  // Needs to be changed after PR by Lee about new Wasm root
  wasmModuleRoot: '0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21',
  loserStakeEscrow: '0x0000000000000000000000000000000000000000',
  chainId: Math.floor(Math.random() * 100000000000) + 1,
  chainName: 'My Arbitrum L3 Chain',
  chainConfig: '0x0000000000000000000000000000000000000000000000000000000000000000',
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
  chainType: undefined,
  isLoading: false,
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
  | { type: 'set_rollup_config'; payload: RollupConfigFormValues }
  | { type: 'set_chain_type'; payload: ChainType }
  | { type: 'set_validators'; payload: Validator[] }
  | { type: 'set_batch_poster'; payload: ConfigWallet }
  | { type: 'set_is_loading'; payload: boolean }
  | { type: 'reset'; payload: string };

type DeploymentPageContextValue = [
  DeploymentPageContextState,
  Dispatch<DeploymentPageContextAction>,
  { [key: string]: RefObject<HTMLFormElement> | null },
];

export const DeploymentPageContext = createContext<DeploymentPageContextValue>([
  getDeploymentPageContextStateInitialValue(),
  () => {},
  {},
]);

function reducer(
  state: DeploymentPageContextState,
  action: DeploymentPageContextAction,
): DeploymentPageContextState {
  switch (action.type) {
    case 'set_rollup_contracts':
      return { ...state, rollupContracts: action.payload };

    case 'set_rollup_config':
      return { ...state, rollupConfig: { ...state.rollupConfig, ...action.payload } };

    case 'set_chain_type':
      return { ...state, chainType: action.payload };

    case 'set_validators':
      return { ...state, validators: action.payload };

    case 'set_batch_poster':
      return { ...state, batchPoster: action.payload };

    case 'set_is_loading':
      return { ...state, isLoading: action.payload };

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

  const pickChainFormRef = useRef<HTMLFormElement>(null);
  const rollupConfigFormRef = useRef<HTMLFormElement>(null);
  const validatorFormRef = useRef<HTMLFormElement>(null);
  const batchPosterFormRef = useRef<HTMLFormElement>(null);
  const reviewAndDeployFormRef = useRef<HTMLFormElement>(null);
  const keysetFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    localStorage.setItem(
      'arbitrum:orbit:state',
      JSON.stringify({
        rollupConfig: state.rollupConfig,
        chainType: state.chainType,
        rollupContracts: state.rollupContracts,
        validators: state.validators,
        batchPoster: state.batchPoster,
      }),
    );
  }, [state]);

  useEffect(() => {
    if (!isValidStep) {
      goToStep(RollupStepMap.ChooseChainType);
    }
  }, [isValidStep]);

  return (
    <DeploymentPageContext.Provider
      value={[
        state,
        dispatch,
        {
          pickChainFormRef,
          rollupConfigFormRef,
          validatorFormRef,
          batchPosterFormRef,
          reviewAndDeployFormRef,
          keysetFormRef,
        },
      ]}
    >
      {children}
    </DeploymentPageContext.Provider>
  );
}

export function useDeploymentPageContext() {
  return useContext(DeploymentPageContext);
}
