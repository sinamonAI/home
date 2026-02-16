import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// 빌드 시 importmap 태그 제거 플러그인
// Vite 빌드는 모든 의존성을 번들하므로 importmap이 있으면 충돌 발생
function removeImportMap() {
  return {
    name: 'remove-importmap',
    transformIndexHtml(html: string) {
      return html.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), removeImportMap()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
