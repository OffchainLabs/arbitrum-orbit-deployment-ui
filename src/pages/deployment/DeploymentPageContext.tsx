import { Dispatch, createContext, useContext, useEffect, useReducer } from 'react';

import { RollupContracts } from '@/types/RollupContracts';

type DeploymentPageContextState = {
  rollupContracts?: RollupContracts;
  validators?: string[];
  batchPoster?: string;
};

function getDeploymentPageContextStateInitialValue(): DeploymentPageContextState {
  if (typeof window === 'undefined') {
    return {};
  }

  return JSON.parse(localStorage.getItem('arbitrum:orbit:state') ?? '{}');
}

type DeploymentPageContextAction =
  | { type: 'set_rollup_contracts'; payload: RollupContracts }
  | { type: 'set_validators'; payload: string[] }
  | { type: 'set_batch_poster'; payload: string };

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

    case 'set_validators':
      return { ...state, validators: action.payload };

    case 'set_batch_poster':
      return { ...state, batchPoster: action.payload };

    default:
      return state;
  }
}

export function DeploymentPageContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, getDeploymentPageContextStateInitialValue());

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
