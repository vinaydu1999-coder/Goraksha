import { DB, UNITS, INST_TYPES, Member, UNIT_COLORS } from '@/lib/store';
import { useState } from 'react';
import MemberFormModal from './MemberFormModal';
import { useAuth } from '@/hooks/useAuth';

interface Props { members: Member[]; }

export default function MemberTable({ members }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  if (!members.length) return (
    <div className="text-center py-7 text-[11px] text-muted-foreground">
      <div className="text-xl opacity-30 mb-1.5">—</div>No members found
    </div>
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              {['ID', 'Name', 'Role', 'Unit', 'Institution', ...(isAdmin ? ['Login ID', 'Key', ''] : [])].map(h => (
                <th key={h} className="bg-background px-2.5 py-1.5 text-left text-[9px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-border whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => {
              const inst = m.iid ? DB.instById(m.iid) : null;
              const instType = inst ? INST_TYPES[inst.type] : null;
              return (
                <tr key={m.id} className="hover:bg-background">
                  <td className="px-2.5 py-2 border-b border-border"><span className="font-mono text-[9px] bg-background border border-border px-1.5 py-0.5 rounded">{m.mid}</span></td>
                  <td className="px-2.5 py-2 border-b border-border font-medium">{m.name}</td>
                  <td className="px-2.5 py-2 border-b border-border">{m.role}</td>
                  <td className="px-2.5 py-2 border-b border-border"><span className="text-2xs font-medium" style={{ color: UNIT_COLORS[m.ut] }}>{UNITS[m.ut]?.label || m.ut}</span></td>
                  <td className="px-2.5 py-2 border-b border-border">
                    {inst ? <span className="tag" style={{ background: instType?.bg, color: instType?.tc }}>{inst.short}</span>
                      : m.ic ? <span className="tag bg-background text-muted-foreground border border-border">{m.ic}</span>
                      : <span className="text-muted-foreground text-2xs">—</span>}
                  </td>
                  {isAdmin && (
                    <>
                      <td className="px-2.5 py-2 border-b border-border font-mono text-2xs text-primary-dim">{m.lid}</td>
                      <td className="px-2.5 py-2 border-b border-border font-mono text-2xs text-destructive">{m.key}</td>
                      <td className="px-2.5 py-2 border-b border-border">
                        <div className="flex gap-1">
                          <button onClick={() => setEditId(m.id)} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#FEF3C7] text-[#633806] hover:opacity-75">Edit</button>
                          <button onClick={async () => { if (confirm('Delete this member?')) await DB.deleteMember(m.id); }} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#FEE2E2] text-[#791F1F] hover:opacity-75">Del</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editId && <MemberFormModal editId={editId} onClose={() => setEditId(null)} />}
    </>
  );
}
