import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CRMStage, Contact } from '../../types/crm';
import {
  DollarSign,
  User,
  Phone,
  Building,
  Tag,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Plus,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface ColumnDef {
  id: CRMStage;
  title: string;
  color: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'novo_lead', title: '1. Novo Lead', color: 'border-slate-500' },
  { id: 'qualificacao', title: '2. Qualificação', color: 'border-blue-500' },
  { id: 'em_atendimento', title: '3. Em Atendimento', color: 'border-cyan-500' },
  { id: 'proposta', title: '4. Proposta Enviada', color: 'border-amber-500' },
  { id: 'negociacao', title: '5. Negociação', color: 'border-purple-500' },
  { id: 'ganho', title: '6. Fechado / Ganho', color: 'border-emerald-500' },
  { id: 'perdido', title: '7. Perdido', color: 'border-rose-500' },
];

export const CrmKanbanView: React.FC = () => {
  const { contacts, updateCrmStage, conversations, selectConversation, setActiveView } = useCrm();
  const [filterTag, setFilterTag] = useState<string>('all');

  // Calculate total pipeline value
  const totalPipelineValue = contacts
    .filter(c => c.crmStage !== 'perdido')
    .reduce((acc, c) => acc + (c.dealValue || 0), 0);

  const wonValue = contacts
    .filter(c => c.crmStage === 'ganho')
    .reduce((acc, c) => acc + (c.dealValue || 0), 0);

  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  const handleOpenChat = (contact: Contact) => {
    const conv = conversations.find(c => c.contactId === contact.id);
    if (conv) {
      selectConversation(conv.id);
      setActiveView('chat');
    }
  };

  const getNextStage = (current: CRMStage): CRMStage | null => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    if (idx < COLUMNS.length - 2) return COLUMNS[idx + 1].id;
    if (idx === COLUMNS.length - 2) return 'ganho';
    return null;
  };

  const getPrevStage = (current: CRMStage): CRMStage | null => {
    const idx = COLUMNS.findIndex(c => c.id === current);
    if (idx > 0 && idx < COLUMNS.length - 1) return COLUMNS[idx - 1].id;
    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Top Bar for Funnel */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Funil de Vendas & CRM WhatsApp</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              {contacts.length} Oportunidades
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Acompanhe o ciclo de negociação comercial de cada cliente atendido pelo WhatsApp.
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-slate-400 text-[10px] block">Pipeline Ativo</span>
            <span className="text-slate-200 font-bold tabular-nums">
              R$ {totalPipelineValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-emerald-950/50 border border-emerald-800/60 rounded-lg px-3 py-1.5">
            <span className="text-emerald-400 text-[10px] block">Vendas Concluídas</span>
            <span className="text-emerald-300 font-bold tabular-nums">
              R$ {wonValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Tag Filter */}
          <select
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Todas as Tags</option>
            {allTags.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto py-3 flex gap-3 min-w-0">
        {COLUMNS.map(col => {
          const colContacts = contacts.filter(
            c => c.crmStage === col.id && (filterTag === 'all' || c.tags.includes(filterTag))
          );
          const colValue = colContacts.reduce((acc, c) => acc + (c.dealValue || 0), 0);

          return (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col h-full max-h-full"
            >
              {/* Column Header */}
              <div className={`p-3 border-b border-slate-800 border-t-2 ${col.color} rounded-t-xl bg-slate-900/80`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200">{col.title}</h3>
                  <span className="text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full">
                    {colContacts.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 mt-1 tabular-nums font-medium">
                  R$ {colValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </div>
              </div>

              {/* Column Cards Stream */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {colContacts.length === 0 ? (
                  <div className="h-24 border border-dashed border-slate-800/80 rounded-lg flex items-center justify-center text-[11px] text-slate-600">
                    Nenhum lead nesta etapa
                  </div>
                ) : (
                  colContacts.map(contact => {
                    const nextStage = getNextStage(contact.crmStage);
                    const prevStage = getPrevStage(contact.crmStage);

                    return (
                      <div
                        key={contact.id}
                        className="bg-slate-950 border border-slate-800/90 hover:border-slate-700 rounded-lg p-3 text-xs shadow-xs space-y-2 group transition-colors"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">
                              {contact.name}
                            </h4>
                            {contact.company && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                {contact.company}
                              </p>
                            )}
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald-400 tabular-nums">
                            R$ {contact.dealValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{contact.phone}</span>
                        </div>

                        {/* Tags */}
                        {contact.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map(t => (
                              <span
                                key={t}
                                className="text-[9px] bg-slate-800/80 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700/60"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 gap-1 text-[11px]">
                          {/* Open in WhatsApp */}
                          <button
                            onClick={() => handleOpenChat(contact)}
                            className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 cursor-pointer transition-colors"
                            title="Abrir chat no atendimento WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-500" />
                            <span>WhatsApp</span>
                          </button>

                          {/* Stage Transition Controls */}
                          <div className="flex items-center gap-1">
                            {prevStage && (
                              <button
                                onClick={() => updateCrmStage(contact.id, prevStage)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                                title="Voltar etapa"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {nextStage && (
                              <button
                                onClick={() => updateCrmStage(contact.id, nextStage)}
                                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 cursor-pointer flex items-center gap-0.5"
                                title="Avançar etapa"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {contact.crmStage !== 'ganho' && contact.crmStage !== 'perdido' && (
                              <button
                                onClick={() => updateCrmStage(contact.id, 'ganho')}
                                className="p-1 hover:bg-emerald-950 rounded text-emerald-500 hover:text-emerald-300 cursor-pointer"
                                title="Marcar como Ganho (Venda Fechada)"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
