import { useState, useEffect } from "react";
import styles from "../styles/L3ConfigInput.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import { ethers } from "ethers";

declare let window: Window & { ethereum: any };

export interface L3Config {
  minL2BaseFee: number;
  networkFeeReceiver: string;
  infrastructureFeeCollector: string;
}

interface L3ConfigInputProps {
  onSave: (config: L3Config) => void;
}

const L3ConfigInput: React.FC<L3ConfigInputProps> = ({ onSave }) => {
  const [config, setConfig] = useState<L3Config>({
    minL2BaseFee: 100000000,
    networkFeeReceiver: "",
    infrastructureFeeCollector: "",
  });

  useEffect(() => {
    const getConnectedAddress = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      setConfig((prevConfig) => ({
        ...prevConfig,
        networkFeeReceiver: address,
        infrastructureFeeCollector: address,
      }));
    };

    const savedConfig = localStorage.getItem('l3Config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    getConnectedAddress();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('l3Config', JSON.stringify(config));
    onSave(config);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.label}>
        <label htmlFor="minL2BaseFee">Minimum L2 Base Fee:</label>
        <input
          className={styles.input}
          type="number"
          name="minL2BaseFee"
          value={config.minL2BaseFee}
          onChange={handleChange}
        />
      </div>
      <div className={styles.label}>
        <label htmlFor="networkFeeReceiver">Network Fee Receiver Account:</label>
        <input
          className={styles.input}
          type="text"
          name="networkFeeReceiver"
          value={config.networkFeeReceiver}
          onChange={handleChange}
        />
      </div>
      <div className={styles.label}>
        <label htmlFor="infrastructureFeeCollector">Infrastructure Fee Collector Account:</label>
        <input
          className={styles.input}
          type="text"
          name="infrastructureFeeCollector"
          value={config.infrastructureFeeCollector}
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

  const handleSaveRollupConfig = (config: L3Config) => {
    console.log("L3 Config saved:", config);
    localStorage.setItem('l3Config', JSON.stringify(config)); 
    router.push({
      pathname: "/ViewRollupData"
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
      <L3ConfigInput onSave={handleSaveRollupConfig} />
    </div>
  );
};

export default RollupConfigInputPage;
