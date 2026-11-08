import React from 'react';
import { useCrm } from '../context/CrmContext';
import {
  MessageSquare,
  Kanban,
  Users,
  Zap,
  Bot,
  QrCode,
  ShieldAlert,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, conversations, connections, serverMetrics } = useCrm();

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeChatsCount = conversations.filter(c => c.status === 'open' || c.status === 'waiting').length;

  const navItems = [
    {
      id: 'chat' as const,
      label: 'Atendimento',
      icon: MessageSquare,
      badge: totalUnread > 0 ? totalUnread : undefined,
      sublabel: `${activeChatsCount} ativos`,
    },
    {
      id: 'kanban' as const,
      label: 'CRM & Funil',
      icon: Kanban,
      sublabel: 'Vendas & Negócios',
    },
    {
      id: 'contacts' as const,
      label: 'Contatos & Leads',
      icon: Users,
    },
    {
      id: 'quick_replies' as const,
      label: 'Respostas Rápidas',
      icon: Zap,
      sublabel: 'Atalhos ( / )',
    },
    {
      id: 'chatbot' as const,
      label: 'Chatbot & Filas',
      icon: Bot,
      sublabel: 'URA / Triagem',
    },
    {
      id: 'connections' as const,
      label: 'Conexões WhatsApp',
      icon: QrCode,
      sublabel: `${connections.filter(c => c.status === 'connected').length} conectadas`,
    },
    {
      id: 'admin' as const,
      label: 'Administração',
      icon: ShieldAlert,
      sublabel: 'Equipe & Permissões',
    },
    {
      id: 'server' as const,
      label: 'Console do Servidor',
      icon: Terminal,
      sublabel: 'Acesso Total Root',
      isServerAdmin: true,
    },
  ];

  return (
    <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Navigation Links */}
      <div className="p-2 space-y-1">
        <div className="px-3 pt-3 pb-2 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
          Menu de Operação
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group text-left ${
                isActive
                  ? item.isServerAdmin
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-xs'
                    : 'bg-slate-800 text-white font-semibold shadow-xs'
                  : item.isServerAdmin
                  ? 'text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? item.isServerAdmin ? 'text-emerald-400' : 'text-emerald-400'
                      : item.isServerAdmin ? 'text-emerald-500/70' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="flex flex-col truncate leading-tight">
                  <span className="truncate">{item.label}</span>
                  {item.sublabel && (
                    <span className="text-[10px] text-slate-500 font-normal truncate">
                      {item.sublabel}
                    </span>
                  )}
                </div>
              </div>

              {item.badge !== undefined && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950 tabular-nums shrink-0 animate-pulse">
                  {item.badge}
                </span>
              )}

              {item.isServerAdmin && !item.badge && (
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-400 border border-emerald-700/50">
                  ROOT
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Infrastructure Mini Widget */}
      <div className="p-3 m-2 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Backend Status
          </span>
          <span className="font-mono text-[10px] text-emerald-400">ONLINE</span>
        </div>

        <div className="space-y-1 text-[11px] text-slate-400 font-mono">
          <div className="flex justify-between">
            <span>RAM:</span>
            <span className="text-slate-300 tabular-nums">{serverMetrics.memoryRssMb.toFixed(0)} MB</span>
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span className="text-slate-300 tabular-nums">
              {Math.floor(serverMetrics.uptimeSeconds / 3600)}h {(Math.floor(serverMetrics.uptimeSeconds / 60)) % 60}m
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auto-Topo:</span>
            <span className="text-emerald-400">ATIVADO</span>
          </div>
        </div>

        <button
          onClick={() => setActiveView('server')}
          className="mt-2.5 w-full py-1 text-[11px] font-medium text-center text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
        >
          Abrir Terminal Server
        </button>
      </div>
    </aside>
  );
};
