import { useReducer, useEffect, useState } from 'react';
import { DB } from '@/lib/store';

export function useStore() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const unsub = DB.subscribe(forceUpdate);
    return () => { unsub(); };
  }, []);

  return {
    institutions: DB.institutions,
    members:      DB.members,
    meetings:     DB.meetings,
    events:       DB.events,
    joinRequests: DB.joinRequests,
    loading:      DB.loading,
  };
}
