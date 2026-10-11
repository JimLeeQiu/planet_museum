import { SANDBOX_BODIES } from '../content/bodies/sandbox';
import { Sandbox } from '../components/Sandbox';

interface HomePageProps {
  onSelectBody: (id: string) => void;
}

const KIND_LABEL: Record<string, string> = {
  star: '恒星',
  planet: '行星',
  moon: '卫星',
  'dwarf-planet': '矮行星',
  asteroid: '小行星',
  comet: '彗星',
};

export function HomePage({ onSelectBody }: HomePageProps) {
  return (
    <>
      <Sandbox onSelectBody={onSelectBody} />
      <nav aria-label="天体索引" className="body-index">
        <h2>按距日顺序参观</h2>
        <ol>
          {SANDBOX_BODIES.map((body) => (
            <li key={body.id}>
              <button type="button" onClick={() => onSelectBody(body.id)}>
                <span className="body-name">{body.nameZh}</span>
                <span className="body-kind">{KIND_LABEL[body.kind] ?? body.kind}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
