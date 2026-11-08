import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { WhatsAppConnection } from '../../types/crm';
import {
  QrCode,
  Wifi,
  Battery,
  RotateCw,
  PowerOff,
  Plus,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Zap,
  Server
} from 'lucide-react';

export const ConnectionsView: React.FC = () => {
  const { connections, restartConnection, disconnectConnection, connectConnection } = useCrm();
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedConnectionForQr, setSelectedConnectionForQr] = useState<WhatsAppConnection | null>(null);

  const handleOpenQr = (conn: WhatsAppConnection) => {
    setSelectedConnectionForQr(conn);
    setShowQrModal(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            <span>Conexões WhatsApp (Multi-Device Engine)</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              {connections.filter(c => c.status === 'connected').length} Ativas
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie múltiplos números de WhatsApp conectados via Baileys / WhatsApp Web Socket. Cada número pode ser compartilhado por toda a equipe.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedConnectionForQr({
              id: `conn_${Date.now()}`,
              name: 'Novo Número WhatsApp',
              phoneNumber: '+55 11 99999-0000',
              status: 'qrcode',
              batteryLevel: 100,
              sessionUptime: '0m',
              messagesSentToday: 0,
              messagesReceivedToday: 0,
              qrCodeSeed: `new_qr_${Date.now()}`,
              lastSyncAt: 'Aguardando leitura do QR Code',
            });
            setShowQrModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Conectar Novo Número WhatsApp</span>
        </button>
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-auto py-4 space-y-4 text-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {connections.map(conn => {
            const isConnected = conn.status === 'connected';

            return (
              <div
                key={conn.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 hover:border-slate-700 transition-colors shadow-xs"
              >
                {/* Title & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        {conn.name}
                        {isConnected ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.2 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Conectado
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 border border-rose-800/80 px-1.5 py-0.2 rounded">
                            Desconectado
                          </span>
                        )}
                      </h3>
                      <p className="font-mono text-slate-400 text-xs mt-0.5">{conn.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Battery className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono tabular-nums">{conn.batteryLevel}%</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Uptime Sessão</span>
                    <span className="text-slate-200 font-semibold">{conn.sessionUptime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Enviadas Hoje</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">{conn.messagesSentToday}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Recebidas Hoje</span>
                    <span className="text-emerald-400 font-semibold tabular-nums">{conn.messagesReceivedToday}</span>
                  </div>
                </div>

                {/* Connection Specs */}
                <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Engine de Conexão:</span>
                    <span className="text-slate-300">Baileys Multi-Device v6.7 (WebSocket Seguro)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sincronização:</span>
                    <span className="text-slate-300">{conn.lastSyncAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Regra de Priorização:</span>
                    <span className="text-emerald-400 font-bold">Auto-Topo Imediato (#1)</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenQr(conn)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver QR Code</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restartConnection(conn.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      title="Reiniciar sessão do socket"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Reiniciar</span>
                    </button>

                    {isConnected ? (
                      <button
                        onClick={() => disconnectConnection(conn.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-400 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <PowerOff className="w-3.5 h-3.5" />
                        <span>Desconectar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => connectConnection(conn.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <Wifi className="w-3.5 h-3.5" />
                        <span>Reconectar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && selectedConnectionForQr && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl text-xs">
            <h3 className="text-base font-bold text-slate-100 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              Escanear QR Code WhatsApp
            </h3>

            <p className="text-slate-400 text-xs">
              Abra o WhatsApp no seu smartphone, acesse <strong>Aparelhos Conectados</strong> e aponte a câmera para este código:
            </p>

            {/* Simulated Dynamic SVG QR Code */}
            <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-inner">
              <svg width="180" height="180" viewBox="0 0 100 100" className="mx-auto">
                <rect width="100" height="100" fill="#ffffff" />
                {/* QR code corners */}
                <rect x="5" y="5" width="26" height="26" fill="#0f172a" />
                <rect x="8" y="8" width="20" height="20" fill="#ffffff" />
                <rect x="12" y="12" width="12" height="12" fill="#0f172a" />

                <rect x="69" y="5" width="26" height="26" fill="#0f172a" />
                <rect x="72" y="8" width="20" height="20" fill="#ffffff" />
                <rect x="76" y="12" width="12" height="12" fill="#0f172a" />

                <rect x="5" y="69" width="26" height="26" fill="#0f172a" />
                <rect x="8" y="72" width="20" height="20" fill="#ffffff" />
                <rect x="12" y="76" width="12" height="12" fill="#0f172a" />

                {/* Center matrix patterns */}
                <rect x="42" y="10" width="16" height="6" fill="#0f172a" />
                <rect x="36" y="22" width="24" height="6" fill="#0f172a" />
                <rect x="10" y="38" width="80" height="6" fill="#0f172a" />
                <rect x="40" y="48" width="20" height="20" fill="#10b981" />
                <rect x="68" y="48" width="22" height="6" fill="#0f172a" />
                <rect x="68" y="60" width="14" height="6" fill="#0f172a" />
                <rect x="38" y="74" width="26" height="6" fill="#0f172a" />
                <rect x="72" y="74" width="18" height="18" fill="#0f172a" />
              </svg>
            </div>

            <div className="font-mono text-slate-500 text-[11px] flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Sincronizando com o servidor Express...</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  connectConnection(selectedConnectionForQr.id);
                  setShowQrModal(false);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Simular QR Escaneado (Conectar)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
