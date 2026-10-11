import { useState } from 'react';
import { getBodyById } from '../content/bodies/sandbox';
import { getRuntimeBody } from '../content/registry';
import type { RuntimeBody } from '../content/types';
import { ExhibitStage } from '../components/ExhibitStage';
import { NarrationButton } from '../components/NarrationButton';
import { CompareView } from '../components/CompareView';

interface ExhibitPageProps {
  bodyId: string;
  onBack: () => void;
}

export function ExhibitPage({ bodyId, onBack }: ExhibitPageProps) {
  const body = getRuntimeBody(bodyId);
  const sandboxInfo = getBodyById(bodyId);

  return (
    <section aria-label={`${sandboxInfo?.nameZh ?? bodyId}展台`}>
      <button type="button" onClick={onBack} className="back-button">
        ← 回到太阳系沙盘
      </button>
      {body ? (
        <FullExhibit body={body} />
      ) : (
        <>
          <h1>{sandboxInfo?.nameZh ?? bodyId}</h1>
          <p className="exhibit-coming">展台正在布置中，敬请期待。</p>
        </>
      )}
    </section>
  );
}

function FullExhibit({ body }: { body: RuntimeBody }) {
  const { content } = body;
  // 「和地球比比看」仅非地球天体展示（地球即参照物本身，SPEC §3.2）
  const comparable = body.id !== 'earth';
  const [comparing, setComparing] = useState(false);

  return (
    <article>
      <h1>{content.name.zh}</h1>
      <p className="exhibit-original">{content.name.original}</p>

      {comparing && comparable ? <CompareView body={body} /> : <ExhibitStage body={body} />}

      <div className="exhibit-actions">
        <NarrationButton plan={body.narrationPlan} audioUrl={body.narrationAudioUrl} />
        {comparable && (
          <button
            type="button"
            className="compare-button"
            aria-pressed={comparing}
            onClick={() => setComparing((value) => !value)}
          >
            {comparing ? '回到展台视图' : '和地球比比看'}
          </button>
        )}
      </div>

      <section aria-label="数据卡片">
        <h2>比一比，想一想</h2>
        <ul className="fact-cards">
          {content.facts.map((fact) => (
            <li key={fact.title}>
              <p className="fact-title">{fact.title}</p>
              <p className="fact-analogy">{fact.analogy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="给家长">
        <h2>陪娃一起聊</h2>
        <ul className="parent-guide">
          {content.parentGuide.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>

      {content.uncertaintyNotes.length > 0 && (
        <details className="uncertainty">
          <summary>这些小知识要怎么告诉孩子？</summary>
          <ul>
            {content.uncertaintyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </details>
      )}

      <footer className="exhibit-sources">
        <h2>资料来源</h2>
        <ul>
          {content.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url}>{source.label}</a>
              <span className="source-date">（{source.accessedOn} 查阅）</span>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
