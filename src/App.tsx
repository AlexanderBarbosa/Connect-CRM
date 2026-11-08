import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar } from './components/Sidebar';
import { ChatWorkspace } from './components/chat/ChatWorkspace';
import { CrmKanbanView } from './components/crm/CrmKanbanView';
import { ContactsView } from './components/contacts/ContactsView';
import { QuickRepliesView } from './components/quick-replies/QuickRepliesView';
import { ChatbotQueuesView } from './components/chatbot/ChatbotQueuesView';
import { ConnectionsView } from './components/connections/ConnectionsView';
import { AdminSettingsView } from './components/admin/AdminSettingsView';
import { ServerConsoleView } from './components/server/ServerConsoleView';
import { SimulateClientModal } from './components/chat/SimulateClientModal';

const AppContent: React.FC = () => {
  const { activeView } = useCrm();
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Bar with WhatsApp status and quick test trigger */}
      <TopNavbar onOpenSimulateModal={() => setIsSimulateModalOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic View Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative">
          {activeView === 'chat' && <ChatWorkspace />}
          {activeView === 'kanban' && <CrmKanbanView />}
          {activeView === 'contacts' && <ContactsView />}
          {activeView === 'quick_replies' && <QuickRepliesView />}
          {activeView === 'chatbot' && <ChatbotQueuesView />}
          {activeView === 'connections' && <ConnectionsView />}
          {activeView === 'admin' && <AdminSettingsView />}
          {activeView === 'server' && <ServerConsoleView />}
        </main>
      </div>

      {/* Modal to simulate incoming client WhatsApp message */}
      <SimulateClientModal
        isOpen={isSimulateModalOpen}
        onClose={() => setIsSimulateModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <AppContent />
    </CrmProvider>
  );
}
