import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { QuickReply } from '../../types/crm';
import {
  Zap,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

export const QuickRepliesView: React.FC = () => {
  const { quickReplies, addQuickReply, deleteQuickReply, currentAgent } = useCrm();

  const [shortcut, setShortcut] = useState('/');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcut.trim() || !title.trim() || !content.trim()) return;

    let sc = shortcut.trim();
    if (!sc.startsWith('/')) sc = '/' + sc;

    addQuickReply({
      shortcut: sc,
      title: title.trim(),
      content: content.trim(),
    });

    setShortcut('/');
    setTitle('');
    setContent('');
  };

  const handleCopy = (qr: QuickReply) => {
    navigator.clipboard.writeText(qr.content);
    setCopiedId(qr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-4 overflow-hidden select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Respostas Rápidas (Macros de Produtividade)</span>
            <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              {quickReplies.length} Cadastradas
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Agilize o atendimento aos clientes no chat digitando a barra <strong>/</strong> seguida do atalho (ex: <code className="text-emerald-400">/pix</code>, <code className="text-emerald-400">/ola</code>).
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: List of Quick Replies */}
        <div className="lg:col-span-2 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickReplies.map(qr => (
              <div
                key={qr.id}
                className="bg-slate-900 border border-slate-800/90 rounded-xl p-3.5 text-xs shadow-xs flex flex-col justify-between space-y-2 hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
                      {qr.shortcut}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(qr)}
                        className="p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                        title="Copiar texto"
                      >
                        {copiedId === qr.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteQuickReply(qr.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Excluir resposta rápida"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-200 mb-1">{qr.title}</h3>
                  <p className="text-[11px] text-slate-400 whitespace-pre-wrap leading-relaxed line-clamp-4">
                    {qr.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Atalho: {qr.shortcut}</span>
                  <span className="text-emerald-500">Pronto para uso</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Add New Quick Reply Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs h-fit space-y-3.5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-sm">Criar Nova Resposta Rápida</h3>
          </div>

          {/* Dynamic variables guide */}
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              Variáveis Dinâmicas Aceitas:
            </span>
            <ul className="space-y-0.5 list-disc pl-4 text-slate-400">
              <li><code className="text-emerald-400">{`{{nome}}`}</code>: Nome do cliente</li>
              <li><code className="text-emerald-400">{`{{atendente}}`}</code>: Nome do atendente logado</li>
              <li><code className="text-emerald-400">{`{{protocolo}}`}</code>: Número do protocolo gerado</li>
            </ul>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Atalho da Resposta *</label>
              <input
                type="text"
                value={shortcut}
                onChange={e => setShortcut(e.target.value)}
                required
                placeholder="/desconto"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Título Descritivo *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                placeholder="Ex: Condição Especial com Desconto"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Mensagem Completa *</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={5}
                placeholder="Olá {{nome}}! Conseguimos uma condição exclusiva para fechamento hoje..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Macro de Resposta</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
