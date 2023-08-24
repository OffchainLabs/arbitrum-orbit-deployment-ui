import {
  buildChainConfig,
  buildRollupConfigData,
  buildRollupConfigPayload,
  buildAnyTrustNodeConfig,
  buildL3Config,
} from '../configBuilders';
import { rollupConfig, rollupContracts, validators, batchPoster } from './__mocks__';

describe('Configuration Builders', () => {
  describe('buildChainConfig Function', () => {
    it('builds correctly', () => {
      const chainConfig = { chainId: 42, owner: '0xF27c2fEfe6a39aa08763e504b44133CD992dd0f3' };
      expect(buildChainConfig(chainConfig)).toMatchSnapshot();
    });
  });

  describe('buildRollupConfigData Function', () => {
    it('builds correctly', () => {
      const result = buildRollupConfigData({
        rollupConfig,
        rollupContracts,
        validators,
        batchPoster,
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('buildRollupConfigPayload Function', () => {
    it('builds correctly', () => {
      const result = buildRollupConfigPayload({
        rollupConfig,
        chainConfig: 'ChainConfig',
      });
      expect(result).toMatchSnapshot();
    });
  });

  describe('buildAnyTrustNodeConfig Function', () => {
    it('builds correctly', () => {
      const rollupConfigData = buildRollupConfigData({
        rollupConfig,
        rollupContracts,
        validators,
        batchPoster,
      });
      const result = buildAnyTrustNodeConfig(
        rollupConfigData,
        '0xF27c2fEfe6a39aa08763e504b44133CD992dd0f3',
      );
      expect(result).toMatchSnapshot();
    });
  });

  describe('buildL3Config Function', () => {
    it('builds correctly', async () => {
      const buildL3ConfigParams = {
        address: '0xF27c2fEfe6a39aa08763e504b44133CD992dd0f3',
        rollupConfig,
        validators,
        batchPoster,
        rollupContracts,
      };
      const result = await buildL3Config(buildL3ConfigParams);
      expect(result).toMatchSnapshot();
    });
  });
});
