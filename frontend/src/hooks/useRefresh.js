import { useState, useCallback } from 'react';

export function useRefresh(fn) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fn?.();
    // brief pause so the spinner feels deliberate
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, [fn]);

  return { refreshing, onRefresh };
}
