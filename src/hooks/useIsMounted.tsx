// This hook prevents next.js from throwing an error on SSR

import { useState, useEffect } from 'react';

// due to wagmi not being available on the server
export const useIsMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};
