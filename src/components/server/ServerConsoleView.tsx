import React, { useState, useRef, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ServerLogEntry } from '../../types/crm';
import {
  Terminal,
  Activity,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  RotateCw,
  Play,
  Pause,
  Trash2,
  Download,
  Filter,
  Send,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  FileCode,
  ArrowUp,
  X
} from 'lucide-react';

export const ServerConsoleView: React.FC = () => {
  const {
    serverMetrics,
    serverLogs,
    clearServerLogs,
    executeServerCommand,
    simulateNewInboundClientMessage,
    triggerQuickRandomSimulation
  } = useCrm();

  const [activeTab, setActiveTab] = useState<'terminal' | 'logs' | 'webhook_tester'>('terminal');

  // Terminal state
  const [commandInput, setCommandInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'cmd' | 'output'; text: string }>>([
    { type: 'output', text: 'Connect Enterprise Cloud Server Linux 6.8.0-45-generic x86_64' },
    { type: 'output', text: 'Conectado como: root@connect-core-01 (Acesso Administrativo Completo)' },
    { type: 'output', text: 'Digite "help" para ver a lista de comandos disponíveis ou "status" para telemetria.' },
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Logs state
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'webhook' | 'socket'>('all');
  const [logsPaused, setLogsPaused] = useState(false);
  const [selectedLogPayload, setSelectedLogPayload] = useState<ServerLogEntry | null>(null);

  // Webhook tester state
  const [webhookPhone, setWebhookPhone] = useState('+55 11 99882-1405');
  const [webhookName, setWebhookName] = useState('Mariana Silveira');
  const [webhookMessage, setWebhookMessage] = useState('Teste de carga webhook: priorização imediata no topo (#1)!');
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activeTab]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setCommandInput('');

    if (cmd.toLowerCase() === 'clear') {
      setTerminalHistory([]);
      return;
    }

    const output = executeServerCommand(cmd);

    setTerminalHistory(prev => [
      ...prev,
      { type: 'cmd', text: `root@connect-srv01:~# ${cmd}` },
      { type: 'output', text: output },
    ]);
  };

  const handleSendWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingWebhook(true);
    setWebhookResponse(null);

    setTimeout(() => {
      simulateNewInboundClientMessage(webhookName, webhookPhone, webhookMessage);
      setIsSendingWebhook(false);
      setWebhookResponse(
        JSON.stringify(
          {
            status: 200,
            message: 'Webhook processed successfully',
            event: 'messages.upsert',
            data: {
              key: { remoteJid: `${webhookPhone.replace(/\D/g, '')}@s.whatsapp.net`, fromMe: false },
              messageTimestamp: Date.now(),
              pushName: webhookName,
              conversationPriority: 'TOP_OF_QUEUE',
            },
            server: 'node-express-connect-prod',
            latencyMs: 14,
          },
          null,
          2
        )
      );
    }, 400);
  };

  const exportLogs = () => {
    const text = serverLogs
      .map(
        l =>
          `[${new Date(l.timestamp).toISOString()}] [${l.level.toUpperCase()}] [${l.source}]: ${l.message} ${
            l.payload ? JSON.stringify(l.payload) : ''
          }`
      )
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connect_server_logs_${Date.now()}.log`;
    a.click();
  };

  const filteredLogs = logsPaused
    ? serverLogs
    : serverLogs.filter(l => (logFilter === 'all' ? true : l.level === logFilter));

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Header with Server Breadcrumb & Root Badging */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>Console Administrativo do Servidor (Express / Node.js)</span>
            </h2>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded font-bold">
              ROOT ACCESS GRANTED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerenciamento direto de infraestrutura, logs de sockets Baileys, injeção de webhooks e terminal interativo.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terminal' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal CLI</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Logs em Tempo Real ({serverLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('webhook_tester')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'webhook_tester' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulador de Webhook</span>
          </button>
        </div>
      </div>

      {/* Server Health Metric Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 my-3 shrink-0 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 block">Express Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE (3000)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 block">Uptime do Servidor</span>
          <span className="text-slate-200 font-semibold mt-0.5 block tabular-nums">
            {Math.floor(serverMetrics.uptimeSeconds / 3600)}h {Math.floor((serverMetrics.uptimeSeconds % 3600) / 60)}m
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 block">Memória RSS</span>
          <span className="text-slate-200 font-semibold mt-0.5 block tabular-nums">
            {serverMetrics.memoryRssMb.toFixed(1)} MB
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 block">Uso da CPU</span>
          <span className="text-emerald-400 font-semibold mt-0.5 block tabular-nums">
            {serverMetrics.cpuPercent.toFixed(1)}%
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 block">Sockets Baileys</span>
          <span className="text-slate-200 font-semibold mt-0.5 block tabular-nums">
            {serverMetrics.activeSocketsCount} Conectados
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 block">Inbound Webhooks</span>
          <span className="text-emerald-400 font-bold mt-0.5 block tabular-nums">
            {serverMetrics.processedWebhooksCount} processados
          </span>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'terminal' && (
        <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
          {/* Terminal Window Chrome */}
          <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-slate-300 font-semibold ml-2">bash - root@connect-srv01:/app/server</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Node: {serverMetrics.nodeVersion}</span>
              <button
                onClick={() => setTerminalHistory([])}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Limpar tela"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Terminal Output Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-1 text-slate-300 bg-slate-950">
            {terminalHistory.map((item, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                {item.type === 'cmd' ? (
                  <span className="text-emerald-400 font-bold">{item.text}</span>
                ) : (
                  <span className="text-slate-300">{item.text}</span>
                )}
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Terminal Input Bar */}
          <form onSubmit={handleCommandSubmit} className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <span className="text-emerald-400 font-bold shrink-0">root@connect-srv01:~#</span>
            <input
              type="text"
              value={commandInput}
              onChange={e => setCommandInput(e.target.value)}
              placeholder="Digite um comando (ex: status, top, routes, webhook-test, restart-worker)..."
              className="flex-1 bg-transparent text-emerald-200 placeholder-slate-600 focus:outline-hidden font-mono text-xs"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-[11px] cursor-pointer"
            >
              Executar
            </button>
          </form>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden text-xs">
          {/* Logs Control Bar */}
          <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Nível:</span>
              <div className="flex items-center gap-1">
                {(['all', 'info', 'warn', 'error', 'webhook', 'socket'] as const).map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilter(lvl)}
                    className={`px-2 py-0.5 text-[11px] rounded font-mono uppercase cursor-pointer transition-colors ${
                      logFilter === lvl
                        ? 'bg-slate-800 text-emerald-400 font-bold border border-emerald-700/60'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogsPaused(!logsPaused)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
                  logsPaused ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {logsPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{logsPaused ? 'Retomar Stream' : 'Pausar Stream'}</span>
              </button>

              <button
                onClick={exportLogs}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Exportar .log</span>
              </button>

              <button
                onClick={clearServerLogs}
                className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Limpar logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Logs Stream List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 font-mono text-[11px] p-2 bg-slate-950">
            {filteredLogs.map(log => {
              const dateStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              const badgeColor =
                log.level === 'error'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : log.level === 'warn'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : log.level === 'webhook'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : log.level === 'socket'
                  ? 'bg-sky-950 text-sky-300 border-sky-800'
                  : 'bg-slate-800 text-slate-300 border-slate-700';

              return (
                <div
                  key={log.id}
                  onClick={() => log.payload && setSelectedLogPayload(log)}
                  className={`p-2 flex items-start gap-2.5 transition-colors ${
                    log.payload ? 'hover:bg-slate-800/60 cursor-pointer' : ''
                  }`}
                >
                  <span className="text-slate-500 tabular-nums shrink-0">{dateStr}</span>
                  <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase border shrink-0 ${badgeColor}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-400 shrink-0">[{log.source}]</span>
                  <span className="text-slate-200 flex-1">{log.message}</span>
                  {log.payload && (
                    <span className="text-[10px] text-emerald-400 underline shrink-0">Ver JSON</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'webhook_tester' && (
        <div className="flex-1 overflow-auto grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          {/* Left: Webhook Payload Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">Disparar Inbound Webhook (Simular WhatsApp API)</h3>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Envie uma requisição HTTP POST para o endpoint interno do servidor. O backend processará o payload e moverá a conversa do cliente para o topo (#1) instantaneamente.
            </p>

            <form onSubmit={handleSendWebhook} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nome do Remetente WhatsApp:</label>
                <input
                  type="text"
                  value={webhookName}
                  onChange={e => setWebhookName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Número do Telefone:</label>
                <input
                  type="text"
                  value={webhookPhone}
                  onChange={e => setWebhookPhone(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Mensagem de Texto Inbound:</label>
                <textarea
                  value={webhookMessage}
                  onChange={e => setWebhookMessage(e.target.value)}
                  required
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500 font-mono text-[11px]">POST /api/webhook/whatsapp</span>
                <button
                  type="submit"
                  disabled={isSendingWebhook}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingWebhook ? 'Enviando...' : 'Disparar Webhook'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Server Response Output */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-semibold text-slate-300">Resposta do Servidor Express:</span>
                {webhookResponse && (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    HTTP 200 OK
                  </span>
                )}
              </div>

              {webhookResponse ? (
                <pre className="text-emerald-300 text-[11px] whitespace-pre-wrap overflow-x-auto leading-relaxed">
                  {webhookResponse}
                </pre>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-600 text-center">
                  Aguardando envio de requisição para exibir o retorno do servidor...
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-slate-400 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
                <span>Verificação do Auto-Topo:</span>
              </div>
              <p>
                Assim que a resposta HTTP 200 é emitida, o sistema reordena reativamente a fila de atendimento e empurra esta conversa para o topo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* JSON Payload Inspector Modal */}
      {selectedLogPayload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-3 shadow-2xl text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold">
                Inspeção de Payload JSON ({selectedLogPayload.source})
              </span>
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-[11px] overflow-auto max-h-80 leading-relaxed">
              {JSON.stringify(selectedLogPayload.payload, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedLogPayload(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
