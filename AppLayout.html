import { useState, ReactNode } from 'react';
import { UNITS, UnitType } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import { UNIT_COLORS } from '@/lib/store';

type Tab = 'dashboard' | UnitType | 'institutions' | 'all_members' | 'all_meetings' | 'all_events' | 'join_requests';

interface LayoutProps {
  children: (props: { tab: Tab; search: string; subTab: string; setSubTab: (s: string) => void }) => ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const store = useStore();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const [subTab, setSubTab] = useState('members');

  const go = (t: Tab) => { setTab(t); setSearch(''); setSubTab('members'); };

  const isUnit = (t: string): t is UnitType => t in UNITS;
  const showUnitSubs = isUnit(tab);
  const showInstSubs = tab === 'institutions';

  const titles: Record<string, string> = {
    dashboard: 'Dashboard', institutions: 'Institutions', all_members: 'All Members',
    all_meetings: 'All Meetings', all_events: 'All Events', join_requests: 'Join Requests',
  };
  Object.entries(UNITS).forEach(([k, u]) => { titles[k] = u.label + ' Unit'; });

  const NavItem = ({ t, label, dot, count, adminOnly }: { t: Tab; label: string; dot?: string; count?: number; adminOnly?: boolean }) => {
    if (adminOnly && !isAdmin) return null;
    return (
      <button
        onClick={() => go(t)}
        className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-medium w-full text-left border-l-2 transition-all
          ${tab === t ? 'text-primary border-l-primary bg-accent-bg' : 'text-muted-foreground border-l-transparent hover:text-foreground hover:bg-background'}`}
      >
        <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: dot || (tab === t ? 'hsl(var(--primary))' : 'hsl(var(--border))') }} />
        <span className="hidden sm:inline">{label}</span>
        {count !== undefined && (
          <span className={`ml-auto text-2xs px-1.5 py-0.5 rounded-full hidden sm:inline ${tab === t ? 'bg-accent-bg text-primary-dim' : 'bg-background text-muted-foreground'}`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="h-dvh max-h-dvh overflow-hidden flex">
      {/* Sidebar */}
      <aside className="w-12 sm:w-[204px] flex-shrink-0 bg-card border-r border-border flex flex-col overflow-hidden">
        <div className="p-3 sm:px-4 sm:py-3.5 border-b border-border flex-shrink-0 flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0 border border-primary/25 bg-card">
            <img src="/icon-192.png" alt="ABVP" className="w-full h-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold text-foreground">ABVP</div>
            <div className="text-[9px] text-muted-foreground mt-0.5">Goraksha Prant</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-1.5 custom-scrollbar">
          <div className="px-4 pt-3 pb-1 text-[9px] font-semibold tracking-wider uppercase text-muted-foreground hidden sm:block">Overview</div>
          <NavItem t="dashboard" label="Dashboard" />

          <div className="px-4 pt-3 pb-1 text-[9px] font-semibold tracking-wider uppercase text-muted-foreground hidden sm:block">Units</div>
          {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => (
            <NavItem key={k} t={k} label={u.label} dot={UNIT_COLORS[k]} />
          ))}

          <div className="px-4 pt-3 pb-1 text-[9px] font-semibold tracking-wider uppercase text-muted-foreground hidden sm:block">Repository</div>
          <NavItem t="institutions" label="Institutions" adminOnly />
          <NavItem t="all_members" label="All Members" count={store.members.length} />
          <NavItem t="all_meetings" label="All Meetings" count={store.meetings.length} />
          <NavItem t="all_events" label="All Events" count={store.events.length} />
          <NavItem t="join_requests" label="Join Requests" count={store.joinRequests.filter(r => r.status === 'pending').length} adminOnly />
        </nav>

        <div className="p-2.5 border-t border-border flex-shrink-0">
          <button onClick={logout} className="w-full text-2xs py-1.5 border border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-all">
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden">×</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-11 bg-card border-b border-border px-4 flex items-center justify-between flex-shrink-0">
          <span className="text-[13px] font-semibold text-foreground">{titles[tab] || tab}</span>
          <div className="flex gap-2 items-center">
            <input
              className="px-2.5 py-1 border border-border rounded-md text-[11px] bg-background text-foreground w-[130px] sm:w-[150px] focus:outline-none focus:border-primary focus:bg-card transition-all"
              placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            />
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">{user?.name}</span>
          </div>
        </header>

        {/* Sub-tabs */}
        {(showUnitSubs || showInstSubs) && (
          <div className="bg-card border-b border-border px-4 flex-shrink-0 overflow-x-auto flex">
            {['members', 'meetings', 'events'].map(s => (
              <button
                key={s}
                onClick={() => setSubTab(s)}
                className={`px-3 py-2 text-[11px] font-medium border-b-[1.5px] transition-all whitespace-nowrap
                  ${subTab === s ? 'text-primary border-b-primary' : 'text-muted-foreground border-b-transparent hover:text-foreground'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Page */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {children({ tab, search, subTab, setSubTab })}
        </div>
      </div>
    </div>
  );
}
