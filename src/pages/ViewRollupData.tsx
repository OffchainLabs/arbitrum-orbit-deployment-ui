// Importing necessary dependencies
import { useState, useEffect } from "react";
import styles from "../styles/ViewRollupData.module.css";
import { RollupConfigData } from './rollup';

const ViewRollupData = () => {
  const [data, setData] = useState<RollupConfigData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rollupData = localStorage.getItem("rollupData");

      if (rollupData) {
        setData(JSON.parse(rollupData));
      }
    }
  }, []);

  if (!data) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>No rollup data found.</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rollup Data:</h1>
      <pre className={styles.data}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ViewRollupData;
