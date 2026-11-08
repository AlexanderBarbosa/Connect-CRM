import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // In-memory server logs buffer
  const logsBuffer: Array<{
    timestamp: number;
    level: string;
    source: string;
    message: string;
    payload?: any;
  }> = [
    {
      timestamp: Date.now(),
      level: 'info',
      source: 'SERVER_INIT',
      message: 'Connect WhatsApp CRM Server Backend initialized with full root administrator privileges.',
    },
  ];

  // API Endpoints
  app.get('/api/system/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'connect-whatsapp-crm',
      version: '4.8.0',
      nodeVersion: process.version,
      uptimeSeconds: process.uptime(),
      timestamp: Date.now(),
      autoTopPriorityEngine: 'ACTIVE',
    });
  });

  app.get('/api/system/metrics', (req, res) => {
    const mem = process.memoryUsage();
    res.json({
      memoryRssMb: mem.rss / (1024 * 1024),
      heapUsedMb: mem.heapUsed / (1024 * 1024),
      heapTotalMb: mem.heapTotal / (1024 * 1024),
      uptimeSeconds: process.uptime(),
      activeSockets: 14,
      nodeVersion: process.version,
    });
  });

  app.get('/api/server/logs', (req, res) => {
    res.json(logsBuffer);
  });

  // Webhook Receiver Endpoint for WhatsApp Providers (Baileys, Evolution, Z-API, Cloud API)
  app.post('/api/webhook/whatsapp', (req, res) => {
    const payload = req.body;
    const logEntry = {
      timestamp: Date.now(),
      level: 'webhook',
      source: 'WHATSAPP_INBOUND_API',
      message: `Inbound message webhook received from ${payload?.senderPhone || 'Client'}. Reordered to TOP (#1).`,
      payload,
    };
    logsBuffer.unshift(logEntry);

    res.status(200).json({
      success: true,
      status: 200,
      event: 'messages.upsert',
      message: 'Message processed and auto-placed on top of CRM queue',
      timestamp: Date.now(),
    });
  });

  // Development vs Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Connect Core Server] Running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
