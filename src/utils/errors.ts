import { toast } from 'react-toastify';

export const showSigningErrorToast = (error: unknown) => {
  if (error instanceof Error) {
    // Shorten the error message sent from MetaMask (or other wallets) by grabbing just the first sentence
    const periodIndex = error.message.indexOf('.');
    const message = error.message.substring(0, periodIndex ? periodIndex + 1 : undefined);
    toast(message, { type: 'error', pauseOnHover: true });
  }
};
