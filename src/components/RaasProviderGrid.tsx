import { RaasProviderCard } from './RaasProviderCard';

export const RaasProviderGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        caption="Powering Proof of Play and Gravity"
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
      <RaasProviderCard
        name="Asphere"
        description="Supports AnyTrust and Rollup chains"
        caption="Powering Social Network and Destra"
        link="https://www.ankr.com/rollup-as-a-service-raas"
        logo="/AsphereLogo.png"
      />
      <RaasProviderCard
        name="Zeeve"
        description="Supports AnyTrust and Rollup chains"
        caption="Powering BlockFit and ZKasino"
        link="https://www.zeeve.io/"
        logo="/ZeeveLogo.png"
      />
      <RaasProviderCard
        name="Alchemy"
        description="Supports AnyTrust and Rollup chains"
        caption="Powering Aavegotchi"
        link="https://alchemy.com/rollups"
        logo="/AlchemyLogo.png"
      />
      <RaasProviderCard
        name="QuickNode"
        description="Supports AnyTrust and Rollup chains"
        caption="Powering Proof of Play"
        link="https://www.quicknode.com/rollup"
        logo="/QuickNodeLogo.svg"
      />
    </div>
  );
};
