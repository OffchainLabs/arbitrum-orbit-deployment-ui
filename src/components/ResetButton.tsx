import { useRouter } from 'next/router';
import { useDeploymentPageContext } from '../pages/deployment/DeploymentPageContext';
import { useAccount } from 'wagmi';
import { ButtonHTMLAttributes, FC } from 'react';

interface ResetButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  setIsLoading: (isLoading: boolean) => void;
}

export const ResetButton: FC<ResetButtonProps> = ({ className, setIsLoading }) => {
  const router = useRouter();
  const { address } = useAccount();
  const [, dispatch] = useDeploymentPageContext();

  function reset() {
    localStorage.removeItem('rollupData');
    localStorage.removeItem('l3Config');

    dispatch({ type: 'reset', payload: address ? address : '' });
    setIsLoading(false);
    router.push('/deployment?step=1');
  }

  return (
    <button
      className={`my-2 w-64 border border-white py-2 text-left text-sm text-[#243145] underline${className}`}
      onClick={reset}
    >
      Reset and Start Over
    </button>
  );
};
