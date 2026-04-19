import { useState } from 'react';
import { DB, UNITS, UnitType } from '@/lib/store';
import { ModalShell, Field } from './ItemCard';
import { toast } from 'sonner';

interface Props { editId?: string; preUnit?: UnitType; preInstId?: string; onClose: () => void; }

export default function MemberFormModal({ editId, preUnit, preInstId, onClose }: Props) {
  const existing = editId ? DB.members.find(m => m.id === editId) : null;
  const [name, setName] = useState(existing?.name || '');
  const [role, setRole] = useState(existing?.role || '');
  const [ut, setUt] = useState<UnitType>(existing?.ut || preUnit || 'prant');
  const [un, setUn] = useState(existing?.un || '');
  const [iid, setIid] = useState(existing?.iid || preInstId || '');
  const [ic, setIc] = useState(existing?.ic || '');

  const save = async () => {
    if (!name.trim() || (!existing && (!role.trim() || !un.trim()))) { toast('Fill all required fields'); return; }
    if (existing) {
      await DB.updateMember(editId!, { name: name.trim(), role: role.trim(), un: un.trim(), iid, ic: ic.trim() });
      toast('Saved');
    } else {
      const u = UNITS[ut];
      const cnt = DB.members.filter(m => m.ut === ut).length + 1;
      const mid = u.prefix + String(cnt).padStart(3, '0');
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      let key = ''; for (let i = 0; i < 8; i++) key += chars[Math.floor(Math.random() * chars.length)];
      const lid = name.replace(/\s+/g, '').toLowerCase() + '_' + mid;
      await DB.addMember({ name: name.trim(), role: role.trim(), ut, un: un.trim(), mid, lid, key, iid, ic: ic.trim(), approved: true });
      toast(`Added — Login: ${lid} · Key: ${key}`);
    }
    onClose();
  };

  const instGroups = ['university', 'college', 'school'].map(t => ({
    label: t.charAt(0).toUpperCase() + t.slice(1) + 's',
    items: DB.institutions.filter(i => i.type === t as any),
  }));

  return (
    <ModalShell title={existing ? 'Edit member' : 'Add member'} onClose={onClose} onSave={save} saveLabel={existing ? 'Save' : 'Add member'}>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Full name"><input value={name} onChange={e => setName(e.target.value)} className="modal-input" placeholder="Ram Kumar" /></Field>
        <Field label="Role"><input value={role} onChange={e => setRole(e.target.value)} className="modal-input" placeholder="Karyakarta" /></Field>
      </div>
      {!existing && (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Unit type">
            <select value={ut} onChange={e => setUt(e.target.value as UnitType)} className="modal-input">
              {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => <option key={k} value={k}>{u.label}</option>)}
            </select>
          </Field>
          <Field label="Unit name"><input value={un} onChange={e => setUn(e.target.value)} className="modal-input" placeholder="Goraksha Prant" /></Field>
        </div>
      )}
      {existing && <Field label="Unit name"><input value={un} onChange={e => setUn(e.target.value)} className="modal-input" /></Field>}
      <Field label="Institution">
        <select value={iid} onChange={e => setIid(e.target.value)} className="modal-input">
          <option value="">Not listed / other</option>
          {instGroups.map(g => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field label="If not listed (optional)"><input value={ic} onChange={e => setIc(e.target.value)} className="modal-input" placeholder="Custom institution name" /></Field>
    </ModalShell>
  );
}
