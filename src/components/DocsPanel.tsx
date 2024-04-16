import { useState, useEffect, PropsWithChildren } from 'react';

const DocsPanelItem = ({
  id,
  title,
  children,
}: PropsWithChildren<{
  id: string;
  title: string;
}>) => {
  return (
    <div className="flex flex-col gap-3 p-2 text-[#BABABA]" id={id}>
      <h2 className="text-lg font-light text-white">{title}</h2>
      {children}
    </div>
  );
};

/**
 * The panel that displays the documentation for the Orbit chain configuration parameters.
 */
export const DocsPanel = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const checkScrollPosition = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const threshold = maxHeight;
      if (scrolled > threshold) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollPosition);

    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  return (
    <div className="border-px hide-scrollbar relative flex h-full flex-col gap-2 overflow-y-scroll rounded-md border border-[#5E5E5E] bg-[#191919] text-sm leading-normal">
      <DocsPanelItem id="chain-id" title="CHAIN ID">
        <p>
          Don't worry about this; it's inconsequential for devnets. In production scenarios (which
          aren't yet supported), you'll want to use a unique integer identifier that represents your
          chain's network on chain indexes like{' '}
          <a href="https://www.chainlist.org" className="underline">
            Chainlist.org
          </a>
          .
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="chain-name" title="CHAIN NAME">
        <p>
          This name provides a way for people to distinguish your Orbit chain from other Orbit
          chains. You&apos;ll want to make this a name that you can easily remember, and that your
          users and developers will recognize.
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="challenge-period-blocks" title="CHALLENGE PERIOD BLOCKS">
        <p>
          The Challenge period (blocks) parameter determines the amount of time your chain's
          validators have to dispute&#8212;or "challenge"&#8212;the current state of the chain
          posted to your Orbit chain's base chain on L2 (Arbitrum Goerli or Sepolia for now;
          settlement to One and Nova mainnet chains isn't supported yet).
        </p>
        <p>
          A longer challenge period means that your chain's nodes will have more time to dispute
          fraudulent states, but it also means that your chain's users will have to wait longer to
          withdraw their assets from your chain. This is one of the many tradeoffs that Orbit allows
          you to make when configuring your chain.
        </p>
        <p>
          Note that the challenge period is measured in blocks on the underlying L1 chain, not the
          base (L2) chain. For example, if your Orbit chain settles to Arbitrum Sepolia, the
          challenge period window would be the number of Challenge period (blocks) multiplied by the
          L1 Sepolia block time (~12 seconds).
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="stake-token" title="STAKE TOKEN">
        <p>
          Your Orbit chain will be supported by at least one validator node. In order for your
          chain's validators to post assertions of the state of the chain on the base chain (L2),
          they're required to stake some value as a way to incentivize honest participation. This
          Stake token parameter specifies the token that your chain's validators must deposit into
          this contract when they stake. This is specified using the token's contract address on the
          L2 chain that your chain is settling to&#8212;Arbitrum Goerli or Arbitrum Sepolia&#8212;or
          0x0000000000000000000000000000000000000000 if you want to use ETH as the stake token.
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="base-stake" title="BASE STAKE">
        <p>
          The Base stake parameter specifies the amount of the stake token (ETH or an ERC-20 token)
          that your chain's validators must deposit in order to post assertions of the state of your
          Orbit chain on the base chain's rollup contracts. This is specified using a float value.
        </p>
        <p>
          If your Base stake is low, the barrier to participation will be low, but your chain will
          be more vulnerable to certain types of attacks.
        </p>
        <p>
          For example, an Orbit chain with a base stake of 0.01 ETH could be halted by an adversary
          who can afford to deploy sacrificial validators that maliciously challenge every RBlock
          submitted to your Orbit chain's base chain.
        </p>
        <p>
          The malicious challenges would result in slashed Orbit chain validators (one slashed
          validator per malicious challenge), but from the adversary's perspective, periodic
          slashing is just the price they have to pay to keep your chain offline.
        </p>
        <p>
          A higher base stake incentivize honest participation by making it more expensive to launch
          these types of attacks. However, a higher base stake also translates to a higher barrier
          to entry for your chain's validators. This is another tradeoff to consider.
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="owner" title="OWNER">
        <p>
          This account address is responsible for deploying, owning, and updating your Orbit chain's
          base contracts on its base chain.
        </p>
        <p>
          In production scenarios, this is a high-stakes address that's often controlled by a DAO's
          governance protocol or multisig. For your Orbit devnet chain, think of this as a
          low-stakes administrative service account.
        </p>
        <p>
          Note that you'll have to fund this address with enough ETH to cover the gas costs of
          deploying your core contracts to L2.
        </p>
        <p>
          When deploying your Orbit chain, this address must be a standard Ethereum wallet address
          (precisely speaking, an EOA); it can't be a smart contract/wallet contract.
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="gas-token" title="GAS TOKEN">
        <p>
          The Gas Token parameter specifies the token (ETH or an ERC-20 token) that is natively used
          for gas payments on the network. On Ethereum, Arbitrum One, and Arbitrum Nova the gas
          token is ETH. Orbit chains that are configured as AnyTrust chains can specify a different
          gas token as long as it falls within certain requirements.
        </p>
        <p>
          The main requirement for custom gas tokens is that they are natively deployed on the
          parent chain. For example, if a team deploying an Orbit chain wants to use a specific
          ERC-20 as the gas token, that token must be deployed on the parent chain first (i.e.
          Arbitrum One or Nova). During chain deployment, that token is "natively bridged" and then
          properly configured as the native gas token on the new network.
        </p>
        <p>
          There are other important considerations to keep in mind when deciding to use a custom gas
          token. Restrictions on the ERC-20 token include:
        </p>
        <ul className="ml-10 list-disc">
          <li>
            In this version, only tokens with 18 decimals are permitted to be the native token.
          </li>
          <li>The token can't be rebasing or have a transfer fee.</li>
          <li>The token must only be transferrable via a call to the token address itself.</li>
          <li>
            The token must only be able to set allowance via a call to the token address itself.
          </li>
          <li>
            The token must not have a callback on transfer, and more generally a user must not be
            able to make a transfer to themselves revert.
          </li>
        </ul>
        <p>
          It is worth reiterating that currently this feature is only supported on Orbit AnyTrust
          chains. Additionally, using a gas token other than ETH adds additional overhead when it
          comes to ensuring chains are funded properly when posting data to their parent chain.
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="validators" title="VALIDATORS">
        <p>
          The first input field is an integer value that determines the number of validators that
          will support your initial deployment. Subsequent fields allow you to specify each of these
          validators' addresses.
        </p>
        <p>
          The first validator address is randomly generated and can't be changed. Its private key
          will be automatically generated and stored within one of the JSON configuration files that
          will be generated in a moment.
        </p>
        <p>
          Your chain's validators are responsible for validating the integrity of transactions and
          posting assertions of the current state of your Orbit chain to its base chain. In
          production scenarios, your Orbit chain would likely be hosted by a network of validator
          nodes working together. For your local Orbit chain, you can stick to the auto-generated
          single validator address.
        </p>
        <p>
          Each of the validator addresses specified in this step will be added to an allow-list in
          one of your chain's base contracts, allowing them each to stake and validate transactions
          submitted to your Orbit chain.
        </p>
      </DocsPanelItem>

      <DocsPanelItem id="batch-poster" title="BATCH POSTER">
        <p>
          Your batch poster address is responsible for posting batches of transactions from your
          Orbit chain to its base contracts on its base chain. An address will automatically be
          generated for you; its private key will be automatically generated and stored within one
          of the JSON configuration files that will be generated in a moment.
        </p>
      </DocsPanelItem>

      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="border-px hover:bg-grey-600 fixed left-10 top-12 z-50 flex h-12 w-12 items-center justify-center rounded-md border border-white/25 bg-black text-white shadow-lg md:hidden"
          aria-label="Scroll to top"
          type="button"
        >
          <i className="pi pi-arrow-up" />
        </button>
      )}
    </div>
  );
};
