import { useState } from 'react';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { HomePage } from './pages/HomePage';
import { ExhibitPage } from './pages/ExhibitPage';
import { CreditsFooter } from './components/CreditsFooter';

export type Route = { page: 'home' } | { page: 'exhibit'; bodyId: string };

interface AppProps {
  /** SSR/直达链接注入的初始路由；客户端仅在校验后才传入（SPEC §1.3） */
  initialRoute?: Route;
}

export function App({ initialRoute }: AppProps) {
  const [route, setRoute] = useState<Route>(initialRoute ?? { page: 'home' });
  const [fading, setFading] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const navigate = (next: Route) => {
    if (reducedMotion) {
      setRoute(next);
      return;
    }
    setFading(true);
    window.setTimeout(() => {
      setRoute(next);
      setFading(false);
    }, 220);
  };

  return (
    <main className={fading ? 'page page-fading' : 'page'}>
      <header className="site-header">
        <p className="wordmark">星球博物馆</p>
        <p className="wordmark-sub">Planet Museum</p>
      </header>
      {route.page === 'home' ? (
        <HomePage
          onSelectBody={(bodyId) => navigate({ page: 'exhibit', bodyId })}
        />
      ) : (
        <ExhibitPage
          bodyId={route.bodyId}
          onBack={() => navigate({ page: 'home' })}
        />
      )}
      <CreditsFooter />
    </main>
  );
}
