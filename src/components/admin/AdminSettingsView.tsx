import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { UserAgent, UserRole } from '../../types/crm';
import {
  Shield,
  Users,
  Plus,
  Clock,
  Check,
  X,
  UserCheck,
  ShieldCheck,
  Mail,
  Sliders,
  Sparkles,
  ArrowUp
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { agents, addAgent, updateAgent, queues, currentAgent } = useCrm();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['dept_vendas']);

  // Settings
  const [autoTopEnabled, setAutoTopEnabled] = useState(true);
  const [autoResolveHours, setAutoResolveHours] = useState('48');
  const [businessHoursStart, setBusinessHoursStart] = useState('08:00');
  const [businessHoursEnd, setBusinessHoursEnd] = useState('19:00');

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addAgent({
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      status: 'online',
      departmentIds: selectedDepts,
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  const toggleDept = (deptId: string) => {
    setSelectedDepts(prev =>
      prev.includes(deptId) ? prev.filter(d => d !== deptId) : [...prev, deptId]
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Administração do Sistema & Equipe</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              Acesso Administrativo Completo
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento de operadores, papéis de acesso, filas de distribuição e regras operacionais.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Atendente</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4 grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Left 2 Cols: Agents & Team */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Atendentes & Supervisores Cadastrados ({agents.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-800/80">
              {agents.map(ag => {
                const assignedQueueNames = queues
                  .filter(q => ag.departmentIds.includes(q.id))
                  .map(q => q.name);

                return (
                  <div key={ag.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                        <img src={ag.avatar} alt={ag.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100">{ag.name}</h4>
                          <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                            {ag.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{ag.email}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                          <span>Filas:</span>
                          <span className="text-slate-400">
                            {assignedQueueNames.length > 0 ? assignedQueueNames.join(', ') : 'Nenhuma'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ag.status}
                        onChange={e => updateAgent(ag.id, { status: e.target.value as any })}
                        className={`text-xs rounded-lg px-2.5 py-1 border font-medium focus:outline-hidden cursor-pointer ${
                          ag.status === 'online'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                            : ag.status === 'busy'
                            ? 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="online">Online</option>
                        <option value="busy">Ocupado</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: System Parameters */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Parâmetros do Atendimento
            </h3>

            {/* Auto-Top Priority Engine Switch */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                  Priorização no Topo (Connect)
                </span>
                <input
                  type="checkbox"
                  checked={autoTopEnabled}
                  onChange={e => setAutoTopEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Quando o cliente responde uma mensagem, a conversa sobe instantaneamente para a primeira posição da lista com som e destaque.
              </p>
            </div>

            {/* Operating Hours */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Horário de Atendimento Humano
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-400 block mb-0.5">Início:</label>
                  <input
                    type="time"
                    value={businessHoursStart}
                    onChange={e => setBusinessHoursStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5">Término:</label>
                  <input
                    type="time"
                    value={businessHoursEnd}
                    onChange={e => setBusinessHoursEnd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                Fora deste horário, o Chatbot responderá automaticamente com aviso de expediente fechado.
              </p>
            </div>

            {/* Auto-Close Inactive tickets */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
              <span className="font-semibold text-slate-200 block">
                Fechamento Automático por Inatividade
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={autoResolveHours}
                  onChange={e => setAutoResolveHours(e.target.value)}
                  className="w-20 bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"
                />
                <span className="text-slate-400">horas sem resposta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Cadastrar Atendente
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Ex: Fernanda Rocha"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="fernanda@connectcrm.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Papel / Nível de Acesso *</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="agent">Atendente (Apenas visualiza e responde chamados atribuídos)</option>
                  <option value="supervisor">Supervisor (Acesso a relatórios e transferências)</option>
                  <option value="admin">Administrador (Configurações da empresa)</option>
                  <option value="super_admin">Super Administrador (Acesso Total ao Servidor e Sistema)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Vincular aos Departamentos / Filas:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {queues.map(q => {
                    const isChecked = selectedDepts.includes(q.id);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => toggleDept(q.id)}
                        className={`p-2 rounded border text-left flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{q.name}</span>
                        {isChecked && <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
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
                  Salvar Atendente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
