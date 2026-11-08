import React from 'react';
import { ConversationList } from './ConversationList';
import { ChatRoom } from './ChatRoom';
import { ContactDrawer } from './ContactDrawer';
import { useCrm } from '../../context/CrmContext';

export const ChatWorkspace: React.FC = () => {
  const { activeConversation } = useCrm();

  return (
    <div className="flex-1 flex h-full overflow-hidden min-w-0">
      <ConversationList />
      <ChatRoom />
      {activeConversation && <ContactDrawer />}
    </div>
  );
};
