import { renderToString } from 'react-dom/server';
import { App, type Route } from '../App';

export type { Route };

/** 构建期 SSG（SPEC §1.3）：把页面渲染为 HTML 字符串，由 scripts/ssg.mjs 写入 dist/。 */
export function renderApp(route: Route): string {
  return renderToString(<App initialRoute={route} />);
}
