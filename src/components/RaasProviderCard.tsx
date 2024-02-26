import Image from 'next/image';
import Link from 'next/link';

export const RaasProviderCard = ({
  name,
  description,
  caption,
  link,
  logo,
}: {
  name: string;
  description: string;
  caption: string;
  link: string;
  logo: string;
}) => {
  return (
    <Link href={link}>
      <div className="group flex flex-col gap-4 rounded-md border border-solid border-grey bg-[#191919] p-4 hover:bg-[#6D6D6D] active:bg-[#C5C5C5]">
        <Image src={logo} alt={`${name} logo`} width={120} height={30} />
        <h4 className="text-2xl font-light">{name}</h4>
        <p className="text-sm font-light">{description}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs font-light">{caption}</p>
        </div>
        <div className="border-px border-b border-gray-200"></div>
        <p className="flex items-center justify-between text-xs font-light">
          Go to website <i className="pi pi-external-link invisible ml-1 group-hover:visible" />
        </p>
      </div>
    </Link>
  );
};
