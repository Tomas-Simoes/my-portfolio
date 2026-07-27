import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

type EditorLogRequest = {
  method?: string;
  on: (event: 'data' | 'end', listener: (chunk?: Uint8Array | string) => void) => void;
};

type EditorLogResponse = {
  statusCode: number;
  end: () => void;
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'scene-editor-terminal-log',
      configureServer(server) {
        server.middlewares.use('/__editor-log', (request, response) => {
          const req = request as unknown as EditorLogRequest;
          const res = response as unknown as EditorLogResponse;

          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end();
            return;
          }

          let body = '';

          req.on('data', (chunk) => {
            body += chunk;
          });

          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              server.config.logger.info(`[scene-editor] ${JSON.stringify(payload)}`);
            } catch {
              server.config.logger.info(`[scene-editor] ${body}`);
            }

            res.statusCode = 204;
            res.end();
          });
        });
      },
    },
  ],
});
