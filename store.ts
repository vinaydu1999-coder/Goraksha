// ─────────────────────────────────────────────────────────────
// Data layer — Firebase Firestore
// ─────────────────────────────────────────────────────────────
import {
  collection, doc, getDocs, setDoc, addDoc, updateDoc,
  deleteDoc, onSnapshot, query, orderBy, writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ───────────────────────────────────────────────────

export interface Institution {
  id: string; name: string; short: string; type: 'university' | 'college' | 'school';
}
export interface Member {
  id: string; name: string; mid: string; lid: string; key: string;
  ut: UnitType; un: string; role: string; iid: string; ic: string; approved?: boolean;
}
export interface Meeting {
  id: string; title: string; date: string; time: string; type: 'online' | 'offline';
  ul: string; scope: string; iids: string[]; link: string; desc: string;
  att: number; status: 'upcoming' | 'completed'; photos: string[]; notes: string;
}
export interface ABVPEvent {
  id: string; title: string; date: string; type: 'seminar' | 'rally' | 'camp';
  ul: string; scope: string; iids: string[]; venue: string; desc: string;
  att: number; status: 'upcoming' | 'completed'; photos: string[]; notes: string;
}
export interface JoinRequest {
  id: string; name: string; role: string; ut: string; un: string;
  iid: string; ic: string; status: 'pending' | 'approved' | 'rejected';
  createdAt: string; meeting_id?: string | null;
}

export type UnitType = 'prant' | 'mahanagar' | 'nagar' | 'parisar';

// ─── Constants ───────────────────────────────────────────────

export const UNITS: Record<UnitType, { label: string; color: string; prefix: string }> = {
  prant:     { label: 'Prant',     color: 'var(--unit-prant)',     prefix: 'PR' },
  mahanagar: { label: 'Mahanagar', color: 'var(--unit-mahanagar)', prefix: 'MN' },
  nagar:     { label: 'Nagar',     color: 'var(--unit-nagar)',     prefix: 'NG' },
  parisar:   { label: 'Parisar',   color: 'var(--unit-parisar)',   prefix: 'PS' },
};

export const UNIT_COLORS: Record<UnitType, string> = {
  prant:     'hsl(16, 70%, 52%)',
  mahanagar: 'hsl(248, 40%, 50%)',
  nagar:     'hsl(100, 72%, 24%)',
  parisar:   'hsl(211, 78%, 37%)',
};

export const INST_TYPES: Record<string, { bg: string; tc: string }> = {
  university: { bg: '#E6F1FB', tc: '#0C447C' },
  college:    { bg: '#EEEDFE', tc: '#3C3489' },
  school:     { bg: '#EAF3DE', tc: '#27500A' },
};

// ─── Seed data (written to Firestore only once on first load) ─

const SEED_INSTITUTIONS: Omit<Institution, 'id'>[] = [
  { name:'Deen Dayal Upadhyaya Gorakhpur University', short:'DDU',         type:'university' },
  { name:'BRD Medical College',                        short:'BRD',         type:'college'    },
  { name:'MMMUT Gorakhpur',                            short:'MMMUT',       type:'university' },
  { name:'Gorakhpur University Law College',           short:'Law GKP',     type:'college'    },
  { name:'St. Andrews College',                        short:'St. Andrews', type:'college'    },
  { name:'Virendra Nath PG College',                   short:'VN PG',       type:'college'    },
  { name:'Kendriya Vidyalaya Gorakhpur',               short:'KV GKP',      type:'school'     },
  { name:'Navy Children School',                       short:'NCS',         type:'school'     },
  { name:'Jawahar Navodaya Vidyalaya',                 short:'JNV',         type:'school'     },
  { name:'City Montessori School',                     short:'CMS',         type:'school'     },
];

const SEED_MEMBERS: Omit<Member, 'id'>[] = [
  { name:'Admin',        mid:'ADMIN001', lid:'admin_ADMIN001',    key:'Admin@123',  ut:'prant',     un:'Goraksha Prant',      role:'admin',           iid:'', ic:'', approved:true },
  { name:'Ram Kumar',    mid:'PR001',    lid:'ramkumar_PR001',    key:'xK9mP2qR',   ut:'prant',     un:'Goraksha Prant',      role:'Prant Mantri',    iid:'', ic:'' },
  { name:'Sita Devi',    mid:'PR002',    lid:'sitadevi_PR002',    key:'Lp4nQw7Z',   ut:'prant',     un:'Goraksha Prant',      role:'Prant Sachiv',    iid:'', ic:'' },
  { name:'Arjun Singh',  mid:'MN001',    lid:'arjunsingh_MN001',  key:'Rz8kTm3Y',   ut:'mahanagar', un:'Gorakhpur Mahanagar', role:'Maha. Pramukh',   iid:'', ic:'' },
  { name:'Priya Sharma', mid:'MN002',    lid:'priyasharma_MN002', key:'Wq5vXj6B',   ut:'mahanagar', un:'Gorakhpur Mahanagar', role:'Maha. Sachiv',    iid:'', ic:'' },
  { name:'Vijay Yadav',  mid:'MN003',    lid:'vijayyadav_MN003',  key:'Nc7hEd9K',   ut:'mahanagar', un:'Gorakhpur Mahanagar', role:'Karyakarta',      iid:'', ic:'' },
  { name:'Kavita Gupta', mid:'NG001',    lid:'kavita_NG001',      key:'Bh2mJk8L',   ut:'nagar',     un:'Nagar Ekak-5 DDU',    role:'Nagar Pramukh',   iid:'', ic:'' },
  { name:'Deepak Tiwari',mid:'NG002',    lid:'deepak_NG002',      key:'Xp3nRv6W',   ut:'nagar',     un:'Nagar Ekak-5 DDU',    role:'Nagar Sachiv',    iid:'', ic:'' },
  { name:'Sunita Verma', mid:'NG003',    lid:'sunita_NG003',      key:'Qt7wDs4F',   ut:'nagar',     un:'Nagar Ekak-3 BRD',    role:'Karyakarta',      iid:'', ic:'Govt. Girls College' },
  { name:'Mohan Lal',    mid:'PS001',    lid:'mohanlal_PS001',    key:'Yz9cMf5N',   ut:'parisar',   un:'Parisar-2 DDU',       role:'Parisar Pramukh', iid:'', ic:'' },
  { name:'Anita Rani',   mid:'PS002',    lid:'anita_PS002',       key:'Gk6vEb3P',   ut:'parisar',   un:'Parisar-1 BRD',       role:'Parisar Sachiv',  iid:'', ic:'' },
  { name:'Ravi Shankar', mid:'PS003',    lid:'ravi_PS003',        key:'Mj4xCu8T',   ut:'parisar',   un:'Parisar-2 DDU',       role:'Karyakarta',      iid:'', ic:'' },
];

const SEED_MEETINGS: Omit<Meeting, 'id'>[] = [
  { title:'Monthly Prant Review',       date:'2025-04-05', time:'10:00', type:'online',  ul:'prant',     scope:'unit',  iids:[],     link:'https://meet.google.com/prant', desc:'Monthly coordination and strategy for all Prant-level units.',  att:12, status:'upcoming',  photos:[], notes:'' },
  { title:'Mahanagar Samiti Baithak',   date:'2025-04-08', time:'11:00', type:'offline', ul:'mahanagar', scope:'unit',  iids:[],     link:'',                               desc:'Mahanagar coordination meeting at Gorakhpur HQ.',               att:8,  status:'upcoming',  photos:[], notes:'' },
  { title:'DDU Campus Ekak Baithak',    date:'2025-04-10', time:'09:00', type:'offline', ul:'nagar',     scope:'inst',  iids:[],     link:'',                               desc:'DDU unit coordination meeting.',                                att:20, status:'upcoming',  photos:[], notes:'' },
  { title:'BRD Medical Student Session',date:'2025-04-14', time:'16:00', type:'offline', ul:'all',       scope:'inst',  iids:[],     link:'',                               desc:'Session for medical college student members.',                  att:35, status:'upcoming',  photos:[], notes:'' },
  { title:'All-Institution Baithak',    date:'2025-03-28', time:'10:00', type:'online',  ul:'all',       scope:'all',   iids:[],     link:'https://meet.google.com/all',    desc:'Full Prant-level general meeting with all unit heads.',         att:45, status:'completed', photos:[], notes:'All unit heads attended. Membership drive approved for May.' },
  { title:'Prant Leadership Retreat',   date:'2025-03-20', time:'08:00', type:'offline', ul:'prant',     scope:'unit',  iids:[],     link:'',                               desc:'Two-day leadership development and planning retreat.',           att:18, status:'completed', photos:[], notes:'New SOP for campus events approved.' },
  { title:'Multi-Campus Joint Baithak', date:'2025-05-02', time:'10:00', type:'offline', ul:'all',       scope:'multi', iids:[],     link:'',                               desc:'Joint meeting for DDU and MMMUT unit members.',                 att:0,  status:'upcoming',  photos:[], notes:'' },
];

const SEED_EVENTS: Omit<ABVPEvent, 'id'>[] = [
  { title:'Rashtriya Shiksha Sammelan', date:'2025-04-18', type:'seminar', ul:'prant',   scope:'unit',  iids:[], venue:'DDU Auditorium',        desc:'National education policy discussion with academic leaders.',       att:200, status:'upcoming',  photos:[], notes:'' },
  { title:'Multi-College Sports Day',   date:'2025-04-25', type:'rally',   ul:'all',     scope:'multi', iids:[], venue:'Gandhi Maidan',          desc:'Annual inter-college sports festival for ABVP members.',            att:150, status:'upcoming',  photos:[], notes:'' },
  { title:'DDU Sampark Abhiyan',        date:'2025-04-10', type:'camp',    ul:'nagar',   scope:'inst',  iids:[], venue:'DDU Campus Gate',        desc:'Intensive campus outreach and membership registration camp.',       att:80,  status:'upcoming',  photos:[], notes:'' },
  { title:'KV Annual Lecture Series',   date:'2025-04-20', type:'seminar', ul:'parisar', scope:'inst',  iids:[], venue:'KV Auditorium',          desc:'Annual lecture series for school students.',                        att:120, status:'upcoming',  photos:[], notes:'' },
  { title:'Gyan-Sheel-Ekta Diwas',     date:'2025-03-25', type:'seminar', ul:'all',     scope:'all',   iids:[], venue:'BRD Medical Auditorium', desc:'Prant-level foundation day celebration with cultural events.',    att:350, status:'completed', photos:[], notes:'350+ attendees. Resolution passed for Shiksha Sammelan in April.' },
  { title:'Student Rights Rally',       date:'2025-03-10', type:'rally',   ul:'prant',   scope:'unit',  iids:[], venue:'Gorakhpur Collectorate', desc:'Rally for student fee reduction and hostel facility improvement.', att:500, status:'completed', photos:[], notes:'Memorandum submitted to DM.' },
  { title:'Law College Debate Series',  date:'2025-05-05', type:'seminar', ul:'all',     scope:'inst',  iids:[], venue:'Law College Hall',       desc:'Constitutional rights debate series for law students.',            att:0,   status:'upcoming',  photos:[], notes:'' },
];

// ─── Helpers ─────────────────────────────────────────────────

function uid() { return '_' + Math.random().toString(36).slice(2, 9); }

function stripId<T extends { id: string }>(obj: T): Omit<T, 'id'> {
  const { id, ...rest } = obj;
  return rest;
}

// ─── Store class ─────────────────────────────────────────────

class Store {
  institutions: Institution[] = [];
  members: Member[]           = [];
  meetings: Meeting[]         = [];
  events: ABVPEvent[]         = [];
  joinRequests: JoinRequest[] = [];
  loading: boolean            = true;

  private listeners: Set<() => void> = new Set();
  private unsubscribers: (() => void)[] = [];

  // ── Pub/sub ──────────────────────────────────────────────
  subscribe(fn: () => void) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  private notify() { this.listeners.forEach(fn => fn()); }

  // ── Bootstrap ────────────────────────────────────────────
  async init() {
    // Seed Firestore if collections are empty
    await this.seedIfEmpty();

    // Set up real-time listeners
    this.unsubscribers.push(
      onSnapshot(collection(db, 'institutions'), snap => {
        this.institutions = snap.docs.map(d => ({ id: d.id, ...d.data() } as Institution));
        this.notify();
      }),
      onSnapshot(collection(db, 'members'), snap => {
        this.members = snap.docs.map(d => ({ id: d.id, ...d.data() } as Member));
        this.loading = false;
        this.notify();
      }),
      onSnapshot(collection(db, 'meetings'), snap => {
        this.meetings = snap.docs.map(d => ({ id: d.id, ...d.data() } as Meeting));
        this.notify();
      }),
      onSnapshot(collection(db, 'events'), snap => {
        this.events = snap.docs.map(d => ({ id: d.id, ...d.data() } as ABVPEvent));
        this.notify();
      }),
      onSnapshot(collection(db, 'joinRequests'), snap => {
        this.joinRequests = snap.docs.map(d => ({ id: d.id, ...d.data() } as JoinRequest));
        this.notify();
      }),
    );
  }

  destroy() { this.unsubscribers.forEach(u => u()); }

  private async seedIfEmpty() {
    const snap = await getDocs(collection(db, 'members'));
    if (!snap.empty) return; // already seeded

    const batch = writeBatch(db);

    SEED_INSTITUTIONS.forEach(inst => {
      batch.set(doc(collection(db, 'institutions')), inst);
    });
    SEED_MEMBERS.forEach(m => {
      batch.set(doc(collection(db, 'members')), m);
    });
    SEED_MEETINGS.forEach(mt => {
      batch.set(doc(collection(db, 'meetings')), mt);
    });
    SEED_EVENTS.forEach(ev => {
      batch.set(doc(collection(db, 'events')), ev);
    });

    await batch.commit();
  }

  // ── Institution helpers ──────────────────────────────────
  instById(id: string) { return this.institutions.find(i => i.id === id); }
  instName(iid: string, ic: string) { if (iid) { const i = this.instById(iid); if (i) return i.name; } return ic || '—'; }
  instShort(iid: string, ic: string) { if (iid) { const i = this.instById(iid); if (i) return i.short; } return ic || '—'; }

  async addInst(d: Omit<Institution, 'id'>) {
    const ref = await addDoc(collection(db, 'institutions'), d);
    return { id: ref.id, ...d };
  }
  async updateInst(id: string, d: Partial<Institution>) {
    await updateDoc(doc(db, 'institutions', id), d as any);
  }
  async deleteInst(id: string) {
    await deleteDoc(doc(db, 'institutions', id));
  }

  // ── Member helpers ───────────────────────────────────────
  async addMember(d: Omit<Member, 'id'>) {
    const ref = await addDoc(collection(db, 'members'), d);
    return { id: ref.id, ...d };
  }
  async updateMember(id: string, d: Partial<Member>) {
    await updateDoc(doc(db, 'members', id), d as any);
  }
  async deleteMember(id: string) {
    await deleteDoc(doc(db, 'members', id));
  }

  // ── Meeting helpers ──────────────────────────────────────
  async addMeeting(d: Omit<Meeting, 'id'>) {
    const ref = await addDoc(collection(db, 'meetings'), d);
    return { id: ref.id, ...d };
  }
  async updateMeeting(id: string, d: Partial<Meeting>) {
    await updateDoc(doc(db, 'meetings', id), d as any);
  }
  async deleteMeeting(id: string) {
    await deleteDoc(doc(db, 'meetings', id));
  }

  // ── Event helpers ────────────────────────────────────────
  async addEvent(d: Omit<ABVPEvent, 'id'>) {
    const ref = await addDoc(collection(db, 'events'), d);
    return { id: ref.id, ...d };
  }
  async updateEvent(id: string, d: Partial<ABVPEvent>) {
    await updateDoc(doc(db, 'events', id), d as any);
  }
  async deleteEvent(id: string) {
    await deleteDoc(doc(db, 'events', id));
  }

  // ── Join request helpers ─────────────────────────────────
  async addJoinRequest(d: Omit<JoinRequest, 'id' | 'status' | 'createdAt'>) {
    const payload: Omit<JoinRequest, 'id'> = {
      ...d,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const ref = await addDoc(collection(db, 'joinRequests'), payload);
    return { id: ref.id, ...payload };
  }
  async updateJoinRequest(id: string, d: Partial<JoinRequest>) {
    await updateDoc(doc(db, 'joinRequests', id), d as any);
  }

  // ── Auth (still session-based, credentials stored in Firestore members) ──
  login(loginId: string, key: string): Member | null {
    return this.members.find(m => m.lid === loginId && m.key === key && m.approved !== false) || null;
  }
  getSession(): Member | null {
    try { return JSON.parse(sessionStorage.getItem('abvp_session') || 'null'); } catch { return null; }
  }
  setSession(m: Member) { sessionStorage.setItem('abvp_session', JSON.stringify(m)); }
  clearSession() { sessionStorage.removeItem('abvp_session'); }
}

export const DB = new Store();
