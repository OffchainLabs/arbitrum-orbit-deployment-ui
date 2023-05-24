import { useState } from "react";
import styles from "../styles/RollupConfigInput.module.css";
import { useRouter } from "next/router";
import Image from "next/image";

export interface RollupConfig {
  confirmPeriodBlocks: number;
  stakeToken: string;
  baseStake: number;
  owner: string;
  extraChallengeTimeBlocks: number;
  wasmModuleRoot: string;
  loserStakeEscrow: string;
  chainId: number;
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
    stakeToken: "",
    baseStake: 10000000,
    owner: "",
    extraChallengeTimeBlocks: 0,
    wasmModuleRoot: "0x29cf6f443ffbbf05140637e376d29df6ad1d2e61103c582c40d76e8cfd854042",
    loserStakeEscrow: "0x0000000000000000000000000000000000000000",
    chainId: 11111112,
    genesisBlockNum: 0,
    sequencerInboxMaxTimeVariation: {
      delayBlocks: 10,
      futureBlocks: 20,
      delaySeconds: 30,
      futureSeconds: 40,
    },
  });
  

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
      wasmModuleRoot: "0x29cf6f443ffbbf05140637e376d29df6ad1d2e61103c582c40d76e8cfd854042",
      loserStakeEscrow: "0x0000000000000000000000000000000000000000",
      chainId: 11111112,
      genesisBlockNum: 0,
      sequencerInboxMaxTimeVariation: {
        delayBlocks: 10,
        futureBlocks: 20,
        delaySeconds: 30,
        futureSeconds: 40,
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

