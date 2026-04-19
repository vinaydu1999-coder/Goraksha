import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import ItemCard from './ItemCard';
import { useState } from 'react';
import MeetingEventFormModal from './MeetingEventFormModal';
import { PRINT, EXPORT } from '@/lib/print';

interface Props { search: string; }

export default function AllMeetingsPage({ search }: Props) {
  const store = useStore();
  const { isAdmin } = useAuth();
  const [flt, setFlt] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const srch = search.toLowerCase();

  const list = store.meetings.filter(m =>
    (!srch || m.title.toLowerCase().includes(srch) || m.desc.toLowerCase().includes(srch)) &&
    (flt === 'all' || m.ul === flt || m.status === flt || m.type === flt)
  );

  const filters = ['all', 'upcoming', 'completed', 'online', 'offline', 'prant', 'mahanagar', 'nagar', 'parisar'];
  const ghostBtn = "px-2.5 py-1 text-[11px] border border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-all font-medium";

  return (
    <div>
      {isAdmin && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <button onClick={() => PRINT.allMeetings()} className={ghostBtn}>🖨 Print all</button>
          <button onClick={() => EXPORT.allMeetings()} className={ghostBtn}>📥 Export CSV</button>
          <button onClick={() => setShowCreate(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Meeting</button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
        {[
          { v: store.meetings.length, l: 'Total' },
          { v: store.meetings.filter(m => m.status === 'upcoming').length, l: 'Upcoming' },
          { v: store.meetings.filter(m => m.status === 'completed').length, l: 'Completed' },
          { v: store.meetings.filter(m => m.type === 'online').length, l: 'Online' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3">
            <div className="text-[22px] font-semibold text-foreground leading-none mb-1">{k.v}</div>
            <div className="text-2xs text-muted-foreground">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {filters.map(f => (
          <button key={f} onClick={() => setFlt(f)}
            className={`px-2.5 py-1 rounded text-2xs font-medium border transition-all
              ${flt === f ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {list.length === 0
        ? <div className="text-center py-7 text-[11px] text-muted-foreground">No meetings match filters</div>
        : list.map(m => <ItemCard key={m.id} item={m} kind="meeting" />)}
      {showCreate && <MeetingEventFormModal kind="meeting" onClose={() => setShowCreate(false)} />}
    </div>
  );
}
