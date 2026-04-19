import { UNITS, UnitType, UNIT_COLORS } from '@/lib/store';
import { useStore } from '@/hooks/useStore';

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const store = useStore();
  const upcoming = store.meetings.filter(m => m.status === 'upcoming').length + store.events.filter(e => e.status === 'upcoming').length;

  const upcomingItems = [
    ...store.meetings.filter(m => m.status === 'upcoming').map(m => ({ ...m, _kind: 'meeting' as const })),
    ...store.events.filter(e => e.status === 'upcoming').map(e => ({ ...e, _kind: 'event' as const })),
  ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);

  return (
    <div>
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
        {[
          { v: store.members.length, l: 'Total members' },
          { v: store.institutions.length, l: 'Institutions' },
          { v: store.meetings.length + store.events.length, l: 'Meetings & events' },
          { v: upcoming, l: 'Upcoming' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3">
            <div className="text-[22px] font-semibold text-foreground leading-none mb-1">{k.v}</div>
            <div className="text-2xs text-muted-foreground">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Units */}
        <div>
          <div className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">Units</div>
          {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => {
            const mc = store.members.filter(m => m.ut === k).length;
            const mt = store.meetings.filter(m => m.ul === k || m.ul === 'all').length;
            const ev = store.events.filter(e => e.ul === k || e.ul === 'all').length;
            return (
              <div key={k} onClick={() => onNavigate(k)}
                className="bg-card border border-border rounded-lg p-2.5 flex items-center gap-2.5 cursor-pointer mb-1.5 hover:border-primary transition-colors">
                <div className="w-[3px] h-7 rounded-full flex-shrink-0" style={{ background: UNIT_COLORS[k] }} />
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground mb-0.5">{u.label}</div>
                  <div className="text-2xs text-muted-foreground">{mc} members • {mt} meetings • {ev} events</div>
                </div>
                <span className="text-[11px] text-muted-foreground">→</span>
              </div>
            );
          })}
        </div>

        {/* Right column */}
        <div>
          <div className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">Member distribution</div>
          <div className="bg-card border border-border rounded-lg p-3 mb-3">
            {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => {
              const cnt = store.members.filter(m => m.ut === k).length;
              const pct = Math.round(cnt / Math.max(1, store.members.length) * 100);
              return (
                <div key={k} className="mb-2 last:mb-0">
                  <div className="flex justify-between text-2xs text-muted-foreground mb-1">
                    <span>{u.label}</span><span>{cnt} ({pct}%)</span>
                  </div>
                  <div className="h-[3px] bg-background rounded-none">
                    <div className="h-[3px] rounded-none transition-all duration-500" style={{ width: `${pct}%`, background: UNIT_COLORS[k] }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground mb-2">Upcoming</div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {upcomingItems.length === 0 && <div className="text-center py-6 text-[11px] text-muted-foreground">No upcoming items</div>}
            {upcomingItems.map(x => (
              <div key={x.id} className="px-3.5 py-2 border-b border-border last:border-b-0 flex gap-2 items-start">
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0 mt-1" style={{ background: UNIT_COLORS[x.ul as UnitType] || '#888' }} />
                <div>
                  <div className="text-[11px] font-medium text-foreground mb-0.5">{x.title}</div>
                  <div className="text-2xs text-muted-foreground">{x.date} • {UNITS[x.ul as UnitType]?.label || 'All units'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
