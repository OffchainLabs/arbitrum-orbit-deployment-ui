import { PropsWithChildren } from 'react';

/**
 * A wrapper component that scrolls to the anchor when clicked.
 */
export const ScrollWrapper = ({
  anchor,
  children,
  className,
}: PropsWithChildren<{ anchor?: string; className?: string }>) => {
  const handleClick = () => {
    if (anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div onClick={() => handleClick()} className={className}>
      {children}
    </div>
  );
};
