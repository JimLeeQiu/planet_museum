import credits from '../generated/credits.json';

/** 构建期生成的署名清单（npm run generate:credits），按来源分层展示。 */
export function CreditsFooter() {
  const attributions = [
    ...new Set(credits.assets.map((asset) => asset.attribution)),
  ];
  return (
    <footer className="site-footer">
      <details>
        <summary>素材署名与许可</summary>
        <p>本站为静态亲子科普项目，无广告、无追踪。下列素材按各自许可单独署名：</p>
        <ul>
          {attributions.map((attribution) => (
            <li key={attribution}>{attribution}</li>
          ))}
        </ul>
        <p>
          代码以 AGPL-3.0 许可发布；原创文字与配音以 CC BY-NC-SA 4.0
          许可发布。完整清单见 THIRD_PARTY_NOTICES.md。
        </p>
        <p>
          本站配音由 AI 语音合成（阿里云 CosyVoice），讲解脚本经人工审核；
          合成参数与输出指纹登记于各展台 audio/narration.zh-CN.metrics.json。
        </p>
      </details>
    </footer>
  );
}
