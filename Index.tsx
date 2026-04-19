import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { useStore } from '@/hooks/useStore';
import LoginScreen from '@/components/LoginScreen';
import LoadingScreen from '@/components/LoadingScreen';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/components/Dashboard';
import UnitPage from '@/components/UnitPage';
import InstitutionsPage from '@/components/InstitutionsPage';
import AllMembersPage from '@/components/AllMembersPage';
import AllMeetingsPage from '@/components/AllMeetingsPage';
import AllEventsPage from '@/components/AllEventsPage';
import JoinRequestsPage from '@/components/JoinRequestsPage';
import { UNITS, UnitType } from '@/lib/store';
import { useState } from 'react';

function AppInner() {
  const { user } = useAuth();
  const { loading } = useStore();
  const [forceTab, setForceTab] = useState<string | null>(null);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;

  return (
    <AppLayout>
      {({ tab, search, subTab, setSubTab }) => {
        const activeTab = forceTab || tab;
        if (forceTab) setForceTab(null);

        if (activeTab in UNITS) return <UnitPage unitKey={activeTab as UnitType} search={search} subTab={subTab} />;
        if (activeTab === 'institutions') return <InstitutionsPage search={search} subTab={subTab} />;
        if (activeTab === 'all_members') return <AllMembersPage search={search} />;
        if (activeTab === 'all_meetings') return <AllMeetingsPage search={search} />;
        if (activeTab === 'all_events') return <AllEventsPage search={search} />;
        if (activeTab === 'join_requests') return <JoinRequestsPage />;
        return <Dashboard onNavigate={(t) => setForceTab(t)} />;
      }}
    </AppLayout>
  );
}

export default function Index() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
