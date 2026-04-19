import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [lid, setLid] = useState('admin_ADMIN001');
  const [key, setKey] = useState('Admin@123');
  const [err, setErr] = useState('');

  const handleLogin = () => {
    setErr('');
    const error = login(lid.trim(), key.trim());
    if (error) setErr(error);
  };

  return (
    <div className="fixed inset-0 bg-navy flex items-center justify-center p-5 z-50">
      <div className="bg-card rounded-xl p-8 w-full max-w-[380px] border border-border">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 border-primary/20 bg-card flex-shrink-0">
            <img src="/icon-192.png" alt="ABVP" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold text-card-foreground">ABVP Goraksha Prant</div>
            <div className="text-2xs text-muted-foreground mt-0.5">Akhil Bharatiya Vidyarthi Parishad</div>
          </div>
        </div>

        <h1 className="text-lg font-semibold mb-1 text-card-foreground">Sign in</h1>
        <p className="text-xs text-muted-foreground mb-5">Use your Login ID and Security Key</p>

        <div className="bg-secondary border border-border rounded-md p-2.5 text-2xs text-muted-foreground mb-4 leading-relaxed">
          <span className="text-primary font-semibold">Admin:</span> admin_ADMIN001 / Admin@123<br/>
          <span className="text-primary font-semibold">Member:</span> ramkumar_PR001 / xK9mP2qR
        </div>

        <div className="flex flex-col gap-2.5">
          <input
            className="px-3 py-2 border border-border rounded-md text-xs bg-card text-card-foreground focus:outline-none focus:border-primary"
            placeholder="Login ID" value={lid} onChange={e => setLid(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <input
            className="px-3 py-2 border border-border rounded-md text-xs bg-card text-card-foreground focus:outline-none focus:border-primary"
            type="password" placeholder="Security Key" value={key} onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          {err && <div className="text-xs text-destructive text-center">{err}</div>}
          <button
            onClick={handleLogin}
            className="bg-primary text-primary-foreground border-none py-2.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-primary-dim transition-colors mt-0.5"
          >
            Sign in
          </button>
        </div>

        <div className="text-center text-[11px] text-muted-foreground mt-3.5">
          New here? <a href="/join" className="text-primary font-medium hover:underline">Submit join request →</a>
        </div>
      </div>
    </div>
  );
}
