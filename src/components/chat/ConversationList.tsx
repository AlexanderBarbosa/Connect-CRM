import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Conversation, ConversationStatus } from '../../types/crm';
import {
  Search,
  Check,
  CheckCheck,
  Clock,
  Filter,
  ArrowUp,
  Sparkles,
  User,
  Tag,
  CircleDot
} from 'lucide-react';

export const ConversationList: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    currentAgent,
    queues,
    triggerQuickRandomSimulation
  } = useCrm();

  const [tabFilter, setTabFilter] = useState<'all' | 'mine' | 'waiting' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQueueFilter, setSelectedQueueFilter] = useState<string>('all');

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      // Tab filter
      if (tabFilter === 'mine' && c.assignedAgentId !== currentAgent.id) return false;
      if (tabFilter === 'waiting' && c.status !== 'waiting') return false;
      if (tabFilter === 'open' && c.status !== 'open') return false;
      if (tabFilter === 'closed' && c.status !== 'closed') return false;

      // Queue filter
      if (selectedQueueFilter !== 'all' && c.queueId !== selectedQueueFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.contact.name.toLowerCase().includes(q);
        const matchPhone = c.contact.phone.includes(q);
        const matchMsg = c.lastMessage.content.toLowerCase().includes(q);
        const matchTags = c.contact.tags.some(t => t.toLowerCase().includes(q));
        return matchName || matchPhone || matchMsg || matchTags;
      }

      return true;
    });
  }, [conversations, tabFilter, selectedQueueFilter, searchQuery, currentAgent.id]);

  // Counts for tabs
  const countMine = conversations.filter(c => c.assignedAgentId === currentAgent.id && c.status !== 'closed').length;
  const countWaiting = conversations.filter(c => c.status === 'waiting').length;
  const countOpen = conversations.filter(c => c.status === 'open').length;

  const formatTime = (timestamp: number) => {
    const diffMs = Date.now() - timestamp;
    if (diffMs < 60 * 1000) return 'Agora';
    if (diffMs < 3600 * 1000) return `${Math.floor(diffMs / 60000)}m`;
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="w-80 md:w-88 border-r border-slate-800 bg-slate-900/60 flex flex-col h-full shrink-0 select-none">
      {/* Top Search & Filter Bar */}
      <div className="p-3 border-b border-slate-800 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, telefone ou mensagem..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/80 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Queue filter dropdown & auto-top banner */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <select
            value={selectedQueueFilter}
            onChange={e => setSelectedQueueFilter(e.target.value)}
            className="text-[11px] bg-slate-800 text-slate-300 border border-slate-700 rounded-md px-2 py-1 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Todas as Filas</option>
            {queues.map(q => (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ))}
          </select>

          {/* Indicator of Auto-Bump to Top rule */}
          <div
            className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded cursor-help"
            title="Sempre que o cliente envia mensagem, a conversa sobe automaticamente para o topo (#1) com som e badge."
          >
            <ArrowUp className="w-3 h-3 text-emerald-400 animate-bounce" />
            <span>Auto-Topo: Ativo</span>
          </div>
        </div>

        {/* Tab Filter buttons */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950/90 rounded-lg border border-slate-800/80 text-xs">
          <button
            onClick={() => setTabFilter('all')}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-center ${
              tabFilter === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({conversations.length})
          </button>
          <button
            onClick={() => setTabFilter('mine')}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-center ${
              tabFilter === 'mine' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Minhas ({countMine})
          </button>
          <button
            onClick={() => setTabFilter('waiting')}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-center ${
              tabFilter === 'waiting'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            Fila ({countWaiting})
          </button>
          <button
            onClick={() => setTabFilter('closed')}
            className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer text-center ${
              tabFilter === 'closed' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fim
          </button>
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs space-y-2">
            <p>Nenhuma conversa encontrada nesta categoria.</p>
            <button
              onClick={triggerQuickRandomSimulation}
              className="text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Simular cliente enviando mensagem
            </button>
          </div>
        ) : (
          filteredConversations.map((conv, index) => {
            const isSelected = activeConversationId === conv.id;
            const isBumped = conv.bumpedRecently;
            const queueObj = queues.find(q => q.id === conv.queueId);

            return (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`p-3 relative transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-800/90 border-l-2 border-emerald-500'
                    : 'hover:bg-slate-800/40 bg-transparent'
                } ${
                  isBumped
                    ? 'bg-emerald-950/40 ring-1 ring-emerald-500/50 shadow-inner'
                    : ''
                }`}
              >
                {/* Visual tag when freshly pushed to the top */}
                {isBumped && (
                  <div className="absolute top-1 right-2 flex items-center gap-1 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-xs shadow-xs animate-pulse">
                    <ArrowUp className="w-2.5 h-2.5" /> Topo #1 (Nova Mensagem)
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  {/* Contact Avatar / Initials */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs uppercase overflow-hidden">
                      {conv.contact.avatar ? (
                        <img
                          src={conv.contact.avatar}
                          alt={conv.contact.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{conv.contact.name.slice(0, 2)}</span>
                      )}
                    </div>
                    {/* Queue color indicator dot */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900"
                      style={{ backgroundColor: queueObj?.color || '#10B981' }}
                      title={`Fila: ${conv.queueName}`}
                    />
                  </div>

                  {/* Main text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <span className="text-xs font-semibold text-slate-100 truncate">
                        {conv.contact.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums shrink-0">
                        {formatTime(conv.lastMessageTimestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1 truncate">
                      {/* Message sender indicator */}
                      {conv.lastMessage.senderType === 'agent' && (
                        <span className="shrink-0 text-slate-500 flex items-center">
                          {conv.lastMessage.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-sky-400" />
                          ) : (
                            <Check className="w-3 h-3 text-slate-500" />
                          )}
                          <span className="ml-1 text-[10px]">Você:</span>
                        </span>
                      )}
                      <span className={`truncate ${conv.unreadCount > 0 ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                        {conv.lastMessage.content}
                      </span>
                    </div>

                    {/* Meta tags & badging */}
                    <div className="flex items-center justify-between gap-1 mt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        {/* Queue Name */}
                        <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                          {conv.queueName}
                        </span>

                        {/* Assigned agent */}
                        {conv.assignedAgentName && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
                              {conv.assignedAgentName.split(' ')[0]}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Unread badge counter */}
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950 tabular-nums shrink-0 shadow-xs">
                          {conv.unreadCount}
                        </span>
                      )}

                      {/* Waiting status tag */}
                      {conv.status === 'waiting' && conv.unreadCount === 0 && (
                        <span className="text-[9px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/50 px-1 rounded">
                          Aguardando
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
