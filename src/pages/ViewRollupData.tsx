// pages/ViewRollupData.tsx
import { useEffect, useState } from 'react';
import styles from '../styles/ViewRollupData.module.css';

type RollupData = {
  rollupAddress?: string;
  inboxAddress?: string;
  adminProxy?: string;
  sequencerInbox?: string;
  bridge?: string;
  utils?: string;
  validatorWalletCreator?: string;
  blockNumber?: number;
};

const ViewRollupData = () => {
  const [rollupData, setRollupData] = useState<RollupData>({});

  useEffect(() => {
    const rollupDataJSON = localStorage.getItem('rollupData');
    const parsedData = rollupDataJSON ? JSON.parse(rollupDataJSON) : {};
    setRollupData(parsedData);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rollup Data</h1>
      <p className={styles.info}>Rollup address: {rollupData.rollupAddress || 'N/A'}</p>
      <p className={styles.info}>Inbox address: {rollupData.inboxAddress || 'N/A'}</p>
      <p className={styles.info}>Admin Proxy address: {rollupData.adminProxy || 'N/A'}</p>
      <p className={styles.info}>Sequencer Inbox address: {rollupData.sequencerInbox || 'N/A'}</p>
      <p className={styles.info}>Bridge address: {rollupData.bridge || 'N/A'}</p>
      <p className={styles.info}>Utils address: {rollupData.utils || 'N/A'}</p>
      <p className={styles.info}>Validator Wallet Creator address: {rollupData.validatorWalletCreator || 'N/A'}</p>
      <p className={styles.info}>Block number: {rollupData.blockNumber || 'N/A'}</p>
    </div>
  );
};

export default ViewRollupData;
