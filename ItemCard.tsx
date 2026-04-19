import { DB, UNITS, Meeting, ABVPEvent, UnitType, UNIT_COLORS } from '@/lib/store';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const TYPE_ACCENT: Record<string, string> = {
  seminar: '#534AB7', rally: '#854F0B', camp: '#A32D2D',
  online: '#0F6E56', offline: '#5F5E5A',
};

interface Props { item: Meeting | ABVPEvent; kind: 'meeting' | 'event'; }

export default function ItemCard({ item, kind }: Props) {
  const { isAdmin } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const ul = UNITS[item.ul as UnitType];
  const tc = ul ? UNIT_COLORS[item.ul as UnitType] : '#888';
  const inames = (item.iids || []).map(id => DB.instShort(id, '')).filter(Boolean).join(', ');

  const markDone = async () => {
    if (kind === 'meeting') await DB.updateMeeting(item.id, { status: 'completed' });
    else await DB.updateEvent(item.id, { status: 'completed' });
  };

  const handleDelete = async () => {
    if (!confirm(`Delete this ${kind}?`)) return;
    if (kind === 'meeting') await DB.deleteMeeting(item.id);
    else await DB.deleteEvent(item.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden mb-2 hover:border-foreground/20 transition-colors">
      <div className="h-[2px]" style={{ background: TYPE_ACCENT[item.type] || tc }} />
      <div className="p-3">
        <div className="text-xs font-semibold text-foreground mb-1.5">{item.title}</div>
        <div className="flex flex-wrap gap-1.5 items-center mb-1 text-2xs text-muted-foreground">
          <span>{item.date}{('time' in item && item.time) ? ' · ' + item.time : ''}</span>
          <span className={`tag tag-${item.type}`}>{item.type.toUpperCase()}</span>
          <span className="tag bg-secondary" style={{ color: tc }}>{ul?.label || 'All'}</span>
          <span className={`tag tag-${item.status}`}>{item.status}</span>
          {'venue' in item && item.venue && <span>· {item.venue}</span>}
        </div>
        {inames && <div className="text-2xs text-unit-parisar font-medium mb-1">Institutions: {inames}</div>}
        <div className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">{item.desc}</div>
        {item.notes && (
          <div className="border-l-2 border-primary px-2.5 py-1.5 bg-accent-bg text-2xs text-muted-foreground leading-relaxed mb-1.5">{item.notes}</div>
        )}
      </div>
      <div className="px-3 py-1.5 bg-background border-t border-border flex items-center gap-1.5 flex-wrap">
        {isAdmin && (
          <>
            <button onClick={() => setShowEdit(true)} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#FEF3C7] text-[#633806] hover:opacity-75">Edit</button>
            <button onClick={handleDelete} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#FEE2E2] text-[#791F1F] hover:opacity-75">Delete</button>
          </>
        )}
        {isAdmin && item.status === 'completed'
          ? <button onClick={() => setShowNotes(true)} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#DBEAFE] text-[#1E40AF] hover:opacity-75">{item.notes ? 'Edit notes' : 'Add notes'}</button>
          : isAdmin && item.status !== 'completed'
          ? <button onClick={markDone} className="px-2 py-0.5 rounded text-2xs font-medium bg-[#D1FAE5] text-[#065F46] hover:opacity-75">Mark complete</button>
          : null}
        <span className="ml-auto text-2xs text-muted-foreground">{item.att || 0} attended</span>
      </div>

      {showEdit && <EditItemModal item={item} kind={kind} onClose={() => setShowEdit(false)} />}
      {showNotes && <NotesModal item={item} kind={kind} onClose={() => setShowNotes(false)} />}
    </div>
  );
}

function EditItemModal({ item, kind, onClose }: { item: Meeting | ABVPEvent; kind: string; onClose: () => void }) {
  const [title, setTitle] = useState(item.title);
  const [desc, setDesc] = useState(item.desc);
  const [date, setDate] = useState(item.date);
  const [att, setAtt] = useState(item.att);
  const [type, setType] = useState(item.type);
  const [extra, setExtra] = useState(kind === 'meeting' ? (item as Meeting).link || '' : (item as ABVPEvent).venue || '');

  const save = async () => {
    const d: any = { title, desc, date, att: Number(att), type };
    if (kind === 'meeting') { d.link = extra; await DB.updateMeeting(item.id, d); }
    else { d.venue = extra; await DB.updateEvent(item.id, d); }
    onClose();
  };

  return (
    <ModalShell title={`Edit ${kind}`} onClose={onClose} onSave={save}>
      <Field label="Title"><input value={title} onChange={e => setTitle(e.target.value)} className="modal-input" /></Field>
      <Field label="Description"><textarea value={desc} onChange={e => setDesc(e.target.value)} className="modal-input min-h-[64px] resize-y" /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className="modal-input" /></Field>
        <Field label="Attendees"><input type="number" value={att} onChange={e => setAtt(Number(e.target.value))} className="modal-input" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Type">
          <select value={type} onChange={e => setType(e.target.value as any)} className="modal-input">
            {(kind === 'meeting' ? ['online', 'offline'] : ['seminar', 'rally', 'camp']).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label={kind === 'meeting' ? 'Link' : 'Venue'}><input value={extra} onChange={e => setExtra(e.target.value)} className="modal-input" /></Field>
      </div>
    </ModalShell>
  );
}

function NotesModal({ item, kind, onClose }: { item: Meeting | ABVPEvent; kind: string; onClose: () => void }) {
  const [notes, setNotes] = useState(item.notes || '');
  const save = async () => {
    if (kind === 'meeting') await DB.updateMeeting(item.id, { notes });
    else await DB.updateEvent(item.id, { notes });
    onClose();
  };
  return (
    <ModalShell title={`Notes — ${item.title}`} onClose={onClose} onSave={save} saveLabel="Save notes">
      <p className="text-2xs text-muted-foreground mb-2">Decisions, resolutions, and action points:</p>
      <Field label=""><textarea value={notes} onChange={e => setNotes(e.target.value)} className="modal-input min-h-[110px] resize-y" /></Field>
    </ModalShell>
  );
}

export function ModalShell({ title, onClose, onSave, saveLabel = 'Save', children }: {
  title: string; onClose: () => void; onSave: () => void | Promise<void>;
  saveLabel?: string; children: React.ReactNode;
}) {
  const [saving, setSaving] = useState(false);
  const handle = async () => { setSaving(true); await onSave(); setSaving(false); };

  return (
    <div className="fixed inset-0 bg-foreground/45 z-[800] flex items-end justify-center backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-card rounded-t-xl w-full max-w-[520px] max-h-[90dvh] flex flex-col overflow-hidden animate-slide-up">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
          <button onClick={onClose} className="text-sm text-muted-foreground px-2 py-0.5 rounded hover:bg-background">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 custom-scrollbar">{children}</div>
        <div className="px-4 py-2.5 border-t border-border flex justify-end gap-2 flex-shrink-0 pb-[max(10px,env(safe-area-inset-bottom))]">
          <button onClick={onClose} className="px-3 py-1.5 border border-border rounded-md text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all">Cancel</button>
          <button onClick={handle} disabled={saving} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-[11px] font-medium hover:opacity-85 transition-opacity disabled:opacity-60">
            {saving ? 'Saving…' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-2xs font-semibold text-muted-foreground tracking-wide">{label}</label>}
      {children}
    </div>
  );
}
