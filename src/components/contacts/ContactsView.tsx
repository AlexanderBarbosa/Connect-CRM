import React, { useState, useMemo } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Contact, CRMStage } from '../../types/crm';
import {
  Search,
  Plus,
  Download,
  Phone,
  Mail,
  Building,
  Tag,
  MessageSquare,
  X,
  Check,
  UserPlus
} from 'lucide-react';

export const ContactsView: React.FC = () => {
  const { contacts, addContact, conversations, selectConversation, setActiveView, simulateNewInboundClientMessage } = useCrm();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+55 11 9');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [dealValue, setDealValue] = useState('1500');
  const [tagsInput, setTagsInput] = useState('Novo Lead');
  const [notes, setNotes] = useState('');

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      if (stageFilter !== 'all' && c.crmStage !== stageFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.company && c.company.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [contacts, search, stageFilter]);

  const handleOpenChat = (contact: Contact) => {
    const conv = conversations.find(c => c.contactId === contact.id);
    if (conv) {
      selectConversation(conv.id);
      setActiveView('chat');
    } else {
      // Create initial conversation
      simulateNewInboundClientMessage(contact.name, contact.phone, 'Olá! Gostaria de falar com o atendimento.');
      setActiveView('chat');
    }
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    addContact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      company: company.trim() || undefined,
      dealValue: parseFloat(dealValue) || 0,
      tags,
      crmStage: 'novo_lead',
      notes: notes.trim(),
    });

    setName('');
    setPhone('+55 11 9');
    setEmail('');
    setCompany('');
    setShowAddModal(false);
  };

  const exportCsv = () => {
    const headers = ['Nome', 'Telefone', 'Email', 'Empresa', 'Etapa CRM', 'Valor Negociacao', 'Tags', 'Data Cadastro'];
    const rows = contacts.map(c => [
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email || ''}"`,
      `"${c.company || ''}"`,
      `"${c.crmStage}"`,
      `"${c.dealValue}"`,
      `"${c.tags.join('; ')}"`,
      `"${c.createdAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contatos_connect_crm_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Contatos & Base de Clientes</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              {contacts.length} Registros
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie o histórico de clientes, dados cadastrais e inicie atendimentos diretos no WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Contato</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone, email..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Filtrar por etapa:</span>
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
          >
            <option value="all">Todas as Etapas</option>
            <option value="novo_lead">Novo Lead</option>
            <option value="qualificacao">Qualificação</option>
            <option value="em_atendimento">Em Atendimento</option>
            <option value="proposta">Proposta Enviada</option>
            <option value="negociacao">Em Negociação</option>
            <option value="ganho">Fechado / Ganho</option>
            <option value="perdido">Perdido</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-800/80 bg-slate-900/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-semibold sticky top-0">
            <tr>
              <th className="py-2.5 px-4">Nome & Contato</th>
              <th className="py-2.5 px-4">Empresa</th>
              <th className="py-2.5 px-4">Etapa Funil</th>
              <th className="py-2.5 px-4 text-right">Valor Negociado</th>
              <th className="py-2.5 px-4">Tags</th>
              <th className="py-2.5 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Nenhum contato encontrado com os filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredContacts.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100">{c.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{c.phone}</span>
                      {c.email && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-500">{c.email}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {c.company || <span className="text-slate-600 italic">Pessoa Física</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {c.crmStage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-400 tabular-nums">
                    R$ {c.dealValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {c.tags.map(t => (
                        <span key={t} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpenChat(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800/60 rounded-md transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>Atender</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                Cadastrar Novo Contato no CRM
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Ex: Beatriz Lima"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    placeholder="+55 11 99999-8888"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contato@empresa.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Empresa / Organização</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Ex: Prime Logística"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Valor da Negociação (R$)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={e => setDealValue(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="VIP, Vendas, E-commerce"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Anotações Iniciais</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Detalhes ou necessidades do cliente..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
                >
                  Salvar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
