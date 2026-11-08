import React, { useState, useRef, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Message } from '../../types/crm';
import {
  Send,
  Lock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  UserCheck,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Zap,
  Phone,
  Building,
  Tag,
  ArrowRightLeft,
  X
} from 'lucide-react';

export const ChatRoom: React.FC = () => {
  const {
    activeConversation,
    activeMessages,
    sendMessage,
    receiveClientMessage,
    resolveConversation,
    reopenConversation,
    transferConversation,
    quickReplies,
    agents,
    queues,
    currentAgent
  } = useCrm();

  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetAgentId, setTargetAgentId] = useState('');
  const [targetQueueId, setTargetQueueId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-base font-semibold text-slate-200 mb-1">
          Nenhuma conversa selecionada
        </h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Selecione uma conversa na lista à esquerda para iniciar o atendimento, responder clientes ou gerenciar o funil.
        </p>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(activeConversation.id, inputText.trim(), isInternalNote);
    setInputText('');
    setIsInternalNote(false);
    setShowQuickReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === '/' && inputText.length === 0) {
      setShowQuickReplies(true);
    }
  };

  const insertQuickReply = (content: string) => {
    // Replace placeholders
    const filled = content
      .replace(/{{atendente}}/g, currentAgent.name)
      .replace(/{{nome}}/g, activeConversation.contact.name)
      .replace(/{{protocolo}}/g, Math.floor(100000 + Math.random() * 900000).toString());

    setInputText(filled);
    setShowQuickReplies(false);
  };

  // Quick simulated client reply to test auto-bump
  const simulateClientReplyNow = (customMsg?: string) => {
    const text = customMsg || 'Entendi perfeitamente! Pode dar prosseguimento ao meu pedido.';
    receiveClientMessage(activeConversation.id, text);
  };

  const handleTransfer = () => {
    transferConversation(activeConversation.id, targetAgentId || undefined, targetQueueId || undefined);
    setShowTransferModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 select-none min-w-0">
      {/* Chat Room Header */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between gap-4 shrink-0">
        {/* Contact Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs uppercase overflow-hidden shrink-0">
            {activeConversation.contact.avatar ? (
              <img
                src={activeConversation.contact.avatar}
                alt={activeConversation.contact.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{activeConversation.contact.name.slice(0, 2)}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 truncate">
                {activeConversation.contact.name}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded truncate">
                {activeConversation.contact.phone}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="truncate">Fila: <strong className="text-slate-300">{activeConversation.queueName}</strong></span>
              <span className="text-slate-600">·</span>
              <span className="truncate">
                Atendente: <strong className="text-slate-300">{activeConversation.assignedAgentName || 'Não atribuído'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick trigger for client message */}
          <button
            onClick={() => simulateClientReplyNow()}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 rounded-md hover:bg-emerald-900/60 transition-colors cursor-pointer"
            title="Simular cliente enviando uma resposta agora para ver subir no topo"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px]">Cliente Responde</span>
          </button>

          {/* Transfer button */}
          <button
            onClick={() => {
              setTargetAgentId(activeConversation.assignedAgentId || '');
              setTargetQueueId(activeConversation.queueId);
              setShowTransferModal(true);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
            title="Transferir atendimento para outro atendente ou setor"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline text-[11px]">Transferir</span>
          </button>

          {/* Resolve / Reopen button */}
          {activeConversation.status === 'closed' ? (
            <button
              onClick={() => reopenConversation(activeConversation.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/70 border border-amber-800/60 rounded-md hover:bg-amber-900/60 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Reabrir</span>
            </button>
          ) : (
            <button
              onClick={() => resolveConversation(activeConversation.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 rounded-md hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-[11px]">Finalizar</span>
            </button>
          )}
        </div>
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950">
        {activeMessages.map(msg => {
          const isAgent = msg.senderType === 'agent';
          const isNote = msg.isInternalNote;

          if (isNote) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="max-w-md w-full bg-amber-950/40 border border-amber-700/60 rounded-lg p-2.5 text-amber-200 text-xs shadow-xs">
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-medium mb-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      Nota Interna (Visível apenas para a equipe)
                    </span>
                    <span className="font-mono tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-[10px] text-amber-400/80 mt-1 text-right">Por: {msg.senderName}</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs shadow-sm relative group ${
                  isAgent
                    ? 'bg-emerald-700 text-white rounded-tr-xs'
                    : 'bg-slate-800 text-slate-100 rounded-tl-xs border border-slate-700/60'
                }`}
              >
                {/* Sender title if in group or multiteam */}
                {!isAgent && (
                  <p className="text-[10px] font-semibold text-emerald-400 mb-0.5">
                    {msg.senderName}
                  </p>
                )}

                {msg.mediaUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-black/20">
                    <img src={msg.mediaUrl} alt="Anexo WhatsApp" className="max-w-full h-auto object-cover max-h-48" />
                  </div>
                )}

                <p className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</p>

                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono tabular-nums ${
                    isAgent ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isAgent && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-300" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Flyout Popup */}
      {showQuickReplies && (
        <div className="mx-4 p-2 mb-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" /> Respostas Rápidas (Macros)
            </span>
            <button
              onClick={() => setShowQuickReplies(false)}
              className="text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {quickReplies.map(qr => (
              <button
                key={qr.id}
                onClick={() => insertQuickReply(qr.content)}
                className="w-full text-left p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer group flex items-start justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">{qr.shortcut}</span>
                    <span className="text-xs font-medium text-slate-200">{qr.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{qr.content}</p>
                </div>
                <span className="text-[10px] text-slate-500 group-hover:text-emerald-400 shrink-0">Inserir</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Composer Section */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        {/* Mode switch (WhatsApp message vs Internal Note) */}
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInternalNote(false)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                !isInternalNote
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mensagem WhatsApp
            </button>
            <button
              onClick={() => setIsInternalNote(true)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                isInternalNote
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Nota Interna</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
              title="Abrir respostas rápidas (atalho: digite / no início do texto)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Respostas Rápidas ( / )</span>
            </button>
          </div>
        </div>

        {/* Text Input Row */}
        <div
          className={`flex items-end gap-2 p-2 rounded-xl border transition-colors ${
            isInternalNote
              ? 'bg-amber-950/20 border-amber-700/60'
              : 'bg-slate-950 border-slate-800 focus-within:border-emerald-500'
          }`}
        >
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isInternalNote
                ? 'Escreva um comentário interno que apenas atendentes e supervisores verão...'
                : 'Digite uma mensagem (Pressione Enter para enviar, Shift+Enter para quebra)...'
            }
            rows={2}
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 resize-none focus:outline-hidden"
          />

          <div className="flex items-center gap-1 shrink-0 pb-0.5">
            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`p-2 rounded-lg text-white font-medium transition-colors cursor-pointer ${
                inputText.trim()
                  ? isInternalNote
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-4 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                Transferir Atendimento
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Setor / Departamento:</label>
                <select
                  value={targetQueueId}
                  onChange={e => setTargetQueueId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                >
                  {queues.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Atendente Destino:</label>
                <select
                  value={targetAgentId}
                  onChange={e => setTargetAgentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="">Fila Geral (Qualquer atendente disponível)</option>
                  {agents.map(ag => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.role}) - {ag.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleTransfer}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
              >
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
