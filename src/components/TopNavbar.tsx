import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Wifi,
  Server,
  UserCheck,
  ChevronDown,
  Shield,
  Zap
} from 'lucide-react';

interface TopNavbarProps {
  onOpenSimulateModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenSimulateModal }) => {
  const {
    currentAgent,
    agents,
    setCurrentAgentId,
    soundEnabled,
    toggleSound,
    autoSimulationActive,
    toggleAutoSimulation,
    triggerQuickRandomSimulation,
    connections,
    conversations,
    serverMetrics,
    setActiveView
  } = useCrm();

  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);

  // Active unread messages sum
  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const mainConnection = connections[0];

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between gap-6 shrink-0 z-30 select-none">
      {/* Zone 1: Single text element Brand wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 font-bold text-sm tracking-tighter">
          CC
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-white tracking-tight whitespace-nowrap">
            Connect <span className="text-emerald-400 font-semibold text-xs tracking-normal">WhatsApp CRM</span>
          </span>
          <span className="hidden lg:inline-flex text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded px-1.5 py-0.5">
            Auto-Topo Ativo
          </span>
        </div>
      </div>

      {/* Zone 2: System Telemetry & Connection Indicators */}
      <div className="hidden md:flex items-center gap-5 text-xs text-slate-400">
        {/* WhatsApp Connection status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
          <span className="text-slate-200 font-medium whitespace-nowrap">
            {mainConnection ? mainConnection.phoneNumber : '+55 11 98844-3322'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-medium">Conectado (Baileys)</span>
        </div>

        <span className="text-slate-700">|</span>

        {/* Server Status button link */}
        <button
          onClick={() => setActiveView('server')}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer group"
          title="Acessar Console do Servidor Express"
        >
          <Server className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <span>Servidor Node.js:</span>
          <span className="font-mono text-slate-300 tabular-nums">{serverMetrics.memoryRssMb.toFixed(0)}MB RAM</span>
        </button>

        <span className="text-slate-700">|</span>

        {/* Unread Queue Indicator */}
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>Fila ativa:</span>
          <span className="font-mono text-slate-200 tabular-nums font-semibold">
            {conversations.filter(c => c.status === 'open' || c.status === 'waiting').length} chats
          </span>
          {totalUnread > 0 && (
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
              {totalUnread} novas
            </span>
          )}
        </div>
      </div>

      {/* Zone 3: Action Controls & Operator Profile Switcher */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick test incoming client message (demonstrates auto-bump to top!) */}
        <button
          onClick={triggerQuickRandomSimulation}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 rounded-md hover:bg-emerald-900/60 transition-colors cursor-pointer shadow-xs"
          title="Disparar mensagem instantânea de cliente para testar priorização no topo"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="whitespace-nowrap">Testar Auto-Topo</span>
        </button>

        {/* Open full modal to simulate custom client message */}
        <button
          onClick={onOpenSimulateModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700/80 transition-colors cursor-pointer"
          title="Simular cliente WhatsApp específico com texto personalizado"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline whitespace-nowrap">Simular Cliente</span>
        </button>

        {/* Live Auto-Simulation Toggle (periodic incoming messages) */}
        <button
          onClick={toggleAutoSimulation}
          className={`inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
            autoSimulationActive
              ? 'bg-amber-950/70 border-amber-600/70 text-amber-300'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
          }`}
          title={autoSimulationActive ? 'Pausar simulação automática' : 'Ativar mensagens automáticas a cada 18s'}
        >
          {autoSimulationActive ? (
            <>
              <Square className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="hidden xl:inline font-mono text-[11px]">Auto: ON (18s)</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-slate-400" />
              <span className="hidden xl:inline font-mono text-[11px]">Auto: OFF</span>
            </>
          )}
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          title={soundEnabled ? 'Silenciar alertas do WhatsApp' : 'Ativar som de mensagens'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Operator Profile Selector (Super Admin alexandre Ramos / Beatriz / Carlos) */}
        <div className="relative">
          <button
            onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-lg bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 shrink-0">
              <img
                src={currentAgent.avatar}
                alt={currentAgent.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-slate-100 max-w-[110px] truncate">
                {currentAgent.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono capitalize">
                {currentAgent.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Switcher Dropdown */}
          {agentDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Alternar Operador / Permissão
                </p>
                <p className="text-xs text-slate-300 font-medium">
                  {currentAgent.name} ({currentAgent.role})
                </p>
              </div>

              <div className="py-1">
                {agents.map(ag => (
                  <button
                    key={ag.id}
                    onClick={() => {
                      setCurrentAgentId(ag.id);
                      setAgentDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors cursor-pointer ${
                      currentAgent.id === ag.id ? 'bg-slate-800 text-emerald-400 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-700 shrink-0">
                        <img src={ag.avatar} alt={ag.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <span className="truncate">{ag.name}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 shrink-0">
                      {ag.role === 'super_admin' ? 'Super Admin' : ag.role}
                    </span>
                  </button>
                ))}
              </div>

              <div className="px-3 py-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Shield className="w-3 h-3" /> Acesso Total Servidor
                </span>
                <span className="font-mono text-slate-500">v4.8</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
