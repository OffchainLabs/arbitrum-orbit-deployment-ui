import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * A wrapper component that scrolls to the anchor and highlights the item briefly when clicked.
 */
export const ScrollWrapper = ({
  anchor,
  children,
  className,
}: PropsWithChildren<{ anchor?: string; className?: string }>) => {
  const highlightElement = (element: HTMLElement) => {
    element.classList.add('highlight-effect');
    setTimeout(() => {
      element.classList.remove('highlight-effect');
    }, 2000);
  };

  const handleClick = () => {
    if (anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        highlightElement(element);
      }
    }
  };

  return (
    <div onClick={() => handleClick()} className={twMerge(className, 'cursor-pointer')}>
      {children}
    </div>
  );
};
