import { RaasProviderCard } from './RaasProviderCard';

export const RaasProviderGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <RaasProviderCard
        name="Caldera"
        description="Supports AnyTrust and Rollup chains"
        caption="Powering Treasure, Hychain, Rari"
        link="https://caldera.xyz/"
        logo="/Caldera.svg"
      />
      <RaasProviderCard
        name="Conduit"
        description="Supports AnyTrust and Rollup chains"
        caption="Powering Frame, Orb3, and Parallel"
        link="https://conduit.xyz/"
        logo="/Conduit.svg"
      />
      <RaasProviderCard
        name="AltLayer"
        description="Supports AnyTrust chains"
        caption="Powering Cometh, Polychain Monster & Avive"
        link="https://altlayer.io/"
        logo="/AltLayer.svg"
      />
      <RaasProviderCard
        name="Gelato"
        description="Supports AnyTrust chains"
        caption="Powering re.al and Playnance"
        link="https://gelato.network/"
        logo="/Gelato.svg"
      />
    </div>
  );
};
