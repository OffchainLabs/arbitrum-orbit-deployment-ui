import { useRouter } from 'next/navigation';
import { useDeploymentPageContext } from './DeploymentPageContext';
import { useAccount } from 'wagmi';
import { ButtonHTMLAttributes, FC } from 'react';
import { assertIsAddress } from '@/utils/validators';

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

    assertIsAddress(address);
    dispatch({ type: 'reset', payload: address });

    router.push('/deployment/step/1');
  }

  return (
    <button
      className={`my-2 w-64 py-2 text-left text-sm text-[#243145] underline ${className}`}
      onClick={reset}
    >
      Reset and Start Over
    </button>
  );
};
