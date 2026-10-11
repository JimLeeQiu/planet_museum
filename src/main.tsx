import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { validateInitialState } from './ssr/validateInitialState';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Missing #root element');
}

function readInitialRoute() {
  try {
    const script = document.getElementById('pm-initial-state');
    if (!script?.textContent) return null;
    return validateInitialState(JSON.parse(script.textContent));
  } catch {
    return null;
  }
}

const initialRoute = readInitialRoute();

if (initialRoute && container.firstChild) {
  // 构建期 SSG 产物：以水合方式接管服务端渲染的标记
  hydrateRoot(
    container,
    <StrictMode>
      <App initialRoute={initialRoute} />
    </StrictMode>,
  );
} else {
  createRoot(container).render(
    <StrictMode>
      <App initialRoute={initialRoute ?? undefined} />
    </StrictMode>,
  );
}
