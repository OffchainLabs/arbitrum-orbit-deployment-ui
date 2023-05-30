import { useState, useEffect } from "react";
import styles from "../styles/ViewRollupData.module.css";
import { RollupConfigData } from './rollup';
import Image from "next/image";

// Function to remove unwanted fields
const removeFields = (obj: any, fieldsToRemove: string[]): any => {
  let newObj = JSON.parse(JSON.stringify(obj)); // Deep clone the original object

  fieldsToRemove.forEach(field => {
    if (newObj.hasOwnProperty(field)) {
      delete newObj[field];
    }
  });

  return newObj;
};


//for removing other parts
const removeNestedFields = (obj: any): any => {
  let newObj = JSON.parse(JSON.stringify(obj)); // Deep clone the original object
  
  if (newObj.chain && typeof newObj.chain["info-json"] === "string") {
    newObj.chain["info-json"] = JSON.parse(newObj.chain["info-json"]); // Parse the stringified JSON
  }
  
  if (newObj.chain && newObj.chain["info-json"]) {
    newObj.chain["info-json"].forEach((item: any) => {
      if (item.hasOwnProperty("sequencer-url")) {
        delete item["sequencer-url"];
      }
      if (item.hasOwnProperty("feed-url")) {
        delete item["feed-url"];
      }
    });
  }

  return newObj;
};





const ViewRollupData = () => {
  const [data, setData] = useState<RollupConfigData | null>(null);
  const [showData, setShowData] = useState(false);

  const unwantedFields = ["inboxAddress", "adminProxy", "sequencerInbox", "bridge", "utils", "validatorWalletCreator", "blockNumber","rollupAddress"];


  useEffect(() => {
    if (typeof window !== "undefined") {
      const rollupData = localStorage.getItem("rollupData");
  
      if (rollupData) {
        let parsedData = JSON.parse(rollupData);
        let cleanedData = removeFields(parsedData, unwantedFields);
        cleanedData = removeNestedFields(cleanedData);
        setData(cleanedData);
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
