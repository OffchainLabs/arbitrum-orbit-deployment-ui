import { ScrollWrapper } from './ScrollWrapper';
import { WalletAddressManager } from './WalletAddressManager';

export const SetValidators = () => {
  return (
    <>
      <label className={'cursor-pointer underline'}>
        <ScrollWrapper anchor="validators">
          <span>Validators #</span>
        </ScrollWrapper>
      </label>
      <WalletAddressManager fieldName="validators" label="Validator" />
    </>
  );
};
