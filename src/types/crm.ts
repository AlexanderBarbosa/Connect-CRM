export type UserRole = 'super_admin' | 'admin' | 'supervisor' | 'agent';

export interface UserAgent {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  departmentIds: string[];
  activeTicketsCount: number;
}

export interface DepartmentQueue {
  id: string;
  name: string;
  color: string;
  description: string;
  distributionRule: 'round_robin' | 'least_busy' | 'manual';
  autoGreeting: string;
  isActive: boolean;
}

export type CRMStage = 'novo_lead' | 'qualificacao' | 'em_atendimento' | 'proposta' | 'negociacao' | 'ganho' | 'perdido';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  company?: string;
  tags: string[];
  crmStage: CRMStage;
  dealValue: number;
  notes: string;
  createdAt: string;
  customFields?: Record<string, string>;
}

export type MessageType = 'text' | 'image' | 'audio' | 'document';
export type MessageSender = 'client' | 'agent' | 'bot' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  conversationId: string;
  senderType: MessageSender;
  senderName: string;
  content: string;
  type: MessageType;
  timestamp: number; // Unix timestamp in ms
  status: MessageStatus;
  isInternalNote?: boolean;
  mediaUrl?: string;
  caption?: string;
}

export type ConversationStatus = 'waiting' | 'open' | 'closed' | 'bot';

export interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;
  assignedAgentId?: string;
  assignedAgentName?: string;
  queueId: string;
  queueName: string;
  status: ConversationStatus;
  unreadCount: number;
  lastMessage: {
    content: string;
    timestamp: number;
    senderType: MessageSender;
    status: MessageStatus;
  };
  lastMessageTimestamp: number; // Critical for auto-bump to top
  isPinned?: boolean;
  bumpedRecently?: boolean; // Highlight effect when moved to top
  channelId: string; // WhatsApp connection id
  dealValue: number;
  priority: 'normal' | 'high' | 'urgent';
  createdAt: number;
}

export interface WhatsAppConnection {
  id: string;
  name: string;
  phoneNumber: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'qrcode';
  batteryLevel: number;
  sessionUptime: string;
  messagesSentToday: number;
  messagesReceivedToday: number;
  qrCodeSeed: string;
  lastSyncAt: string;
}

export interface QuickReply {
  id: string;
  shortcut: string; // e.g. "/ola"
  title: string;
  content: string;
  departmentId?: string;
}

export interface ChatbotOption {
  id: string;
  digit: string; // "1", "2", "3"
  label: string;
  targetQueueId: string;
  responseMessage: string;
}

export interface ServerMetricState {
  nodeVersion: string;
  expressStatus: 'running' | 'restarting' | 'error';
  uptimeSeconds: number;
  memoryRssMb: number;
  memoryHeapUsedMb: number;
  memoryHeapTotalMb: number;
  activeSocketsCount: number;
  processedWebhooksCount: number;
  cpuPercent: number;
  eventLoopDelayMs: number;
  lastPingMs: number;
}

export interface ServerLogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'webhook' | 'socket';
  source: string;
  message: string;
  payload?: any;
}
