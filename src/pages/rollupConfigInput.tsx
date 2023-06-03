import { useState,useEffect } from "react";
import styles from "../styles/RollupConfigInput.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { ethers } from "ethers";

declare let window: Window & { ethereum: any };

export interface RollupConfig {
  confirmPeriodBlocks: number;
  stakeToken: string;
  baseStake: number;
  owner: string;
  extraChallengeTimeBlocks: number;
  wasmModuleRoot: string;
  loserStakeEscrow: string;
  chainId: number;
  chainConfig: string;
  genesisBlockNum: number;
  sequencerInboxMaxTimeVariation: {
    delayBlocks: number;
    futureBlocks: number;
    delaySeconds: number;
    futureSeconds: number;
  };
}

interface RollupConfigInputProps {
  onSave: (config: RollupConfig) => void;
}

// Annotate the component with the prop types
const RollupConfigInput: React.FC<RollupConfigInputProps> = ({ onSave }) => {
  const [config, setConfig] = useState<RollupConfig>({
    confirmPeriodBlocks: 20,
    stakeToken: ethers.constants.AddressZero,
    baseStake: 10000000,
    owner: "",
    extraChallengeTimeBlocks: 0,
    wasmModuleRoot: "0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21", //Need to be changed after PR by Lee about new Wasm root
    loserStakeEscrow: ethers.constants.AddressZero,
    chainId: 1337,
    chainConfig: ethers.constants.HashZero,
    genesisBlockNum: 0,
    sequencerInboxMaxTimeVariation: {
      delayBlocks: 16,
      futureBlocks: 192,
      delaySeconds: 86400,
      futureSeconds: 7200,
    },
  });
  useEffect(() => {
    const getOwnerAddress = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setConfig((prevConfig) => ({
        ...prevConfig,
        owner: address,
      }));
    };

    getOwnerAddress();
  }, []);
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(config);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.label}>
      <label htmlFor="chainId">Chain ID:</label>
      <input
        className={styles.input}
        type="number"
        name="chainId"
        value={config.chainId}
        onChange={handleChange}
        />
      </div>
      <div className={styles.label}>
        <label htmlFor="confirmPeriodBlocks">Confirm Period Blocks:</label>
        <input
          className={styles.input}
          type="number"
          name="confirmPeriodBlocks"
          value={config.confirmPeriodBlocks}
          onChange={handleChange}
        />
      </div>
      <div className={styles.label}>
        <label htmlFor="stakeToken">Stake Token:</label>
        <input
          className={styles.input}
          type="text"
          name="stakeToken"
          value={config.stakeToken}
          onChange={handleChange}
        />
      </div>
      <div className={styles.label}>
        <label htmlFor="baseStake">Base Stake:</label>
        <input
          className={styles.input}
          type="number"
          name="baseStake"
          value={config.baseStake}
          onChange={handleChange}
        />
      </div>
      <div className={styles.label}>
        <label htmlFor="owner">Owner:</label>
        <input
          className={styles.input}
          type="text"
          name="owner"
          value={config.owner}
          onChange={handleChange}
        />
      </div>
      <button className={styles.button} type="submit">
        Save Configuration
      </button>
    </form>
  );
};

const RollupConfigInputPage = () => {
  const router = useRouter();

  const handleSaveRollupConfig = (config: RollupConfig) => {
    console.log("Config saved:", config);
    const updatedConfig = {
      ...config,
      extraChallengeTimeBlocks: 0,
      wasmModuleRoot: "0xda4e3ad5e7feacb817c21c8d0220da7650fe9051ece68a3f0b1c5d38bbb27b21", // change it after Lee's PR
      loserStakeEscrow: ethers.constants.AddressZero,
      chainConfig:ethers.constants.HashZero,
      genesisBlockNum: 0,
      sequencerInboxMaxTimeVariation: {
        delayBlocks: 16,
        futureBlocks: 192,
        delaySeconds: 86400,
        futureSeconds: 7200,
      },
    };
    router.push({
      pathname: "/rollup",
      query: { rollupConfig: JSON.stringify(updatedConfig) },
    });
  };

  return (
  <div className={styles.container}>
    <Image
          className={styles.logo} 
          src="/logo.svg"
          alt="Logo"
          width={250}
          height={250}
          />
      <h1 style={{ color: "#fff", fontSize: "2rem", fontWeight: "bold" }}>
        Configure Rollup
      </h1>
      <RollupConfigInput onSave={handleSaveRollupConfig} />
  </div>
  );
  };

export default RollupConfigInputPage;

