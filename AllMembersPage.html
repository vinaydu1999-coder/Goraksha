import { UNITS, UnitType, UNIT_COLORS } from '@/lib/store';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import MemberTable from './MemberTable';
import { useState } from 'react';
import MemberFormModal from './MemberFormModal';
import { PRINT, EXPORT } from '@/lib/print';

interface Props { search: string; }

export default function AllMembersPage({ search }: Props) {
  const store = useStore();
  const { isAdmin } = useAuth();
  const srch = search.toLowerCase();
  const all = store.members.filter(m => !srch || [m.name, m.mid, m.un, m.role, m.lid].some(f => f.toLowerCase().includes(srch)));
  const [showAdd, setShowAdd] = useState(false);

  const ghostBtn = "px-2.5 py-1 text-[11px] border border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-all font-medium";

  return (
    <div>
      {isAdmin && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <button onClick={() => PRINT.allMembers()} className={ghostBtn}>🖨 Print all</button>
          <button onClick={() => EXPORT.allMembers()} className={ghostBtn}>📥 Export CSV</button>
          <button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Add member</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
        {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => (
          <div key={k} className="bg-card border border-border rounded-lg p-3" style={{ borderLeft: `3px solid ${UNIT_COLORS[k]}` }}>
            <div className="text-[22px] font-semibold text-foreground leading-none mb-1">{store.members.filter(m => m.ut === k).length}</div>
            <div className="text-2xs text-muted-foreground">{u.label}</div>
          </div>
        ))}
      </div>

      {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => {
        const mems = all.filter(m => m.ut === k);
        if (!mems.length) return null;
        return (
          <div key={k} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[3px] h-3.5 rounded-full" style={{ background: UNIT_COLORS[k] }} />
              <span className="text-[11px] font-medium">{u.label}</span>
              <span className="text-2xs text-muted-foreground">{mems.length} members</span>
              {isAdmin && (
                <>
                  <button onClick={() => PRINT.unitMembers(k)} className="ml-auto px-2 py-0.5 rounded text-2xs font-medium bg-[#DBEAFE] text-[#1E40AF] hover:opacity-75">Print</button>
                  <button onClick={() => EXPORT.unitMembers(k)} className="px-2 py-0.5 rounded text-2xs font-medium bg-secondary text-muted-foreground border border-border hover:opacity-75">CSV</button>
                </>
              )}
            </div>
            <MemberTable members={mems} />
          </div>
        );
      })}

      {showAdd && <MemberFormModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
