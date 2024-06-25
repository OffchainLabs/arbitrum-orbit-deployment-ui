'use client';
import { CoreContracts } from '@arbitrum/orbit-sdk';
import { Wallet } from '@/types/RollupContracts';
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
import { generateChainId } from '@arbitrum/orbit-sdk/utils';
import { ChainType } from '@/types/ChainType';
import { RollupConfigFormValues } from '../../app/deployment/step/configure/page';

type DeploymentPageContextState = {
  rollupContracts?: CoreContracts;
  rollupConfig: RollupConfig;
  validators?: Wallet[];
  batchPoster?: Wallet;
  chainType?: ChainType;
  isLoading: boolean;
  isDownloadCompleted: boolean;
};

const generateDefaultRollupConfig: () => RollupConfig = () => ({
  confirmPeriodBlocks: 150,
  stakeToken: '0x0000000000000000000000000000000000000000',
  baseStake: 0.1,
  owner: '',
  extraChallengeTimeBlocks: 0,
  loserStakeEscrow: '0x0000000000000000000000000000000000000000',
  chainId: generateChainId(),
  chainName: 'My Arbitrum L3 Chain',
  chainConfig: '0x0000000000000000000000000000000000000000000000000000000000000000',
  genesisBlockNum: 0,
  nativeToken: '0x0000000000000000000000000000000000000000',
  sequencerInboxMaxTimeVariation: {
    delayBlocks: 5760,
    futureBlocks: 48,
    delaySeconds: 86400,
    futureSeconds: 3600,
  },
});

function getDefaultRollupConfig(owner: string = '') {
  return { ...generateDefaultRollupConfig(), owner };
}

const deploymentPageContextStateDefaultValue: DeploymentPageContextState = {
  rollupConfig: generateDefaultRollupConfig(),
  rollupContracts: undefined,
  validators: undefined,
  batchPoster: undefined,
  chainType: undefined,
  isLoading: false,
  isDownloadCompleted: false,
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
  | { type: 'set_rollup_contracts'; payload: CoreContracts }
  | { type: 'set_rollup_config'; payload: Partial<RollupConfigFormValues> }
  | { type: 'set_chain_type'; payload: ChainType }
  | { type: 'set_validators'; payload: Wallet[] }
  | { type: 'set_batch_poster'; payload: Wallet }
  | { type: 'set_is_loading'; payload: boolean }
  | { type: 'set_is_download_completed'; payload: boolean }
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

    case 'set_is_download_completed':
      return { ...state, isDownloadCompleted: action.payload };

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
  const { address } = useAccount({
    onConnect: ({ address }) => {
      if (address) {
        // Update owner field when use connects their wallet
        dispatch({ type: 'set_rollup_config', payload: { owner: address as string } });
      }
    },
  });

  const [state, dispatch] = useReducer(reducer, address, (address) => ({
    ...getDeploymentPageContextStateInitialValue(),
    rollupConfig: getDefaultRollupConfig(address),
  }));

  const pickChainFormRef = useRef<HTMLFormElement>(null);
  const rollupConfigFormRef = useRef<HTMLFormElement>(null);
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
        isDownloadCompleted: state.isDownloadCompleted,
      }),
    );
  }, [state]);

  return (
    <DeploymentPageContext.Provider
      value={[
        state,
        dispatch,
        {
          pickChainFormRef,
          rollupConfigFormRef,
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
