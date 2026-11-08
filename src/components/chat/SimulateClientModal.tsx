import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import {
  X,
  Sparkles,
  ArrowUp,
  MessageSquare,
  Phone,
  User,
  Zap,
  Check
} from 'lucide-react';

interface SimulateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulateClientModal: React.FC<SimulateClientModalProps> = ({ isOpen, onClose }) => {
  const { contacts, queues, simulateNewInboundClientMessage, receiveClientMessage, conversations } = useCrm();

  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+55 11 9');
  const [selectedQueueId, setSelectedQueueId] = useState(queues[0]?.id || 'dept_vendas');
  const [messageText, setMessageText] = useState('Olá! Gostaria de receber uma proposta para a minha empresa.');

  if (!isOpen) return null;

  const quickPresets = [
    'Acabei de fazer o PIX da entrada! Segue o comprovante.',
    'Olá, vocês têm pronta entrega desse item?',
    'Preciso de suporte com a integração do webhook no nosso sistema.',
    'Gostaria de agendar uma reunião comercial para amanhã às 14h.',
    'Qual o valor com desconto para pagamento à vista?',
  ];

  const handleSendSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (mode === 'existing') {
      const targetContact = contacts.find(c => c.id === selectedContactId);
      if (targetContact) {
        const conv = conversations.find(c => c.contactId === targetContact.id);
        if (conv) {
          receiveClientMessage(conv.id, messageText.trim());
        } else {
          simulateNewInboundClientMessage(targetContact.name, targetContact.phone, messageText.trim(), selectedQueueId);
        }
      }
    } else {
      if (!newName.trim() || !newPhone.trim()) return;
      simulateNewInboundClientMessage(newName.trim(), newPhone.trim(), messageText.trim(), selectedQueueId);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Simulador de Mensagens Inbound (WhatsApp)
              </h3>
              <p className="text-[11px] text-slate-400">
                Demonstra em tempo real a priorização automática da conversa no topo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Callout */}
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-200 flex items-start gap-2.5">
          <ArrowUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="text-[11px] leading-relaxed">
            <strong>Regra Connect Ativa:</strong> Ao disparar esta mensagem simulando o cliente, a conversa correspondente receberá som de alerta, contador de não lida e <em>subirá instantaneamente para o topo absoluto</em> (#1 da lista).
          </div>
        </div>

        <form onSubmit={handleSendSimulation} className="space-y-3.5">
          {/* Mode Switch (Existing vs New Contact) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setMode('existing')}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-center ${
                mode === 'existing'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cliente Cadastrado
            </button>
            <button
              type="button"
              onClick={() => setMode('new')}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors cursor-pointer text-center ${
                mode === 'new'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Novo Lead (Número Inédito)
            </button>
          </div>

          {mode === 'existing' ? (
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                Selecione o Cliente que enviará a mensagem:
              </label>
              <select
                value={selectedContactId}
                onChange={e => setSelectedContactId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.company || 'Sem empresa'}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nome do Lead:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Ex: Amanda Rezende"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Telefone WhatsApp:</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="+55 11 98877-6655"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* Target Queue */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Fila / Departamento Destino:
            </label>
            <select
              value={selectedQueueId}
              onChange={e => setSelectedQueueId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
            >
              {queues.map(q => (
                <option key={q.id} value={q.id}>
                  {q.name} ({q.description})
                </option>
              ))}
            </select>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-slate-400 mb-1.5 font-medium">
              Mensagens Rápidas de Teste:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPresets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessageText(preset)}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-md px-2 py-1 text-left cursor-pointer transition-colors"
                >
                  {preset.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">
              Texto da Mensagem do Cliente:
            </label>
            <textarea
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              rows={3}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 cursor-pointer font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simular Envio e Subir ao Topo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
