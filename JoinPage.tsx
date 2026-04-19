import { useState } from 'react';
import { DB, UNITS, UnitType } from '@/lib/store';

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [ut, setUt] = useState('');
  const [un, setUn] = useState('');
  const [iid, setIid] = useState('');
  const [ic, setIc] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const instGroups = ['university', 'college', 'school'].map(t => ({
    label: t.charAt(0).toUpperCase() + t.slice(1) + 's',
    items: DB.institutions.filter(i => i.type === t as any),
  }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !ut || !un.trim()) { setErr('Please fill all required fields'); return; }
    setErr(''); setLoading(true);
    try {
      DB.addJoinRequest({ name: name.trim(), role: role.trim(), ut, un: un.trim(), iid, ic: ic.trim(), meeting_id: null });
      setSubmitted(true);
    } catch (ex: any) {
      setErr('Error: ' + ex.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-5">
      <div className="bg-card rounded-xl p-8 w-full max-w-[400px]">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 bg-card flex-shrink-0">
            <img src="/icon-192.png" alt="ABVP" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-semibold text-card-foreground">ABVP Goraksha Prant</div>
            <div className="text-2xs text-muted-foreground mt-0.5">Akhil Bharatiya Vidyarthi Parishad</div>
          </div>
        </div>

        {!submitted ? (
          <>
            <h1 className="text-[17px] font-semibold mb-1 text-card-foreground">Join ABVP</h1>
            <p className="text-xs text-muted-foreground mb-5">Fill the form below to submit your membership request</p>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-muted-foreground">Full Name *</label>
                <input value={name} onChange={e => setName(e.target.value)} className="modal-input" placeholder="Your full name" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-muted-foreground">Role / Designation *</label>
                <input value={role} onChange={e => setRole(e.target.value)} className="modal-input" placeholder="e.g. Karyakarta" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-muted-foreground">Unit Type *</label>
                <select value={ut} onChange={e => setUt(e.target.value)} className="modal-input" required>
                  <option value="">Select unit type</option>
                  {(Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).map(([k, u]) => <option key={k} value={k}>{u.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-muted-foreground">Unit Name *</label>
                <input value={un} onChange={e => setUn(e.target.value)} className="modal-input" placeholder="e.g. Gorakhpur Mahanagar" required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-muted-foreground">Institution (optional)</label>
                <select value={iid} onChange={e => setIid(e.target.value)} className="modal-input">
                  <option value="">Select institution (optional)</option>
                  {instGroups.map(g => (
                    <optgroup key={g.label} label={g.label}>
                      {g.items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-2xs font-semibold text-muted-foreground">If not listed, enter name</label>
                <input value={ic} onChange={e => setIc(e.target.value)} className="modal-input" placeholder="Custom institution name" />
              </div>
              {err && <div className="text-xs text-destructive text-center">{err}</div>}
              <button type="submit" disabled={loading}
                className="bg-primary text-primary-foreground py-2.5 rounded-md text-xs font-semibold cursor-pointer hover:bg-primary-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                {loading ? 'Submitting…' : 'Submit Request'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="text-4xl mb-3.5">✓</div>
            <div className="text-lg font-semibold mb-2 text-card-foreground">Request submitted</div>
            <div className="text-xs text-muted-foreground leading-relaxed mb-4">
              आपका join request सफलतापूर्वक जमा हो गया है।<br/>
              Admin approval के बाद आपको Login ID और Security Key मिलेगी।<br/><br/>
              Your request has been submitted. You will receive your credentials once approved.
            </div>
            <a href="/" className="inline-block px-5 py-2 bg-navy text-navy-foreground rounded-md text-xs font-medium">← Back to login</a>
          </div>
        )}
      </div>
    </div>
  );
}
