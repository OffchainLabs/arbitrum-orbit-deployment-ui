import { twMerge } from 'tailwind-merge';

export const StepTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={twMerge('text-left text-3xl font-light text-[#B2B2B2]', className)}>
      {children}
    </h3>
  );
};
