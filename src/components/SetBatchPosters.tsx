import { ScrollWrapper } from './ScrollWrapper';
import { WalletAddressManager } from './WalletAddressManager';

export const SetBatchPosters = () => {
  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="batch-posters">
          <span>Batch Posters #</span>
        </ScrollWrapper>
      </label>
      <WalletAddressManager fieldName="batch_posters" label="Batch Posters" />
    </>
  );
};
