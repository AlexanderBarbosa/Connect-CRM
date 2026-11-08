import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { DepartmentQueue, ChatbotOption } from '../../types/crm';
import {
  Bot,
  Layers,
  Plus,
  Settings2,
  Users,
  MessageSquare,
  CheckCircle2,
  Sliders,
  Sparkles,
  Smartphone
} from 'lucide-react';

export const ChatbotQueuesView: React.FC = () => {
  const { queues, updateQueue, chatbotOptions, updateChatbotOption, agents } = useCrm();
  const [activeTab, setActiveTab] = useState<'chatbot' | 'queues'>('chatbot');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span>Chatbot de Triagem & Filas de Atendimento</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure o fluxo de autoatendimento WhatsApp e as regras de distribuição para cada setor da empresa.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'chatbot' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Menu do Chatbot (URA)
          </button>
          <button
            onClick={() => setActiveTab('queues')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'queues' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Filas & Departamentos ({queues.length})
          </button>
        </div>
      </div>

      {activeTab === 'chatbot' ? (
        <div className="flex-1 overflow-auto py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Chatbot Options Configuration */}
          <div className="lg:col-span-2 space-y-4 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Opções Numéricas do Menu Inicial WhatsApp
              </h3>
              <p className="text-slate-400">
                Quando um novo cliente envia uma mensagem pela primeira vez, o bot responde com este menu. Cada opção direciona para a fila correspondente.
              </p>

              <div className="space-y-3 mt-3">
                {chatbotOptions.map(opt => (
                  <div
                    key={opt.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                          {opt.digit}
                        </span>
                        <input
                          type="text"
                          value={opt.label}
                          onChange={e => updateChatbotOption(opt.id, { label: e.target.value })}
                          className="bg-transparent font-semibold text-slate-200 border-b border-transparent hover:border-slate-700 focus:border-emerald-500 focus:outline-hidden px-1"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <span>Fila Destino:</span>
                        <select
                          value={opt.targetQueueId}
                          onChange={e => updateChatbotOption(opt.id, { targetQueueId: e.target.value })}
                          className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs focus:outline-hidden cursor-pointer"
                        >
                          {queues.map(q => (
                            <option key={q.id} value={q.id}>
                              {q.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-mono block mb-1">
                        Mensagem de confirmação ao escolher o dígito {opt.digit}:
                      </label>
                      <input
                        type="text"
                        value={opt.responseMessage}
                        onChange={e => updateChatbotOption(opt.id, { responseMessage: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-300 text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Live WhatsApp Phone Simulator Preview */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Simulação no WhatsApp do Cliente</span>
            </div>

            <div className="w-72 bg-slate-900 border-4 border-slate-800 rounded-3xl p-3 shadow-2xl flex flex-col h-[460px] text-xs">
              {/* Fake Phone Header */}
              <div className="bg-slate-800 rounded-t-xl p-2.5 flex items-center gap-2 border-b border-slate-700 shrink-0">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  MQ
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-white text-[11px]">Connect Oficial</p>
                  <p className="text-[9px] text-emerald-400 font-mono">Conta Comercial Verificada</p>
                </div>
              </div>

              {/* Chat history */}
              <div className="flex-1 p-2 space-y-2.5 overflow-y-auto bg-slate-950/70 rounded-b-xl my-1">
                {/* Client greeting */}
                <div className="flex justify-end">
                  <div className="bg-emerald-700 text-white rounded-lg p-2 max-w-[85%] text-[11px]">
                    Olá, boa tarde! Gostaria de falar com vocês.
                  </div>
                </div>

                {/* Bot Greeting & Menu */}
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 max-w-[90%] text-[10px] space-y-1">
                    <p className="font-semibold text-emerald-400">🤖 Connect Auto-Atendimento</p>
                    <p>Olá! Seja bem-vindo à nossa central. Para agilizar seu contato, por favor digite o número da opção desejada:</p>
                    <div className="space-y-0.5 pt-1 border-t border-slate-700 text-slate-300 font-mono">
                      {chatbotOptions.map(opt => (
                        <div key={opt.id}>
                          <strong>[{opt.digit}]</strong> {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Client digit press */}
                <div className="flex justify-end">
                  <div className="bg-emerald-700 text-white rounded-lg px-3 py-1 text-[11px] font-bold font-mono">
                    1
                  </div>
                </div>

                {/* Bot transfer confirmation */}
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg p-2 max-w-[90%] text-[10px]">
                    {chatbotOptions[0]?.responseMessage}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-center text-slate-500 font-mono py-1">
                Visualização em tempo real
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Queues Management Tab */
        <div className="flex-1 overflow-auto py-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {queues.map(queue => {
              const assignedAgents = agents.filter(a => a.departmentIds.includes(queue.id));

              return (
                <div
                  key={queue.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: queue.color }}
                      />
                      <h3 className="font-bold text-slate-100 text-sm">{queue.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      ID: {queue.id}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs">{queue.description}</p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-300 block">
                      Regra de Distribuição de Tickets:
                    </label>
                    <select
                      value={queue.distributionRule}
                      onChange={e => updateQueue(queue.id, { distributionRule: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="round_robin">Distribuição Circular (Round-Robin uniforme entre atendentes)</option>
                      <option value="least_busy">Menor Carga (Atribui ao atendente com menos tickets ativos)</option>
                      <option value="manual">Fila Aberta (Atendente escolhe manualmente no painel)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-300 block">
                      Mensagem de Saudação Automática:
                    </label>
                    <input
                      type="text"
                      value={queue.autoGreeting}
                      onChange={e => updateQueue(queue.id, { autoGreeting: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      {assignedAgents.length} Atendentes Vinculados
                    </span>
                    <span className="text-emerald-400 font-mono">Fila Ativa</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
