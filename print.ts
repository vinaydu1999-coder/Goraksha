import { DB, UNITS, UnitType, UNIT_COLORS, INST_TYPES, Member, Meeting, ABVPEvent } from '@/lib/store';

const PRINT_CSS = `
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,sans-serif;padding:28px;color:#111;font-size:12px;line-height:1.5}
.no-print{margin-bottom:16px;display:flex;gap:8px}
.no-print button{padding:6px 16px;border-radius:4px;border:none;cursor:pointer;font-size:12px;font-weight:500}
.btn-print{background:#D85A30;color:white}
.btn-close{background:#e5e7eb;color:#333}
.hdr{display:flex;align-items:center;gap:14px;border-bottom:2px solid #D85A30;padding-bottom:14px;margin-bottom:22px}
.logo{width:44px;height:44px;border-radius:50%;overflow:hidden;border:2px solid rgba(216,90,48,.3);flex-shrink:0}
.logo img{width:100%;height:100%;object-fit:contain}
.org-name{font-size:15px;font-weight:700}.org-sub{font-size:10px;color:#666;margin-top:2px}
h2{font-size:15px;font-weight:700;margin:20px 0 10px;color:#111;border-bottom:1px solid #e5e5e5;padding-bottom:6px}
h3{font-size:12px;font-weight:600;margin:14px 0 7px;color:#444}
table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:16px}
th{background:#f5f5f5;padding:7px 10px;text-align:left;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#555;border-bottom:1px solid #ddd}
td{padding:7px 10px;border-bottom:0.5px solid #eee;vertical-align:middle}
tr:last-child td{border-bottom:none}
.id-badge{display:inline-block;padding:2px 6px;background:#f0f0f0;border:1px solid #ddd;border-radius:3px;font-family:monospace;font-size:9px}
.unit-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px}
.card{border:1px solid #e5e5e5;border-radius:6px;padding:12px 14px;margin-bottom:10px;break-inside:avoid}
.card-title{font-size:13px;font-weight:600;margin-bottom:4px}
.card-meta{font-size:10px;color:#666;margin-bottom:4px;display:flex;flex-wrap:wrap;gap:8px}
.card-desc{font-size:11px;color:#444;line-height:1.55;margin-bottom:6px}
.card-notes{border-left:3px solid #D85A30;padding:7px 10px;background:#fff8f5;font-size:10px;color:#555;margin-top:6px;line-height:1.5}
.accent{display:inline-block;padding:2px 7px;border-radius:3px;font-size:9px;font-weight:600;margin-right:4px}
.footer{margin-top:28px;border-top:1px solid #eee;padding-top:10px;font-size:10px;color:#aaa;text-align:center}
@media print{.no-print{display:none}body{padding:16px}}
</style>`;

const UNIT_HEX: Record<string, string> = { prant: '#D85A30', mahanagar: '#534AB7', nagar: '#3B6D11', parisar: '#185FA5' };

function header() {
  return `<div class="hdr">
    <div class="logo"><img src="/icon-192.png" alt="ABVP"/></div>
    <div><div class="org-name">ABVP Goraksha Prant</div><div class="org-sub">Akhil Bharatiya Vidyarthi Parishad</div></div>
  </div>`;
}

function footer() {
  return `<div class="footer">ABVP Goraksha Prant — Printed on ${new Date().toLocaleDateString('en-IN')}</div>`;
}

function openPrintWindow(html: string, title: string) {
  const w = window.open('', '_blank', 'width=900,height=740');
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${title}</title>${PRINT_CSS}</head><body>
  <div class="no-print"><button class="btn-print" onclick="window.print()">🖨 Print</button><button class="btn-close" onclick="window.close()">Close</button></div>
  ${header()}${html}${footer()}</body></html>`);
  w.document.close();
}

function memberRow(m: Member) {
  const inst = m.iid ? DB.instById(m.iid) : null;
  return `<tr>
    <td><span class="id-badge">${m.mid}</span></td>
    <td><strong>${m.name}</strong></td>
    <td>${m.role}</td>
    <td><span class="unit-dot" style="background:${UNIT_HEX[m.ut] || '#888'}"></span>${UNITS[m.ut]?.label || m.ut}</td>
    <td>${inst ? inst.name : m.ic || '—'}</td>
    <td style="font-family:monospace;font-size:10px">${m.lid}</td>
  </tr>`;
}

function memberTableHTML(members: Member[], title: string) {
  return `<h2>${title} (${members.length})</h2>
  <table>
    <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Unit</th><th>Institution</th><th>Login ID</th></tr></thead>
    <tbody>${members.map(memberRow).join('')}</tbody>
  </table>`;
}

function itemCardHTML(x: Meeting | ABVPEvent, kind: string) {
  const inames = (x.iids || []).map(id => DB.instShort(id, '')).filter(Boolean).join(', ');
  return `<div class="card">
    <div class="card-title">${x.title}</div>
    <div class="card-meta">
      <span>${x.date}${'time' in x && x.time ? ' · ' + x.time : ''}</span>
      <span class="accent" style="background:#eee">${x.type.toUpperCase()}</span>
      <span>${UNITS[x.ul as UnitType]?.label || 'All units'}</span>
      <span class="accent" style="background:${x.status === 'completed' ? '#D1FAE5' : '#FEF3C7'}">${x.status}</span>
      ${'venue' in x && x.venue ? `<span>📍 ${x.venue}</span>` : ''}
    </div>
    ${inames ? `<div style="font-size:10px;color:#185FA5;margin-bottom:4px">Institutions: ${inames}</div>` : ''}
    <div class="card-desc">${x.desc}</div>
    ${x.notes ? `<div class="card-notes">${x.notes}</div>` : ''}
    <div style="font-size:10px;color:#888;margin-top:4px">${x.att || 0} attended</div>
  </div>`;
}

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function memberCSVRow(m: Member): string[] {
  const inst = m.iid ? DB.instById(m.iid) : null;
  return [m.mid, m.name, m.role, UNITS[m.ut]?.label || m.ut, m.un, inst ? inst.name : m.ic || '', m.lid];
}

export const PRINT = {
  unitMembers(unitKey: UnitType) {
    const mems = DB.members.filter(m => m.ut === unitKey);
    openPrintWindow(memberTableHTML(mems, `${UNITS[unitKey].label} Unit — Members`), `${UNITS[unitKey].label} Members`);
  },
  unitMeetings(unitKey: UnitType) {
    const mts = DB.meetings.filter(m => m.ul === unitKey || m.ul === 'all');
    openPrintWindow(`<h2>${UNITS[unitKey].label} Unit — Meetings (${mts.length})</h2>${mts.map(m => itemCardHTML(m, 'meeting')).join('')}`, `${UNITS[unitKey].label} Meetings`);
  },
  unitEvents(unitKey: UnitType) {
    const evs = DB.events.filter(e => e.ul === unitKey || e.ul === 'all');
    openPrintWindow(`<h2>${UNITS[unitKey].label} Unit — Events (${evs.length})</h2>${evs.map(e => itemCardHTML(e, 'event')).join('')}`, `${UNITS[unitKey].label} Events`);
  },
  instMembers(instId: string) {
    const inst = DB.instById(instId);
    if (!inst) return;
    const mems = DB.members.filter(m => m.iid === instId);
    openPrintWindow(memberTableHTML(mems, `${inst.name} — Members`), `${inst.short} Members`);
  },
  instMeetings(instId: string) {
    const inst = DB.instById(instId);
    if (!inst) return;
    const mts = DB.meetings.filter(m => (m.iids || []).includes(instId));
    openPrintWindow(`<h2>${inst.name} — Meetings (${mts.length})</h2>${mts.map(m => itemCardHTML(m, 'meeting')).join('')}`, `${inst.short} Meetings`);
  },
  instEvents(instId: string) {
    const inst = DB.instById(instId);
    if (!inst) return;
    const evs = DB.events.filter(e => (e.iids || []).includes(instId));
    openPrintWindow(`<h2>${inst.name} — Events (${evs.length})</h2>${evs.map(e => itemCardHTML(e, 'event')).join('')}`, `${inst.short} Events`);
  },
  allMembers() {
    let html = '';
    (Object.entries(UNITS) as [UnitType, typeof UNITS[UnitType]][]).forEach(([k, u]) => {
      const mems = DB.members.filter(m => m.ut === k);
      if (mems.length) html += memberTableHTML(mems, `${u.label} Unit`);
    });
    openPrintWindow(html, 'All Members');
  },
  allMeetings() {
    const mts = DB.meetings;
    openPrintWindow(`<h2>All Meetings (${mts.length})</h2>${mts.map(m => itemCardHTML(m, 'meeting')).join('')}`, 'All Meetings');
  },
  allEvents() {
    const evs = DB.events;
    openPrintWindow(`<h2>All Events (${evs.length})</h2>${evs.map(e => itemCardHTML(e, 'event')).join('')}`, 'All Events');
  },
};

export const EXPORT = {
  unitMembers(unitKey: UnitType) {
    const mems = DB.members.filter(m => m.ut === unitKey);
    downloadCSV(`${UNITS[unitKey].label}_members.csv`, ['ID', 'Name', 'Role', 'Unit', 'Unit Name', 'Institution', 'Login ID'], mems.map(memberCSVRow));
  },
  instMembers(instId: string) {
    const inst = DB.instById(instId);
    if (!inst) return;
    const mems = DB.members.filter(m => m.iid === instId);
    downloadCSV(`${inst.short}_members.csv`, ['ID', 'Name', 'Role', 'Unit', 'Unit Name', 'Institution', 'Login ID'], mems.map(memberCSVRow));
  },
  allMembers() {
    downloadCSV('all_members.csv', ['ID', 'Name', 'Role', 'Unit', 'Unit Name', 'Institution', 'Login ID'], DB.members.map(memberCSVRow));
  },
  allMeetings() {
    const headers = ['ID', 'Title', 'Date', 'Time', 'Type', 'Unit', 'Status', 'Attendees', 'Description'];
    const rows = DB.meetings.map(m => [m.id, m.title, m.date, m.time, m.type, UNITS[m.ul as UnitType]?.label || m.ul, m.status, String(m.att), m.desc]);
    downloadCSV('all_meetings.csv', headers, rows);
  },
  allEvents() {
    const headers = ['ID', 'Title', 'Date', 'Type', 'Venue', 'Unit', 'Status', 'Attendees', 'Description'];
    const rows = DB.events.map(e => [e.id, e.title, e.date, e.type, 'venue' in e ? e.venue : '', UNITS[e.ul as UnitType]?.label || e.ul, e.status, String(e.att), e.desc]);
    downloadCSV('all_events.csv', headers, rows);
  },
};
