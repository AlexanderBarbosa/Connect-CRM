import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserAgent,
  DepartmentQueue,
  Contact,
  Conversation,
  Message,
  WhatsAppConnection,
  QuickReply,
  ChatbotOption,
  ServerMetricState,
  ServerLogEntry,
  CRMStage
} from '../types/crm';
import {
  INITIAL_AGENTS,
  INITIAL_QUEUES,
  INITIAL_CONTACTS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_CONNECTIONS,
  INITIAL_QUICK_REPLIES,
  INITIAL_CHATBOT_OPTIONS
} from '../utils/mockData';
import { sound } from '../utils/sound';

interface CrmContextType {
  // Navigation & active views
  activeView: 'chat' | 'kanban' | 'contacts' | 'quick_replies' | 'chatbot' | 'connections' | 'admin' | 'server';
  setActiveView: (view: 'chat' | 'kanban' | 'contacts' | 'quick_replies' | 'chatbot' | 'connections' | 'admin' | 'server') => void;

  // Conversations & Chat
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  activeMessages: Message[];
  selectConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string, isInternalNote?: boolean, mediaUrl?: string) => void;
  receiveClientMessage: (conversationId: string, content: string, mediaUrl?: string) => void;
  simulateNewInboundClientMessage: (name: string, phone: string, text: string, queueId?: string) => void;
  resolveConversation: (conversationId: string) => void;
  reopenConversation: (conversationId: string) => void;
  transferConversation: (conversationId: string, newAgentId?: string, newQueueId?: string) => void;
  deleteConversation: (conversationId: string) => void;

  // Contacts & CRM
  contacts: Contact[];
  updateContact: (id: string, updates: Partial<Contact>) => void;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => Contact;
  updateCrmStage: (contactId: string, newStage: CRMStage, dealValue?: number) => void;

  // Agents & Current Profile
  agents: UserAgent[];
  currentAgent: UserAgent;
  setCurrentAgentId: (agentId: string) => void;
  addAgent: (agent: Omit<UserAgent, 'id' | 'activeTicketsCount'>) => void;
  updateAgent: (id: string, updates: Partial<UserAgent>) => void;

  // Queues / Departments
  queues: DepartmentQueue[];
  addQueue: (queue: Omit<DepartmentQueue, 'id'>) => void;
  updateQueue: (id: string, updates: Partial<DepartmentQueue>) => void;

  // WhatsApp Connections
  connections: WhatsAppConnection[];
  restartConnection: (id: string) => void;
  disconnectConnection: (id: string) => void;
  connectConnection: (id: string) => void;

  // Quick Replies
  quickReplies: QuickReply[];
  addQuickReply: (qr: Omit<QuickReply, 'id'>) => void;
  deleteQuickReply: (id: string) => void;

  // Chatbot
  chatbotOptions: ChatbotOption[];
  updateChatbotOption: (id: string, updates: Partial<ChatbotOption>) => void;

  // Server & Full Admin Console
  serverMetrics: ServerMetricState;
  serverLogs: ServerLogEntry[];
  addServerLog: (level: ServerLogEntry['level'], source: string, message: string, payload?: any) => void;
  clearServerLogs: () => void;
  executeServerCommand: (cmd: string) => string;

  // Simulation & Audio Settings
  soundEnabled: boolean;
  toggleSound: () => void;
  autoSimulationActive: boolean;
  toggleAutoSimulation: () => void;
  triggerQuickRandomSimulation: () => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'chat' | 'kanban' | 'contacts' | 'quick_replies' | 'chatbot' | 'connections' | 'admin' | 'server'>('chat');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSimulationActive, setAutoSimulationActive] = useState(false);

  // Core entities
  const [agents, setAgents] = useState<UserAgent[]>(() => {
    const saved = localStorage.getItem('connect_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  const [currentAgentId, setCurrentAgentIdState] = useState<string>('agent_alexandre');

  const [queues, setQueues] = useState<DepartmentQueue[]>(() => {
    const saved = localStorage.getItem('connect_queues');
    return saved ? JSON.parse(saved) : INITIAL_QUEUES;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('connect_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  // Conversations sorted by lastMessageTimestamp descending (newest message on top)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('connect_conversations');
    const list: Conversation[] = saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    return list.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('connect_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_mariana');

  const [connections, setConnections] = useState<WhatsAppConnection[]>(() => {
    const saved = localStorage.getItem('connect_connections');
    return saved ? JSON.parse(saved) : INITIAL_CONNECTIONS;
  });

  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(() => {
    const saved = localStorage.getItem('connect_quick_replies');
    return saved ? JSON.parse(saved) : INITIAL_QUICK_REPLIES;
  });

  const [chatbotOptions, setChatbotOptions] = useState<ChatbotOption[]>(() => {
    const saved = localStorage.getItem('connect_chatbot_options');
    return saved ? JSON.parse(saved) : INITIAL_CHATBOT_OPTIONS;
  });

  // Server state & logs
  const [serverMetrics, setServerMetrics] = useState<ServerMetricState>({
    nodeVersion: 'v22.14.0',
    expressStatus: 'running',
    uptimeSeconds: 172840,
    memoryRssMb: 148.4,
    memoryHeapUsedMb: 72.8,
    memoryHeapTotalMb: 112.0,
    activeSocketsCount: 14,
    processedWebhooksCount: 843,
    cpuPercent: 3.2,
    eventLoopDelayMs: 1.4,
    lastPingMs: 12,
  });

  const [serverLogs, setServerLogs] = useState<ServerLogEntry[]>([
    {
      id: 'log_0',
      timestamp: Date.now() - 1000 * 60 * 30,
      level: 'info',
      source: 'SERVER_BOOT',
      message: 'Node.js Express API Server started on port 3000 (0.0.0.0:3000). Full admin access granted.',
    },
    {
      id: 'log_1',
      timestamp: Date.now() - 1000 * 60 * 25,
      level: 'socket',
      source: 'BAILEYS_SOCKET',
      message: 'Conexão WhatsApp Matriz (+55 11 98844-3322) autenticada com sucesso (STATE: OPEN).',
      payload: { connectionId: 'conn_matriz', protocol: 'E2E_NOISE_SECURE' },
    },
    {
      id: 'log_2',
      timestamp: Date.now() - 1000 * 60 * 15,
      level: 'info',
      source: 'AUTO_BUMP_ENGINE',
      message: 'Módulo de Priorização Ativa: Inbound messages configuradas para subir automaticamente para o topo (#1).',
    },
    {
      id: 'log_3',
      timestamp: Date.now() - 1000 * 60 * 2,
      level: 'webhook',
      source: 'WHATSAPP_WEBHOOK',
      message: 'Mensagem recebida de Mariana Silveira (+55 11 99882-1405). Conversa reordenada para o Topo da Fila.',
      payload: { conversationId: 'conv_mariana', type: 'text', unread: 1 },
    },
  ]);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('connect_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('connect_messages', JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem('connect_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('connect_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('connect_queues', JSON.stringify(queues));
  }, [queues]);

  useEffect(() => {
    localStorage.setItem('connect_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('connect_quick_replies', JSON.stringify(quickReplies));
  }, [quickReplies]);

  // Sound sync
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      sound.setEnabled(next);
      return next;
    });
  }, []);

  // Server logger
  const addServerLog = useCallback((level: ServerLogEntry['level'], source: string, message: string, payload?: any) => {
    const newEntry: ServerLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      level,
      source,
      message,
      payload,
    };
    setServerLogs(prev => [newEntry, ...prev.slice(0, 150)]);
  }, []);

  // Current agent lookup
  const currentAgent = useMemo(() => {
    return agents.find(a => a.id === currentAgentId) || agents[0];
  }, [agents, currentAgentId]);

  const setCurrentAgentId = (id: string) => {
    setCurrentAgentIdState(id);
    const ag = agents.find(a => a.id === id);
    if (ag) {
      addServerLog('info', 'AUTH_SWITCH', `Operador atual alternado para: ${ag.name} (Papel: ${ag.role.toUpperCase()})`);
    }
  };

  // Active conversation lookup
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesMap[activeConversationId] || [];
  }, [messagesMap, activeConversationId]);

  // Select conversation (clears unread badge)
  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id);
    if (id) {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === id) {
            return { ...c, unreadCount: 0, bumpedRecently: false };
          }
          return c;
        })
      );
    }
  }, []);

  // Send message as agent
  const sendMessage = useCallback((conversationId: string, content: string, isInternalNote = false, mediaUrl?: string) => {
    const timestamp = Date.now();
    const newMsg: Message = {
      id: `msg_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderType: 'agent',
      senderName: currentAgent.name,
      content,
      type: mediaUrl ? 'image' : 'text',
      timestamp,
      status: 'sent',
      isInternalNote,
      mediaUrl,
    };

    // Update message history
    setMessagesMap(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    if (!isInternalNote) {
      sound.playOutgoingMessage();
      // Update last message in conversation
      setConversations(prev =>
        prev.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: {
                content,
                timestamp,
                senderType: 'agent',
                status: 'sent',
              },
              lastMessageTimestamp: timestamp,
              status: c.status === 'waiting' ? 'open' : c.status,
              assignedAgentId: c.assignedAgentId || currentAgent.id,
              assignedAgentName: c.assignedAgentName || currentAgent.name,
            };
          }
          return c;
        })
      );

      // Increment messages sent in connection metrics
      setConnections(prev =>
        prev.map(conn => ({ ...conn, messagesSentToday: conn.messagesSentToday + 1 }))
      );

      addServerLog('socket', 'OUTBOUND_SEND', `Mensagem enviada por ${currentAgent.name} -> Conversa ${conversationId}`, {
        text: content.slice(0, 50),
        internal: isInternalNote,
      });
    } else {
      addServerLog('info', 'NOTE_ADDED', `Nota interna adicionada por ${currentAgent.name} em ${conversationId}`);
    }
  }, [currentAgent, addServerLog]);

  /**
   * CRITICAL REQUIRED FUNCTION:
   * "com a função que coloca automaticamente no topo as conversas quando os clientes enviam novas mensagens"
   *
   * 1. Updates timestamp of conversation to current ms
   * 2. Increments unreadCount
   * 3. Sets bumpedRecently = true (visual spotlight effect)
   * 4. Re-sorts entire conversations array so this chat is at index 0 (#1 position)
   * 5. Plays incoming WhatsApp chime
   * 6. Emits server log entry with webhook payload details
   */
  const receiveClientMessage = useCallback((conversationId: string, content: string, mediaUrl?: string) => {
    const timestamp = Date.now();
    const targetConv = conversations.find(c => c.id === conversationId);
    const clientName = targetConv ? targetConv.contact.name : 'Cliente';
    const clientPhone = targetConv ? targetConv.contact.phone : 'WhatsApp Inbound';

    const newMsg: Message = {
      id: `msg_in_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId,
      senderType: 'client',
      senderName: clientName,
      content,
      type: mediaUrl ? 'image' : 'text',
      timestamp,
      status: 'delivered',
      mediaUrl,
    };

    // Update messages map
    setMessagesMap(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // Re-sort conversations placing this conversation on the top!
    setConversations(prev => {
      const updatedList = prev.map(c => {
        if (c.id === conversationId) {
          const isCurrentlyActive = activeConversationId === conversationId;
          return {
            ...c,
            lastMessage: {
              content,
              timestamp,
              senderType: 'client' as const,
              status: 'delivered' as const,
            },
            lastMessageTimestamp: timestamp, // Instant update to now
            unreadCount: isCurrentlyActive ? 0 : c.unreadCount + 1,
            bumpedRecently: true,
            status: c.status === 'closed' ? 'open' : c.status,
          };
        }
        return c;
      });

      // Strict auto-sort: conversation with most recent timestamp comes first!
      return updatedList.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    });

    // Play pleasant incoming chime
    sound.playIncomingMessage();

    // Increment connection stats
    setConnections(prev =>
      prev.map(conn => ({ ...conn, messagesReceivedToday: conn.messagesReceivedToday + 1 }))
    );

    // Update server metrics processed webhooks count
    setServerMetrics(prev => ({
      ...prev,
      processedWebhooksCount: prev.processedWebhooksCount + 1,
      lastPingMs: Math.floor(Math.random() * 8 + 6),
    }));

    // Log to server console
    addServerLog(
      'webhook',
      'WHATSAPP_INBOUND',
      `[AUTO-TOPO] Mensagem recebida de "${clientName}" (${clientPhone}) -> Conversa movida para o TOPO da fila (#1)`,
      {
        conversationId,
        content: content.slice(0, 60),
        newTimestamp: timestamp,
        action: 'AUTO_BUMP_TO_TOP',
      }
    );

    // Remove the visual highlight pulse after 4 seconds
    setTimeout(() => {
      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, bumpedRecently: false } : c))
      );
    }, 4000);
  }, [conversations, activeConversationId, addServerLog]);

  // Simulate new incoming message from an existing or new client
  const simulateNewInboundClientMessage = useCallback((name: string, phone: string, text: string, queueId = 'dept_vendas') => {
    const timestamp = Date.now();
    // Check if contact already exists
    let contact = contacts.find(c => c.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
    if (!contact) {
      contact = {
        id: `ct_${timestamp}`,
        name,
        phone,
        tags: ['Novo Lead', 'Inbound'],
        crmStage: 'novo_lead',
        dealValue: 1500,
        notes: 'Contato iniciado espontaneamente via WhatsApp Inbound.',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setContacts(prev => [contact!, ...prev]);
    }

    // Check if conversation exists
    let existingConv = conversations.find(c => c.contactId === contact!.id);
    let convId = existingConv ? existingConv.id : `conv_${timestamp}`;

    const queueObj = queues.find(q => q.id === queueId) || queues[0];

    if (!existingConv) {
      // Create new conversation and put it at the very top
      const newConv: Conversation = {
        id: convId,
        contactId: contact.id,
        contact,
        queueId: queueObj.id,
        queueName: queueObj.name,
        status: 'waiting',
        unreadCount: 1,
        lastMessage: {
          content: text,
          timestamp,
          senderType: 'client',
          status: 'delivered',
        },
        lastMessageTimestamp: timestamp,
        isPinned: false,
        bumpedRecently: true,
        channelId: 'conn_matriz',
        dealValue: contact.dealValue,
        priority: 'high',
        createdAt: timestamp,
      };

      setConversations(prev => [newConv, ...prev].sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp));

      const newMsg: Message = {
        id: `msg_in_${timestamp}`,
        conversationId: convId,
        senderType: 'client',
        senderName: name,
        content: text,
        type: 'text',
        timestamp,
        status: 'delivered',
      };

      setMessagesMap(prev => ({
        ...prev,
        [convId]: [newMsg],
      }));

      sound.playIncomingMessage();

      addServerLog(
        'webhook',
        'WHATSAPP_INBOUND',
        `[NOVA CONVERSA] Cliente "${name}" enviou mensagem inicial -> Criada e posicionada no TOPO (#1)`,
        { phone, text }
      );

      setTimeout(() => {
        setConversations(prev =>
          prev.map(c => (c.id === convId ? { ...c, bumpedRecently: false } : c))
        );
      }, 4000);
    } else {
      receiveClientMessage(convId, text);
    }
  }, [contacts, conversations, queues, receiveClientMessage, addServerLog]);

  // Quick random simulation trigger
  const triggerQuickRandomSimulation = useCallback(() => {
    const randomSamples = [
      {
        convId: 'conv_lucas',
        text: 'Acabei de enviar a autorização da diretoria! Consegue liberar nosso acesso hoje?',
      },
      {
        convId: 'conv_mariana',
        text: 'Alexandre, transferi o valor pelo PIX! Segue o comprovante de pagamento.',
      },
      {
        convId: 'conv_roberto',
        text: 'Olá! Vocês fazem demonstração ao vivo para a nossa equipe médica amanhã?',
      },
      {
        convId: 'conv_patricia',
        text: 'Obrigada pelo boleto! Já agendei no banco para liquidação.',
      },
      {
        convId: 'conv_felipe',
        text: 'Fizemos as contas e queremos contratar o plano Enterprise para as 15 filiais!',
      },
    ];

    const pick = randomSamples[Math.floor(Math.random() * randomSamples.length)];
    receiveClientMessage(pick.convId, pick.text);
  }, [receiveClientMessage]);

  // Background auto-simulation timer for real-time customer activity demonstration
  useEffect(() => {
    if (!autoSimulationActive) return;

    const interval = setInterval(() => {
      triggerQuickRandomSimulation();
    }, 18000); // Every 18 seconds

    return () => clearInterval(interval);
  }, [autoSimulationActive, triggerQuickRandomSimulation]);

  const toggleAutoSimulation = () => {
    setAutoSimulationActive(prev => {
      const next = !prev;
      addServerLog(
        'info',
        'SIMULATION_ENGINE',
        next
          ? 'Simulação automática de clientes ativada (Disparos a cada 18s para demonstrar priorização no topo).'
          : 'Simulação automática desativada.'
      );
      return next;
    });
  };

  // Resolve conversation
  const resolveConversation = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return { ...c, status: 'closed' };
        }
        return c;
      })
    );
    addServerLog('info', 'CHAT_RESOLVED', `Atendimento ${conversationId} marcado como RESOLVIDO por ${currentAgent.name}`);
  }, [currentAgent, addServerLog]);

  // Reopen conversation
  const reopenConversation = useCallback((conversationId: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return { ...c, status: 'open' };
        }
        return c;
      })
    );
    addServerLog('info', 'CHAT_REOPENED', `Atendimento ${conversationId} reaberto por ${currentAgent.name}`);
  }, [currentAgent, addServerLog]);

  // Transfer conversation
  const transferConversation = useCallback((conversationId: string, newAgentId?: string, newQueueId?: string) => {
    const targetAgent = agents.find(a => a.id === newAgentId);
    const targetQueue = queues.find(q => q.id === newQueueId);

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            assignedAgentId: newAgentId || c.assignedAgentId,
            assignedAgentName: targetAgent ? targetAgent.name : c.assignedAgentName,
            queueId: newQueueId || c.queueId,
            queueName: targetQueue ? targetQueue.name : c.queueName,
            status: newAgentId ? 'open' : 'waiting',
          };
        }
        return c;
      })
    );

    sound.playTransferChime();
    addServerLog(
      'info',
      'TICKET_TRANSFER',
      `Conversa ${conversationId} transferida para Fila [${targetQueue?.name || 'Inalterada'}] / Atendente [${targetAgent?.name || 'Fila Geral'}]`
    );
  }, [agents, queues, addServerLog]);

  // Delete conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
    }
    addServerLog('warn', 'CHAT_DELETED', `Conversa ${conversationId} removida do CRM.`);
  }, [activeConversationId, addServerLog]);

  // Contact updates
  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts(prev =>
      prev.map(ct => {
        if (ct.id === id) {
          const updated = { ...ct, ...updates };
          // also update within conversations
          setConversations(convs =>
            convs.map(conv => (conv.contactId === id ? { ...conv, contact: updated } : conv))
          );
          return updated;
        }
        return ct;
      })
    );
  }, []);

  const addContact = useCallback((newCt: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact: Contact = {
      ...newCt,
      id: `ct_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContacts(prev => [contact, ...prev]);
    return contact;
  }, []);

  const updateCrmStage = useCallback((contactId: string, newStage: CRMStage, dealValue?: number) => {
    updateContact(contactId, {
      crmStage: newStage,
      dealValue: dealValue !== undefined ? dealValue : undefined,
    });
    addServerLog('info', 'CRM_STAGE_CHANGE', `Contato ${contactId} avançou para etapa [${newStage.toUpperCase()}]`);
  }, [updateContact, addServerLog]);

  // Agent updates
  const addAgent = useCallback((agent: Omit<UserAgent, 'id' | 'activeTicketsCount'>) => {
    const newAg: UserAgent = {
      ...agent,
      id: `agent_${Date.now()}`,
      activeTicketsCount: 0,
    };
    setAgents(prev => [...prev, newAg]);
    addServerLog('info', 'AGENT_CREATED', `Novo atendente cadastrado: ${agent.name} (${agent.role})`);
  }, [addServerLog]);

  const updateAgent = useCallback((id: string, updates: Partial<UserAgent>) => {
    setAgents(prev => prev.map(ag => (ag.id === id ? { ...ag, ...updates } : ag)));
  }, []);

  // Queue updates
  const addQueue = useCallback((queue: Omit<DepartmentQueue, 'id'>) => {
    const newQ: DepartmentQueue = {
      ...queue,
      id: `dept_${Date.now()}`,
    };
    setQueues(prev => [...prev, newQ]);
  }, []);

  const updateQueue = useCallback((id: string, updates: Partial<DepartmentQueue>) => {
    setQueues(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
  }, []);

  // WhatsApp connection controls
  const restartConnection = useCallback((id: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'connecting', lastSyncAt: 'Reiniciando sessão...' } : c))
    );
    addServerLog('socket', 'WHATSAPP_SOCKET', `Reiniciando handshake Baileys/Evolution para conexão ${id}...`);
    setTimeout(() => {
      setConnections(prev =>
        prev.map(c => (c.id === id ? { ...c, status: 'connected', lastSyncAt: 'Agora há pouco' } : c))
      );
      addServerLog('socket', 'WHATSAPP_SOCKET', `Conexão ${id} restabelecida com sucesso.`);
    }, 1500);
  }, [addServerLog]);

  const disconnectConnection = useCallback((id: string) => {
    setConnections(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'disconnected', lastSyncAt: 'Desconectado manualmente' } : c))
    );
    addServerLog('warn', 'WHATSAPP_SOCKET', `Sessão WhatsApp ${id} desconectada pelo administrador.`);
  }, [addServerLog]);

  const connectConnection = useCallback((id: string) => {
    restartConnection(id);
  }, [restartConnection]);

  // Quick reply updates
  const addQuickReply = useCallback((qr: Omit<QuickReply, 'id'>) => {
    const newQr: QuickReply = {
      ...qr,
      id: `qr_${Date.now()}`,
    };
    setQuickReplies(prev => [...prev, newQr]);
  }, []);

  const deleteQuickReply = useCallback((id: string) => {
    setQuickReplies(prev => prev.filter(q => q.id !== id));
  }, []);

  // Chatbot updates
  const updateChatbotOption = useCallback((id: string, updates: Partial<ChatbotOption>) => {
    setChatbotOptions(prev => prev.map(o => (o.id === id ? { ...o, ...updates } : o)));
  }, []);

  const clearServerLogs = useCallback(() => {
    setServerLogs([]);
  }, []);

  // Server Terminal CLI command executor
  const executeServerCommand = useCallback((cmdStr: string): string => {
    const trimmed = cmdStr.trim();
    const [command, ...args] = trimmed.split(' ');

    addServerLog('info', 'TERMINAL_EXEC', `$ ${trimmed}`);

    switch (command.toLowerCase()) {
      case 'help':
        return [
          'CONNECT BACKEND SERVER CLI v4.8.0',
          'Comandos disponíveis:',
          '  status             - Mostra estado de saúde, uptime e memória do servidor',
          '  top                - Lista as conversas no topo com prioridade ativa',
          '  routes             - Lista todas as rotas Express registradas',
          '  restart-worker     - Reinicia o worker do Baileys/WhatsApp Socket',
          '  clear-cache        - Limpa o cache temporário de mensagens e contatos',
          '  webhook-test       - Simula um payload de teste e empurra conversa ao topo',
          '  backup-db          - Gera snapshot de segurança do banco local',
          '  stats              - Estatísticas de mensagens enviadas e recebidas',
          '  env                - Exibe variáveis de ambiente do servidor (sanitizadas)',
          '  clear              - Limpa a tela do terminal',
        ].join('\n');

      case 'status':
        return [
          '● connect-server.service - WhatsApp Multi-Atendimento Backend Core',
          `   Loaded: loaded (/etc/systemd/system/connect-server.service; enabled)`,
          `   Active: active (running) since Thu 2026-11-05 04:19:18 UTC; ${Math.floor(serverMetrics.uptimeSeconds / 3600)}h ${(Math.floor(serverMetrics.uptimeSeconds / 60)) % 60}m ago`,
          `   Main PID: 14209 (node)`,
          `   Node.js: ${serverMetrics.nodeVersion} | Express: 4.21.2 | Mode: PRODUCTION`,
          `   Memory: RSS: ${serverMetrics.memoryRssMb.toFixed(1)}MB, HeapUsed: ${serverMetrics.memoryHeapUsedMb.toFixed(1)}MB`,
          `   Active Sockets: ${serverMetrics.activeSocketsCount} | Webhooks Processed: ${serverMetrics.processedWebhooksCount}`,
          `   Event Loop Lag: ${serverMetrics.eventLoopDelayMs}ms | Auto-Bump Engine: ONLINE`,
        ].join('\n');

      case 'top':
        return [
          '=== FILA DE CONVERSAS PRIORIZADAS NO TOPO ===',
          ...conversations.slice(0, 5).map((c, i) =>
            `#${i + 1} [${new Date(c.lastMessageTimestamp).toLocaleTimeString()}] ${c.contact.name} (${c.contact.phone}) | Fila: ${c.queueName} | Não lidas: ${c.unreadCount} | Status: ${c.status}`
          ),
        ].join('\n');

      case 'routes':
        return [
          '=== ROTAS DO SERVIDOR EXPRESS REGISTRADAS ===',
          'GET    /api/system/health       - Healthcheck & uptime metrics',
          'GET    /api/system/metrics      - Real-time CPU, RAM and socket stats',
          'POST   /api/webhook/whatsapp    - WhatsApp Inbound message receiver (Baileys/Evolution)',
          'POST   /api/messages/send       - Send outbound WhatsApp message',
          'GET    /api/conversations       - List conversations sorted by lastMessageTimestamp DESC',
          'POST   /api/conversations/top   - Force priority bump for conversation',
          'POST   /api/server/restart      - Restart background WhatsApp workers',
        ].join('\n');

      case 'restart-worker':
        restartConnection('conn_matriz');
        return '✓ Worker Baileys reiniciado com sucesso. Sockets sincronizados.';

      case 'clear-cache':
        return '✓ Cache de memória limpo (142 KB liberados). Banco de dados sincronizado.';

      case 'webhook-test':
        triggerQuickRandomSimulation();
        return '✓ Payload de webhook disparado com sucesso! Conversa subiu imediatamente para o topo.';

      case 'backup-db':
        return `✓ Backup gerado com sucesso: /var/backups/connect_crm_backup_${Date.now()}.json (${(JSON.stringify(conversations).length / 1024).toFixed(1)} KB)`;

      case 'stats':
        return [
          '=== ESTATÍSTICAS CONNECT ===',
          `Total de Conversas no Sistema: ${conversations.length}`,
          `Mensagens Enviadas Hoje: ${connections.reduce((acc, c) => acc + c.messagesSentToday, 0)}`,
          `Mensagens Recebidas Hoje: ${connections.reduce((acc, c) => acc + c.messagesReceivedToday, 0)}`,
          `Total de Atendentes Ativos: ${agents.filter(a => a.status === 'online').length}/${agents.length}`,
        ].join('\n');

      case 'env':
        return [
          'NODE_ENV=production',
          'PORT=3000',
          'WHATSAPP_AUTO_TOP_ENABLED=true',
          'WHATSAPP_SOCKET_RETRY_INTERVAL=3000',
          'SECURITY_CORS_ORIGIN=*',
          'DATABASE_STORAGE=local_encrypted_sqlite',
          'CRM_ORGANIZATION=Connect Enterprise Cloud',
        ].join('\n');

      case 'clear':
        return '__CLEAR__';

      default:
        return `Comando não reconhecido: "${command}". Digite "help" para ver a lista de comandos do servidor.`;
    }
  }, [addServerLog, serverMetrics, conversations, connections, agents, restartConnection, triggerQuickRandomSimulation]);

  return (
    <CrmContext.Provider
      value={{
        activeView,
        setActiveView,
        conversations,
        activeConversation,
        activeConversationId,
        activeMessages,
        selectConversation,
        sendMessage,
        receiveClientMessage,
        simulateNewInboundClientMessage,
        resolveConversation,
        reopenConversation,
        transferConversation,
        deleteConversation,
        contacts,
        updateContact,
        addContact,
        updateCrmStage,
        agents,
        currentAgent,
        setCurrentAgentId,
        addAgent,
        updateAgent,
        queues,
        addQueue,
        updateQueue,
        connections,
        restartConnection,
        disconnectConnection,
        connectConnection,
        quickReplies,
        addQuickReply,
        deleteQuickReply,
        chatbotOptions,
        updateChatbotOption,
        serverMetrics,
        serverLogs,
        addServerLog,
        clearServerLogs,
        executeServerCommand,
        soundEnabled,
        toggleSound,
        autoSimulationActive,
        toggleAutoSimulation,
        triggerQuickRandomSimulation,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
