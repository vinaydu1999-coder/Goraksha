import { DB, INST_TYPES, UnitType, UNIT_COLORS, UNITS } from '@/lib/store';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import MemberTable from './MemberTable';
import ItemCard from './ItemCard';
import { ModalShell, Field } from './ItemCard';
import { toast } from 'sonner';
import MemberFormModal from './MemberFormModal';
import MeetingEventFormModal from './MeetingEventFormModal';
import { PRINT, EXPORT } from '@/lib/print';

interface Props { search: string; subTab: string; }

export default function InstitutionsPage({ search, subTab }: Props) {
  const store = useStore();
  const { isAdmin } = useAuth();
  const [selId, setSelId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  const sv = search.toLowerCase();
  const filtered = store.institutions.filter(i => !sv || i.name.toLowerCase().includes(sv) || i.short.toLowerCase().includes(sv));
  const groups = {
    university: filtered.filter(i => i.type === 'university'),
    college: filtered.filter(i => i.type === 'college'),
    school: filtered.filter(i => i.type === 'school'),
  };

  const inst = selId ? DB.instById(selId) : null;
  const mems = inst ? store.members.filter(m => m.iid === selId) : [];
  const mts = inst ? store.meetings.filter(m => (m.iids || []).includes(selId!)) : [];
  const evs = inst ? store.events.filter(e => (e.iids || []).includes(selId!)) : [];

  const ghostBtn = "px-2.5 py-1 text-[11px] border border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-all font-medium";

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
        {[
          { v: store.institutions.filter(i => i.type === 'university').length, l: 'Universities' },
          { v: store.institutions.filter(i => i.type === 'college').length, l: 'Colleges' },
          { v: store.institutions.filter(i => i.type === 'school').length, l: 'Schools' },
          { v: store.institutions.length, l: 'Total' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3">
            <div className="text-[22px] font-semibold text-foreground leading-none mb-1">{k.v}</div>
            <div className="text-2xs text-muted-foreground">{k.l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-3">
        {/* List */}
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col max-h-[60vh] sm:max-h-[70vh]">
          <div className="px-3.5 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
            <span className="text-2xs font-semibold text-muted-foreground uppercase tracking-wide">All institutions</span>
            {isAdmin && <button onClick={() => setShowAdd(true)} className="px-2.5 py-1 text-2xs border border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-all">+ Add</button>}
          </div>
          <input className="mx-3 my-2 px-2 py-1 border border-border rounded-md text-[11px] bg-background text-foreground focus:outline-none focus:border-primary" placeholder="Filter…" value={filter} onChange={e => setFilter(e.target.value)} />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {(['university', 'college', 'school'] as const).map(type => {
              let items = groups[type];
              if (filter) items = items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()) || i.short.toLowerCase().includes(filter.toLowerCase()));
              if (!items.length) return null;
              const t = INST_TYPES[type];
              return (
                <div key={type}>
                  <div className="px-3.5 py-1.5 text-[9px] font-semibold tracking-wider uppercase text-muted-foreground bg-background border-b border-border">
                    {type.charAt(0).toUpperCase() + type.slice(1)}s
                  </div>
                  {items.map(i => (
                    <div key={i.id} onClick={() => setSelId(i.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 cursor-pointer border-b border-border border-l-2 transition-all
                        ${selId === i.id ? 'bg-accent-bg border-l-primary' : 'border-l-transparent hover:bg-background'}`}>
                      <div className="w-8 h-8 rounded flex items-center justify-center text-[9px] font-semibold tracking-wide flex-shrink-0 font-mono" style={{ background: t.bg, color: t.tc }}>{i.short.slice(0, 4)}</div>
                      <div>
                        <div className="text-[11px] font-medium text-foreground truncate max-w-[140px]">{i.name}</div>
                        <div className="text-2xs text-muted-foreground">{store.members.filter(m => m.iid === i.id).length} members</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {!inst ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-2 text-muted-foreground text-xs">
              <div className="text-3xl opacity-30">🏛</div>
              <div>Select an institution to view details</div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3.5 border-b border-border">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded flex items-center justify-center text-[11px] font-semibold font-mono" style={{ background: INST_TYPES[inst.type].bg, color: INST_TYPES[inst.type].tc }}>{inst.short.slice(0, 4)}</div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{inst.name}</div>
                    <div className="text-2xs text-muted-foreground">{inst.type.charAt(0).toUpperCase() + inst.type.slice(1)} • Goraksha Prant</div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-1.5 mb-2.5">
                    <button onClick={() => setEditId(inst.id)} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#FEF3C7] text-[#633806] hover:opacity-75">Edit</button>
                    <button onClick={() => { if (confirm('Remove this institution?')) { await DB.deleteInst(inst.id); setSelId(null); } }} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#FEE2E2] text-[#791F1F] hover:opacity-75">Remove</button>
                  </div>
                )}
                <div className="flex gap-4">
                  {[
                    { v: mems.length, l: 'Members' },
                    { v: mts.length, l: 'Meetings' },
                    { v: evs.length, l: 'Events' },
                    { v: mts.filter(m => m.status === 'completed').length + evs.filter(e => e.status === 'completed').length, l: 'Completed' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div className="text-lg font-semibold text-foreground leading-none">{s.v}</div>
                      <div className="text-2xs text-muted-foreground mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
                {subTab === 'members' && (
                  <>
                    {isAdmin && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <button onClick={() => PRINT.instMembers(selId!)} className={ghostBtn}>🖨 Print</button>
                        <button onClick={() => EXPORT.instMembers(selId!)} className={ghostBtn}>📥 CSV</button>
                        <button onClick={() => setShowMemberForm(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Add member</button>
                      </div>
                    )}
                    <MemberTable members={mems} />
                  </>
                )}
                {subTab === 'meetings' && (
                  <>
                    {isAdmin && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <button onClick={() => PRINT.instMeetings(selId!)} className={ghostBtn}>🖨 Print</button>
                        <button onClick={() => setShowMeetingForm(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Meeting</button>
                      </div>
                    )}
                    {mts.length === 0 ? <EmptyState msg="No meetings" /> : mts.map(m => <ItemCard key={m.id} item={m} kind="meeting" />)}
                  </>
                )}
                {subTab === 'events' && (
                  <>
                    {isAdmin && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <button onClick={() => PRINT.instEvents(selId!)} className={ghostBtn}>🖨 Print</button>
                        <button onClick={() => setShowEventForm(true)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity">+ Event</button>
                      </div>
                    )}
                    {evs.length === 0 ? <EmptyState msg="No events" /> : evs.map(e => <ItemCard key={e.id} item={e} kind="event" />)}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showAdd && <InstFormModal onClose={() => setShowAdd(false)} onCreated={id => setSelId(id)} />}
      {editId && <InstFormModal editId={editId} onClose={() => setEditId(null)} />}
      {showMemberForm && selId && <MemberFormModal preInstId={selId} onClose={() => setShowMemberForm(false)} />}
      {showMeetingForm && selId && <MeetingEventFormModal kind="meeting" preIids={[selId]} onClose={() => setShowMeetingForm(false)} />}
      {showEventForm && selId && <MeetingEventFormModal kind="event" preIids={[selId]} onClose={() => setShowEventForm(false)} />}
    </div>
  );
}

function InstFormModal({ editId, onClose, onCreated }: { editId?: string; onClose: () => void; onCreated?: (id: string) => void }) {
  const existing = editId ? DB.instById(editId) : null;
  const [name, setName] = useState(existing?.name || '');
  const [short, setShort] = useState(existing?.short || '');
  const [type, setType] = useState(existing?.type || 'university');

  const save = async () => {
    if (!name.trim() || !short.trim()) { toast('Fill all fields'); return; }
    if (existing) {
      await DB.updateInst(editId!, { name: name.trim(), short: short.trim(), type: type as any });
      toast('Saved');
    } else {
      const x = await DB.addInst({ name: name.trim(), short: short.trim(), type: type as any });
      toast('Institution added');
      onCreated?.(x.id);
    }
    onClose();
  };

  return (
    <ModalShell title={existing ? 'Edit institution' : 'Add institution'} onClose={onClose} onSave={save} saveLabel={existing ? 'Save' : 'Add'}>
      <Field label="Full name"><input value={name} onChange={e => setName(e.target.value)} className="modal-input" placeholder="e.g. BRD Medical College" /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Short name"><input value={short} onChange={e => setShort(e.target.value)} className="modal-input" placeholder="BRD" /></Field>
        <Field label="Type">
          <select value={type} onChange={e => setType(e.target.value as any)} className="modal-input">
            <option value="university">University</option>
            <option value="college">College</option>
            <option value="school">School</option>
          </select>
        </Field>
      </div>
    </ModalShell>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return <div className="text-center py-7 text-[11px] text-muted-foreground"><div className="text-xl opacity-30 mb-1.5">—</div>{msg}</div>;
}
