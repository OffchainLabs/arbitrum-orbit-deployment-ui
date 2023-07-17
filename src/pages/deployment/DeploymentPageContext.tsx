import { Dispatch, createContext, useContext, useEffect, useReducer } from 'react';

import { Validator, BatchPoster, RollupContracts } from '@/types/RollupContracts';
import { RollupConfig } from '@/components/RollupConfigInput';
import { useQueryParams, withDefault, NumberParam } from 'use-query-params';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';

export enum Step {
  RollupDeploymentConfiguration = 1,
  ValidatorConfiguration = 2,
  BatchPosterConfiguration = 3,
  Deploy = 4,
  Download = 5,
}

type DeploymentPageContextState = {
  rollupContracts?: RollupContracts;
  step: Step;
  rollupConfig?: RollupConfig;
  validators?: Validator[];
  batchPoster?: BatchPoster;
};

const MAX_STEPS = 5;

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
  step: 1,
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
  | { type: 'set_step'; payload: number }
  | { type: 'previous_step' }
  | { type: 'next_step' }
  | { type: 'reset' };

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

    case 'set_step':
      // Ensure the step is within the boundaries 1 and 5
      return { ...state, step: Math.max(1, Math.min(MAX_STEPS, action.payload)) };

    case 'previous_step':
      // Prevent the step from going below 1
      return { ...state, step: Math.max(1, state.step - 1) };

    case 'next_step':
      // Prevent the step from going above MAX_STEPS
      return { ...state, step: Math.min(MAX_STEPS, state.step + 1) };

    case 'reset':
      return deploymentPageContextStateDefaultValue;

    default:
      return state;
  }
}

export function DeploymentPageContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, getDeploymentPageContextStateInitialValue());
  const { address } = useAccount();
  const router = useRouter();

  const [{ step }] = useQueryParams({
    step: withDefault(NumberParam, Step.RollupDeploymentConfiguration),
  });

  // Initial setup of step from query params
  useEffect(() => {
    dispatch({ type: 'set_step', payload: step });
  }, []);

  useEffect(() => {
    if (state.step > 5 || state.step < 1) return;
    router.push(`/deployment?step=${state.step}`);
  }, [state.step]);

  useEffect(() => {
    if (typeof address !== 'undefined' && state.rollupConfig) {
      // Set currently connected account as the owner
      dispatch({ type: 'set_rollup_config', payload: { ...state.rollupConfig, owner: address } });
    } else {
      const defaultRollupConfig = getDefaultRollupConfig(address);
      dispatch({ type: 'set_rollup_config', payload: defaultRollupConfig });
    }
  }, [address]);

  useEffect(() => {
    localStorage.setItem('arbitrum:orbit:state', JSON.stringify(state));
  }, [state]);

  return (
    <DeploymentPageContext.Provider value={[state, dispatch]}>
      {children}
    </DeploymentPageContext.Provider>
  );
}

export function useDeploymentPageContext() {
  return useContext(DeploymentPageContext);
}
