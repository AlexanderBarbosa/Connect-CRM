import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { CRMStage } from '../../types/crm';
import {
  User,
  Phone,
  Mail,
  Building,
  DollarSign,
  Tag,
  FileText,
  Clock,
  Plus,
  X,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const ContactDrawer: React.FC = () => {
  const { activeConversation, updateContact, updateCrmStage } = useCrm();
  const [newTagInput, setNewTagInput] = useState('');
  const [isEditingDealValue, setIsEditingDealValue] = useState(false);
  const [dealValueDraft, setDealValueDraft] = useState('');

  if (!activeConversation) return null;

  const contact = activeConversation.contact;

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stage = e.target.value as CRMStage;
    updateCrmStage(contact.id, stage);
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim();
    if (!contact.tags.includes(tag)) {
      updateContact(contact.id, {
        tags: [...contact.tags, tag],
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateContact(contact.id, {
      tags: contact.tags.filter(t => t !== tagToRemove),
    });
  };

  const handleSaveDealValue = () => {
    const val = parseFloat(dealValueDraft.replace(/\D/g, '')) || 0;
    updateContact(contact.id, { dealValue: val });
    setIsEditingDealValue(false);
  };

  return (
    <div className="w-72 border-l border-slate-800 bg-slate-900/50 flex flex-col h-full overflow-y-auto shrink-0 select-none text-xs">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 mx-auto mb-2 flex items-center justify-center text-slate-200 font-bold text-lg uppercase overflow-hidden">
          {contact.avatar ? (
            <img src={contact.avatar} alt={contact.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          ) : (
            <span>{contact.name.slice(0, 2)}</span>
          )}
        </div>
        <h3 className="font-bold text-slate-100 text-sm">{contact.name}</h3>
        {contact.company && (
          <p className="text-[11px] text-slate-400 mt-0.5">{contact.company}</p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* CRM Stage Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Etapa no Funil de Vendas
          </label>
          <select
            value={contact.crmStage}
            onChange={handleStageChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="novo_lead">1. Novo Lead</option>
            <option value="qualificacao">2. Qualificação</option>
            <option value="em_atendimento">3. Em Atendimento</option>
            <option value="proposta">4. Proposta Enviada</option>
            <option value="negociacao">5. Em Negociação</option>
            <option value="ganho">6. Ganho / Fechado (Venda Concluída)</option>
            <option value="perdido">7. Perdido</option>
          </select>
        </div>

        {/* Deal Value */}
        <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Valor da Negociação:</span>
            {!isEditingDealValue && (
              <button
                onClick={() => {
                  setDealValueDraft(contact.dealValue.toString());
                  setIsEditingDealValue(true);
                }}
                className="text-emerald-400 hover:underline cursor-pointer"
              >
                Editar
              </button>
            )}
          </div>

          {isEditingDealValue ? (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-slate-400 font-mono">R$</span>
              <input
                type="number"
                value={dealValueDraft}
                onChange={e => setDealValueDraft(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs focus:outline-hidden"
              />
              <button
                onClick={handleSaveDealValue}
                className="p-1 bg-emerald-600 hover:bg-emerald-500 rounded text-white cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <p className="text-base font-bold text-emerald-400 font-mono tabular-nums">
              R$ {contact.dealValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>

        {/* Contact Info Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-mono tabular-nums">{contact.phone}</span>
          </div>

          {contact.email && (
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}

          {contact.company && (
            <div className="flex items-center gap-2 text-slate-300 truncate">
              <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{contact.company}</span>
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Etiquetas & Tags
          </label>
          <div className="flex flex-wrap gap-1.5">
            {contact.tags.map(t => (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-[11px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded"
              >
                {t}
                <button
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-red-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-1.5">
            <input
              type="text"
              value={newTagInput}
              onChange={e => setNewTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTag()}
              placeholder="Nova tag..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              onClick={handleAddTag}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Internal Notes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Observações do Lead
          </label>
          <textarea
            value={contact.notes}
            onChange={e => updateContact(contact.id, { notes: e.target.value })}
            rows={3}
            placeholder="Anotações comerciais sobre preferências do cliente..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Protocol Details */}
        <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-500 space-y-1 font-mono">
          <div className="flex justify-between">
            <span>Canal WhatsApp:</span>
            <span className="text-slate-400">Oficial Matriz</span>
          </div>
          <div className="flex justify-between">
            <span>Cliente Desde:</span>
            <span className="text-slate-400">{contact.createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span>ID do Ticket:</span>
            <span className="text-slate-400">{activeConversation.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
