import { DB, UNITS, UnitType } from '@/lib/store';
import { useStore } from '@/hooks/useStore';
import { toast } from 'sonner';

export default function JoinRequestsPage() {
  const store = useStore();
  const list = store.joinRequests;

  const approve = async (id: string) => {
    const r = list.find(x => x.id === id);
    if (!r) return;
    const u = UNITS[r.ut as UnitType];
    if (!u) return;
    const cnt = DB.members.filter(m => m.ut === r.ut).length + 1;
    const mid = u.prefix + String(cnt).padStart(3, '0');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let key = ''; for (let i = 0; i < 8; i++) key += chars[Math.floor(Math.random() * chars.length)];
    const lid = r.name.replace(/\s+/g, '').toLowerCase() + '_' + mid;
    await DB.addMember({ name: r.name, role: r.role, ut: r.ut as UnitType, un: r.un, mid, lid, key, iid: r.iid || '', ic: r.ic || '', approved: true });
    await DB.updateJoinRequest(id, { status: 'approved' });
    toast(`Approved! Login: ${lid} · Key: ${key}`);
  };

  const reject = async (id: string) => {
    await DB.updateJoinRequest(id, { status: 'rejected' });
    toast('Request rejected');
  };

  return (
    <div>
      <div className="text-[11px] text-muted-foreground mb-2.5">{list.filter(r => r.status === 'pending').length} pending requests</div>
      {!list.length && (
        <div className="text-center py-7 text-[11px] text-muted-foreground">
          <div className="text-xl opacity-30 mb-1.5">—</div>No join requests yet
        </div>
      )}
      {list.map(r => (
        <div key={r.id} className={`bg-card border border-border rounded-lg p-3 flex items-center justify-between gap-3 mb-2 flex-wrap
          ${r.status === 'pending' ? 'border-l-[3px] border-l-[#d97706]' : r.status === 'approved' ? 'border-l-[3px] border-l-[#16a34a]' : 'border-l-[3px] border-l-destructive'}`}>
          <div>
            <div className="text-xs font-medium text-foreground mb-1">{r.name}</div>
            <div className="text-2xs text-muted-foreground mb-1.5">{r.role} • {UNITS[r.ut as UnitType]?.label || r.ut} • {r.un} • {DB.instName(r.iid, r.ic)}</div>
            <span className={`tag tag-${r.status}`}>{r.status.toUpperCase()}</span>
          </div>
          {r.status === 'pending' && (
            <div className="flex gap-1.5">
              <button onClick={() => approve(r.id)} className="px-2.5 py-1 rounded text-2xs font-medium bg-[#D1FAE5] text-[#065F46] hover:opacity-75">Approve</button>
              <button onClick={() => reject(r.id)} className="px-2.5 py-1 rounded text-2xs font-medium bg-[#FEE2E2] text-[#791F1F] hover:opacity-75">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
