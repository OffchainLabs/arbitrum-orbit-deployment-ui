import { AvatarComponent } from '@rainbow-me/rainbowkit';
import BoringAvatar from 'boring-avatars';
import { useEnsName } from 'wagmi';

export const CustomBoringAvatar = ({ size, name }: { size: number; name?: string }) => {
  return (
    <BoringAvatar
      size={size}
      name={name?.toLowerCase()}
      variant="beam"
      colors={['#11365E', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']}
    />
  );
};
export const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  return ensImage ? (
    <img src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} />
  ) : (
    <CustomBoringAvatar size={size} name={ensName ?? address} />
  );
};
