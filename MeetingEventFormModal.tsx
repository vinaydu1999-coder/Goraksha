import { useState } from 'react';
import { DB, UNITS, UnitType } from '@/lib/store';
import { ModalShell, Field } from './ItemCard';
import { toast } from 'sonner';

interface Props { kind: 'meeting' | 'event'; preUnit?: string; preIids?: string[]; onClose: () => void; }

export default function MeetingEventFormModal({ kind, preUnit = 'all', preIids = [], onClose }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [type, setType] = useState(kind === 'meeting' ? 'offline' : 'seminar');
  const [ul, setUl] = useState(preUnit);
  const [link, setLink] = useState('');
  const [scope, setScope] = useState(preIids.length ? 'inst' : 'unit');
  const [selIids, setSelIids] = useState<string[]>(preIids);

  const toggleIid = (id: string) => setSelIids(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const save = async () => {
    if (!title.trim()) { toast('Enter title'); return; }
    const iids = ['inst', 'multi'].includes(scope) ? selIids : [];
    if (kind === 'meeting') {
      await DB.addMeeting({ title: title.trim(), desc: desc.trim(), date, time, type: type as any, ul, link: link.trim(), scope, iids, att: 0, status: 'upcoming', photos: [], notes: '' });
      toast('Meeting created');
    } else {
      await DB.addEvent({ title: title.trim(), desc: desc.trim(), date, venue: venue.trim(), type: type as any, ul, scope, iids, att: 0, status: 'upcoming', photos: [], notes: '' });
      toast('Event created');
    }
    onClose();
  };

  return (
    <ModalShell title={`Create ${kind}`} onClose={onClose} onSave={save} saveLabel="Create">
      <Field label="Title"><input value={title} onChange={e => setTitle(e.target.value)} className="modal-input" placeholder={`${kind} title`} /></Field>
      <Field label="Description"><textarea value={desc} onChange={e => setDesc(e.target.value)} className="modal-input min-h-[64px] resize-y" placeholder="Details…" /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className="modal-input" /></Field>
        {kind === 'meeting'
          ? <Field label="Time"><input type="time" value={time} onChange={e => setTime(e.target.value)} className="modal-input" /></Field>
          : <Field label="Venue"><input value={venue} onChange={e => setVenue(e.target.value)} className="modal-input" placeholder="Auditorium" /></Field>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Type">
          <select value={type} onChange={e => setType(e.target.value)} className="modal-input">
            {(kind === 'meeting' ? ['offline', 'online'] : ['seminar', 'rally', 'camp']).map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Unit level">
          <select value={ul} onChange={e => setUl(e.target.value)} className="modal-input">
            <option value="all">All units</option>
            {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => <option key={k} value={k}>{u.label}</option>)}
          </select>
        </Field>
      </div>
      {kind === 'meeting' && <Field label="Meeting link (online)"><input value={link} onChange={e => setLink(e.target.value)} className="modal-input" placeholder="https://meet.google.com/…" /></Field>}
      <Field label="Scope">
        <select value={scope} onChange={e => setScope(e.target.value)} className="modal-input">
          <option value="unit">Unit only</option>
          <option value="inst">Specific institutions</option>
          <option value="multi">Multiple institutions</option>
          <option value="all">All institutions</option>
        </select>
      </Field>
      {['inst', 'multi'].includes(scope) && (
        <Field label="Select institutions">
          <div className="border border-border rounded-md max-h-[160px] overflow-y-auto p-1">
            {['university', 'college', 'school'].map(t => {
              const items = DB.institutions.filter(i => i.type === t as any);
              if (!items.length) return null;
              return (
                <div key={t}>
                  <div className="text-[9px] font-semibold tracking-wider uppercase text-muted-foreground px-2 pt-1.5 pb-0.5">{t}s</div>
                  {items.map(i => (
                    <label key={i.id} className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-[11px] text-foreground hover:bg-background">
                      <input type="checkbox" checked={selIids.includes(i.id)} onChange={() => toggleIid(i.id)} className="w-3 h-3 accent-primary" />
                      {i.name} <em className="text-muted-foreground text-2xs not-italic">({i.short})</em>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </Field>
      )}
    </ModalShell>
  );
}
