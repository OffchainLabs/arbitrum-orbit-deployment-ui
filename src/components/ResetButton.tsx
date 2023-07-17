import { useRouter } from 'next/router';
import { useDeploymentPageContext } from '../pages/deployment/DeploymentPageContext';

export const ResetButton = () => {
  const router = useRouter();
  const [, dispatch] = useDeploymentPageContext();

  function reset() {
    localStorage.removeItem('rollupData');
    localStorage.removeItem('l3Config');

    dispatch({ type: 'reset' });

    router.push('/deployment?step=1');
  }

  return (
    <button
      className=" rounded-lg border border-[#243145] px-3 py-2 text-[#243145]"
      onClick={reset}
    >
      <i className="pi pi-refresh mx-2"></i>
      Reset and Start Over
    </button>
  );
};
