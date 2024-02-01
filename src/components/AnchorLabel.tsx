import { twJoin } from 'tailwind-merge';

export const AnchorLabel = ({
  anchor,
  label,
  inputId,
}: {
  anchor?: string;
  label: string;
  inputId?: string;
}) => {
  const handleLinkClick = () => {
    if (anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={twJoin('font-bold', anchor && 'cursor-pointer underline')}
      onClick={() => handleLinkClick()}
    >
      <span>
        {label}
        {' #'}
      </span>
    </label>
  );
};
