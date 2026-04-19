import { UNITS, UnitType, UNIT_COLORS } from '@/lib/store';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import MemberTable from './MemberTable';
import ItemCard from './ItemCard';
import { useState } from 'react';
import MemberFormModal from './MemberFormModal';
import MeetingEventFormModal from './MeetingEventFormModal';
import { PRINT, EXPORT } from '@/lib/print';

interface Props { unitKey: UnitType; search: string; subTab: string; }

export default function UnitPage({ unitKey, search, subTab }: Props) {
  const store = useStore();
  const { isAdmin } = useAuth();
  const u = UNITS[unitKey];
  const srch = search.toLowerCase();

  const mems = store.members.filter(m => m.ut === unitKey && (!srch || [m.name, m.mid, m.un, m.role].some(f => f.toLowerCase().includes(srch))));
  const mts = store.meetings.filter(m => (m.ul === unitKey || m.ul === 'all') && (!srch || m.title.toLowerCase().includes(srch)));
  const evs = store.events.filter(e => (e.ul === unitKey || e.ul === 'all') && (!srch || e.title.toLowerCase().includes(srch)));

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  const ghostBtn = "px-2.5 py-1 text-[11px] border border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-all font-medium";

  return (
    <div>
      <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3 mb-3">
        <div className="w-[3px] h-9 rounded-full flex-shrink-0" style={{ background: UNIT_COLORS[unitKey] }} />
        <div>
          <div className="text-sm font-semibold text-foreground">{u.label} Unit</div>
          <div className="text-2xs text-muted-foreground mt-0.5">Goraksha Prant • Prefix: {u.prefix}</div>
          <div className="flex gap-3.5 mt-1.5 text-2xs text-muted-foreground">
            <span><strong className="text-foreground text-xs font-semibold">{mems.length}</strong> members</span>
            <span><strong className="text-foreground text-xs font-semibold">{mts.length}</strong> meetings</span>
            <span><strong className="text-foreground text-xs font-semibold">{evs.length}</strong> events</span>
          </div>
        </div>
      </div>

      {subTab === 'members' && (
        <>
          {isAdmin && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button onClick={() => PRINT.unitMembers(unitKey)} className={ghostBtn}>🖨 Print</button>
              <button onClick={() => EXPORT.unitMembers(unitKey)} className={ghostBtn}>📥 Export CSV</button>
              <button onClick={() => setShowMemberForm(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Add member</button>
            </div>
          )}
          <MemberTable members={mems} />
          {showMemberForm && <MemberFormModal preUnit={unitKey} onClose={() => setShowMemberForm(false)} />}
        </>
      )}
      {subTab === 'meetings' && (
        <>
          {isAdmin && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button onClick={() => PRINT.unitMeetings(unitKey)} className={ghostBtn}>🖨 Print</button>
              <button onClick={() => setShowMeetingForm(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Meeting</button>
            </div>
          )}
          {mts.length === 0 ? <EmptyState msg="No meetings for this unit" /> : mts.map(m => <ItemCard key={m.id} item={m} kind="meeting" />)}
          {showMeetingForm && <MeetingEventFormModal kind="meeting" preUnit={unitKey} onClose={() => setShowMeetingForm(false)} />}
        </>
      )}
      {subTab === 'events' && (
        <>
          {isAdmin && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button onClick={() => PRINT.unitEvents(unitKey)} className={ghostBtn}>🖨 Print</button>
              <button onClick={() => setShowEventForm(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Event</button>
            </div>
          )}
          {evs.length === 0 ? <EmptyState msg="No events for this unit" /> : evs.map(e => <ItemCard key={e.id} item={e} kind="event" />)}
          {showEventForm && <MeetingEventFormModal kind="event" preUnit={unitKey} onClose={() => setShowEventForm(false)} />}
        </>
      )}
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return <div className="text-center py-7 text-[11px] text-muted-foreground"><div className="text-xl opacity-30 mb-1.5">—</div>{msg}</div>;
}
