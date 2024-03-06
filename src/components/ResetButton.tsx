import { useRouter } from 'next/navigation';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { useAccount } from 'wagmi';
import { ButtonHTMLAttributes, FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { FIRST_STEP } from '@/hooks/useStep';

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

    dispatch({ type: 'set_is_loading', payload: false });
    dispatch({ type: 'reset', payload: address ? address : '' });
    router.push(`/deployment/step/${FIRST_STEP.id}`);
  }

  return (
    <button className={twMerge('text-xs text-white hover:underline', className)} onClick={reset}>
      Reset and Start Over
    </button>
  );
};
