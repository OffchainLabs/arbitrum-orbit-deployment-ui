// Importing necessary dependencies
import { useState, useEffect } from "react";
import styles from "../styles/ViewRollupData.module.css";
import { RollupConfigData } from './rollup';
import Image from "next/image";

const ViewRollupData = () => {
  const [data, setData] = useState<RollupConfigData | null>(null);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rollupData = localStorage.getItem("rollupData");

      if (rollupData) {
        setData(JSON.parse(rollupData));
      }
    }
  }, []);

  const downloadJSON = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = 'config.json';
    document.body.appendChild(element);
    element.click();
  }

  const toggleShowData = () => {
    setShowData(!showData);
  }

  if (!data) {
    return (
      <div className={styles.container}>
              <Image
          className={styles.logo} 
          src="/logo.svg"
          alt="Logo"
          width={250}
          height={250}
          />
        <h1 className={styles.title}>No rollup data found.</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
            <Image
          className={styles.logo} 
          src="/logo.svg"
          alt="Logo"
          width={250}
          height={250}
          />
      <h1 className={styles.title}>Rollup Data:</h1>
      <button className={styles.button} onClick={downloadJSON}>Download JSON</button>
      <button className={styles.button} onClick={toggleShowData}>Show More</button>
      {showData && 
        <pre className={styles.data}>
          {JSON.stringify(data, null, 2)}
        </pre>
      }
    </div>
  );
};

export default ViewRollupData;
