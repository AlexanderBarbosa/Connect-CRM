# Connect CRM — WhatsApp Multi-Atendimento & Gestão de Vendas

Sistema completo e profissional de atendimento multi-agente via WhatsApp integrado a CRM de vendas, distribuição inteligente por departamentos e acesso administrativo irrestrito à infraestrutura do servidor.

---

## 📌 Visão Geral

O **Connect CRM** foi desenvolvido para centralizar múltiplos atendentes em um único ou múltiplos números de WhatsApp, eliminando gargalos no atendimento comercial e de suporte. A plataforma oferece controle total sobre filas de espera, transferências internas, funil de vendas (Kanban) e telemetria do servidor em tempo real.

O grande destaque do sistema é a sua **Engine de Priorização Ativa (Auto-Topo)**: toda vez que um cliente envia uma nova mensagem, a conversa correspondente é reposicionada automaticamente no topo absoluto (#1) da fila de atendimento, emitindo um alerta sonoro e destaque visual para que nenhuma mensagem passe despercebida.

---

## 🚀 Funcionalidades Principais

### 1. 💬 Central de Atendimento Multi-Atendentes (Live Chat)
- **Interface Estilo WhatsApp Web**: Layout limpo, balões de mensagem autênticos, status de entrega (*enviado*, *entregue*, *lido*) e marcadores de tempo tabulares.
- **Auto-Topo Imediato**: Reordenação instantânea na chegada de novas mensagens de clientes.
- **Notas Internas**: Comentários privados com destaque em tom âmbar e ícone de cadeado, visíveis apenas para a equipe interna de atendentes e supervisores.
- **Transferência de Conversas**: Encaminhamento de chamados entre atendentes ou entre setores (ex.: Comercial para Suporte ou Financeiro) com um clique.
- **Filtros Ágeis**: Visualização segmentada por *Todas*, *Minhas Conversas*, *Aguardando na Fila* e *Resolvidas/Finalizadas*.

### 2. ⚡ Respostas Rápidas (Macros com Atalho `/`)
- Digitação rápida com a tecla `/` para acionar mensagens pré-configuradas (ex.: `/ola`, `/pix`, `/planos`, `/horario`, `/tchau`).
- **Variáveis Dinâmicas**: Substituição automática em tempo real de marcadores como `{{nome}}`, `{{atendente}}` e `{{protocolo}}`.

### 3. 📊 CRM & Funil de Vendas Kanban
- **Pipeline de Oportunidades**: Visualização em colunas por estágio de negociação:
  1. *Novo Lead*
  2. *Qualificação*
  3. *Em Atendimento*
  4. *Proposta Enviada*
  5. *Em Negociação*
  6. *Fechado / Ganho (Venda Concluída)*
  7. *Perdido*
- **Totalizadores em R$**: Valor acumulado por coluna e cálculo do valor total do pipeline ativo.
- **Acesso Rápido**: Botão para abrir o chat WhatsApp do cliente diretamente a partir do card do Kanban.

### 4. 👥 Gestão de Contatos & Leads
- Cadastro completo de clientes com nome, telefone/WhatsApp, e-mail, empresa, tags personalizadas, observações e valor potencial.
- Exportação de dados da base em formato **CSV**.
- Busca instantânea por múltiplos campos (nome, telefone, tags ou empresa).

### 5. 🤖 Chatbot de Triagem & Filas de Atendimento (URA)
- **Menu Automático de Boas-Vindas**: Apresenta opções numéricas no primeiro contato do cliente (ex.: *1 para Vendas*, *2 para Suporte*, *3 para Financeiro*).
- **Simulador de Smartphone**: Pré-visualização em tempo real de como o fluxo é exibido no aplicativo do WhatsApp do cliente.
- **Regras de Distribuição por Departamento**:
  - *Round-Robin*: Distribuição circular uniforme entre atendentes da fila.
  - *Menor Carga*: Direciona para o atendente com menos tickets ativos no momento.
  - *Fila Aberta (Manual)*: O chamado fica aguardando e qualquer atendente livre pode puxá-lo.

### 6. 📶 Gestão de Conexões WhatsApp (Multi-Device)
- Suporte a múltiplos números e instâncias simultâneas (Matriz, Filiais, etc.).
- **Gerador de QR Code**: Emulador dinâmico de conexão via socket Baileys/Evolution API com contagem regressiva e status de sincronização.
- Indicador de bateria do aparelho conectado, tempo de sessão (uptime) e contador de mensagens enviadas e recebidas no dia.

### 7. 🛡️ Painel Administrativo de Equipe & Regras
- Cadastro e gerenciamento de atendentes com diferentes níveis de acesso:
  - **Super Administrador**: Controle irrestrito do sistema e do servidor.
  - **Administrador**: Gestão de filas, contatos e configurações da empresa.
  - **Supervisor**: Acompanhamento de relatórios, monitoramento e transferências.
  - **Atendente / Operador**: Focado na leitura e resposta dos tickets atribuídos.
- Configuração de horários de atendimento comercial e tempo limite para encerramento automático por inatividade.

### 8. 🖥️ Console do Servidor (Acesso Total Root)
- **Terminal CLI Interativo**: Linha de comando com prompt `root@connect-srv01:~#` e comandos executáveis:
  - `status`: Exibe status do serviço `connect-server.service`, versão do Node.js, tempo ativo e uso de memória.
  - `top`: Lista em tempo real a ordem das conversas priorizadas no topo.
  - `routes`: Exibe todas as rotas da API REST do Express registradas.
  - `restart-worker`: Reinicia o socket de conexão do WhatsApp.
  - `clear-cache`: Esvazia a memória temporária do servidor.
  - `webhook-test`: Dispara um evento de teste para simular o auto-topo.
  - `backup-db`: Cria um snapshot JSON criptografado do banco de dados.
  - `stats`: Estatísticas de throughput do servidor.
  - `env`: Lista variáveis de ambiente sanitizadas.
- **Inspetor de Logs em Tempo Real**: Filtros por criticidade (`INFO`, `WARN`, `ERROR`, `WEBHOOK`, `SOCKET`), inspeção detalhada de payloads JSON e download de arquivos `.log`.
- **Simulador de Webhooks Inbound**: Formulário integrado para testar o envio de requisições `POST /api/webhook/whatsapp`.

---

## 🎯 Aplicações e Casos de Uso no Mercado

O **Connect CRM** é ideal para diversas verticais que demandam alto volume de mensagens e organização comercial:

| Segmento | Aplicação Prática |
| :--- | :--- |
| **E-commerce & Varejo** | Atendimento de dúvidas pré-venda, envio de chave PIX com respostas rápidas, rastreamento de pedidos e pós-venda. |
| **Clínicas & Consultórios** | Agendamento e confirmação de consultas, triagem por especialidade (Chatbot) e prontuário rápido em notas internas. |
| **Empresas B2B & Serviços** | Qualificação de leads, negociação de orçamentos pelo Kanban e transferência entre vendedores e consultores técnicos. |
| **Escritórios de Advocacia / Contabilidade** | Roteamento para departamentos (Fiscal, Trabalhista, Societário) e histórico centralizado de mensagens e comprovantes. |
| **Imobiliárias & Construtoras** | Recepção de interessados por imóvel, registro do valor do negócio e acompanhamento de propostas em andamento. |
| **Startups & Empresas SaaS** | Suporte técnico com inspeção de webhooks, integração com ERPs e atendimento centralizado em um só canal. |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - React 19 (Hooks, Context API)
  - TypeScript
  - Tailwind CSS v4
  - Lucide React (Ícones funcionais)
  - Motion (Animações de interface)
  - Web Audio API (Sintetizador nativo de alertas sonoros)
- **Backend & Servidor**:
  - Node.js & Express
  - Middleware de desenvolvimento Vite SPA
  - Endpoints REST para `/api/system/health`, `/api/system/metrics`, `/api/webhook/whatsapp` e `/api/server/logs`
- **Tipografia**:
  - *Plus Jakarta Sans* (Interface e display)
  - *JetBrains Mono* (Terminal CLI, métricas e timestamps tabulares)

---

## 📦 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 20 ou superior recomendada)
- Gerenciador de pacotes `npm`

### 1. Instalação das dependências
```bash
npm install
```

### 2. Executando em ambiente de desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento estará disponível em `http://localhost:3000`.

### 3. Compilando para produção
```bash
npm run build
```

### 4. Inicializando o servidor Express
```bash
npm start
```

---

## 📄 Licença

Distribuído sob a licença Apache-2.0. Consulte o arquivo de licença para mais detalhes.
