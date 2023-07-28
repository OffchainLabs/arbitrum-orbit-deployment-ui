import { useRouter } from 'next/router';
import { useDeploymentPageContext } from '../pages/deployment/DeploymentPageContext';
import { useAccount } from 'wagmi';
import { ButtonHTMLAttributes, FC } from 'react';

interface ResetButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ResetButton: FC<ResetButtonProps> = ({ className }) => {
  const router = useRouter();
  const { address } = useAccount();
  const [, dispatch] = useDeploymentPageContext();

  function reset() {
    localStorage.removeItem('rollupData');
    localStorage.removeItem('l3Config');

    dispatch({ type: 'reset', payload: address ? address : '' });

    router.push('/deployment?step=1');
  }

  return (
    <button
      className={`my-2 rounded-lg border border-[#243145] px-3 py-2 text-xs text-[#243145] ${className}`}
      onClick={reset}
    >
      <i className="pi pi-refresh mx-2 text-xs"></i>
      Reset and Start Over
    </button>
  );
};
