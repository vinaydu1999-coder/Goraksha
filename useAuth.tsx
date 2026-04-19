import { createContext, useContext, useState, ReactNode } from 'react';
import { DB, Member } from '@/lib/store';

interface AuthCtx {
  user: Member | null;
  login: (lid: string, key: string) => string | null;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthCtx>({
  user: null, login: () => null, logout: () => {}, isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Member | null>(() => DB.getSession());

  const login = (lid: string, key: string): string | null => {
    const m = DB.login(lid, key);
    if (!m) return 'Invalid credentials or account not approved.';
    DB.setSession(m);
    setUser(m);
    return null;
  };

  const logout = () => {
    DB.clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
