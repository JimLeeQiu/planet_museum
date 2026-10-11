/**
 * 配音管线（SPEC §6 的阿里云版；构建时批量合成，静态资产入仓）。
 *
 * 流程：旁白文案（恰好两句 + pronunciation 表）→ 阿里云 CosyVoice 流式合成
 * （WebSocket，商用版）→ 24 kHz mono MP3 入 audio/narration.zh-CN.mp3
 * → 脚本 hash 与输出 hash 写入 narration.zh-CN.metrics.json
 * → 听审状态写入 narration.zh-CN.review.json（pending-review 默认，--approve 翻转）
 * → provenance.json 追加/刷新 narration.zh-CN 记录。
 *
 * 凭证只从环境变量读取，绝不入仓：
 *   NLS_APPKEY / NLS_ACCESS_KEY_ID / NLS_ACCESS_KEY_SECRET
 *   NLS_VOICE（默认 longjielidou_v2 龙杰力豆·童声）
 *
 * 用法：
 *   node scripts/synthesize-narration.mjs                  # 合成全部待配音天体
 *   node scripts/synthesize-narration.mjs mercury moon     # 只合成指定天体
 *   node scripts/synthesize-narration.mjs --approve mercury moon  # 人工听审通过后解锁
 */
import { createHash, createHmac, randomBytes, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const bodiesRoot = join(siteRoot, 'src/content/bodies');

const APPKEY = process.env.NLS_APPKEY;
const AK_ID = process.env.NLS_ACCESS_KEY_ID;
const AK_SECRET = process.env.NLS_ACCESS_KEY_SECRET;
const VOICE = process.env.NLS_VOICE ?? 'longjielidou_v2';
const GATEWAY = 'wss://nls-gateway-cn-beijing.aliyuncs.com/ws/v1';
const TOKEN_ENDPOINT = 'https://nls-meta.cn-shanghai.aliyuncs.com/';
const FORMAT = 'mp3';
const SAMPLE_RATE = 24000; // longjielidou_v2 支持 8k/16k/24k（SPEC 48k 为 Azure 口径，见 metrics 备注）
const SPEECH_RATE = -10; // 放慢语速讲故事，适配 2–6 岁（SPEC §6.2 的 0.9× 近似）
const PITCH_RATE = 0;
const VOLUME = 50;

const args = process.argv.slice(2);
const approveMode = args.includes('--approve');
const ids = args.filter((arg) => !arg.startsWith('--'));

const ALL_IDS = [
  'sun', 'mercury', 'venus', 'moon', 'mars', 'jupiter', 'europa', 'io',
  'saturn', 'titan', 'uranus', 'neptune', 'pluto', 'ceres', 'vesta',
  'bennu', 'halley',
];

if (!APPKEY || !AK_ID || !AK_SECRET) {
  console.error('缺少环境变量：NLS_APPKEY / NLS_ACCESS_KEY_ID / NLS_ACCESS_KEY_SECRET');
  process.exit(1);
}

// —— CreateToken（RPC 签名 V1.0）——
function percentEncode(str) {
  return encodeURIComponent(str)
    .replace(/\+/g, '%20')
    .replace(/\*/g, '%2A')
    .replace(/%7E/g, '~');
}

async function createToken() {
  const params = {
    Action: 'CreateToken',
    Version: '2019-02-28',
    AccessKeyId: AK_ID,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    SignatureVersion: '1.0',
    SignatureNonce: randomUUID(),
    RegionId: 'cn-shanghai',
    Format: 'JSON',
  };
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&');
  params.Signature = createHmac('sha1', `${AK_SECRET}&`)
    .update(`GET&%2F&${percentEncode(canonical)}`)
    .digest('base64');
  const query = Object.keys(params)
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join('&');
  const result = await (await fetch(`${TOKEN_ENDPOINT}?${query}`)).json();
  if (!result.Token?.Id) {
    console.error('CreateToken 失败：', JSON.stringify(result));
    process.exit(1);
  }
  return result.Token.Id;
}

// —— CosyVoice 流式合成（WebSocket，协议见 aliyun SDK 源码）——
const hex32 = () => randomBytes(16).toString('hex');

function synthesize(token, text) {
  return new Promise((resolve, reject) => {
    const taskId = hex32();
    const ws = new WebSocket(GATEWAY, { headers: { 'X-NLS-Token': token } });
    const chunks = [];
    let measureLength = null;
    const send = (name, payload) =>
      ws.send(
        JSON.stringify({
          header: {
            message_id: hex32(),
            task_id: taskId,
            namespace: 'FlowingSpeechSynthesizer',
            name,
            appkey: APPKEY,
          },
          ...(payload ? { payload } : {}),
        }),
      );
    const failTimer = setTimeout(() => {
      try { ws.close(); } catch { /* 忽略 */ }
      reject(new Error('合成超时'));
    }, 60_000);
    ws.onopen = () => {
      send('StartSynthesis', {
        voice: VOICE,
        format: FORMAT,
        sample_rate: SAMPLE_RATE,
        volume: VOLUME,
        speech_rate: SPEECH_RATE,
        pitch_rate: PITCH_RATE,
      });
      setTimeout(() => send('RunSynthesis', { text }), 300);
      setTimeout(() => send('StopSynthesis'), 600);
    };
    ws.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data);
        if (msg.header.name === 'SynthesisCompleted') {
          clearTimeout(failTimer);
          measureLength = msg.payload?.measureLength ?? null;
          ws.close();
        } else if (msg.header.name === 'TaskFailed') {
          clearTimeout(failTimer);
          ws.close();
          reject(new Error(`合成失败：${msg.header.status} ${msg.header.status_text ?? ''}`));
        }
      } else {
        chunks.push(
          event.data.arrayBuffer
            ? event.data.arrayBuffer().then((buffer) => Buffer.from(buffer))
            : Promise.resolve(Buffer.from(event.data)),
        );
      }
    };
    ws.onerror = () => {
      clearTimeout(failTimer);
      reject(new Error('WebSocket 连接错误'));
    };
    ws.onclose = () => {
      clearTimeout(failTimer);
      Promise.all(chunks).then((buffers) => {
        const audio = Buffer.concat(buffers);
        if (audio.length === 0) {
          reject(new Error('未收到音频数据'));
          return;
        }
        resolve({ audio, measureLength });
      });
    };
  });
}

// —— body.ts / provenance.json 修补 ——
function patchBodyTs(bodyDir) {
  const path = join(bodyDir, 'body.ts');
  let source = readFileSync(path, 'utf8');
  if (source.includes('narration.zh-CN.mp3?url')) return false; // 已接线
  const importLines = [
    "import audioUrl from './audio/narration.zh-CN.mp3?url';",
    "import review from './audio/narration.zh-CN.review.json';",
  ];
  const lines = source.split('\n');
  const lastImport = lines.reduce(
    (index, line, i) => (line.startsWith('import ') ? i : index),
    -1,
  );
  if (lastImport < 0) throw new Error('body.ts 未找到 import 区块');
  lines.splice(lastImport + 1, 0, ...importLines);
  source = lines.join('\n');

  if (!source.replace(/\s/g, ' ').includes('narrationAudioUrl: null,')) {
    throw new Error('body.ts 未找到 narrationAudioUrl: null，需人工接线');
  }
  source = source.replace(
    /narrationAudioUrl:\s*null,/,
    'narrationAudioUrl: audioUrl,',
  );
  const planPattern = /narrationPlan:\s*\{ status: 'pending-review', gate: \{ id: 'final-narration' \} \},/;
  if (!planPattern.test(source)) {
    throw new Error('body.ts 未找到预期的 narrationPlan 行，需人工接线');
  }
  source = source.replace(
    planPattern,
    `narrationPlan:
    review.humanReviewStatus === 'approved'
      ? { status: 'ready', humanReviewStatus: 'approved' }
      : { status: 'pending-review', gate: { id: 'final-narration' } },`,
  );
  writeFileSync(path, source);
  return true;
}

function upsertProvenance(bodyDir, audio, textSha256) {
  const path = join(bodyDir, 'provenance.json');
  const records = JSON.parse(readFileSync(path, 'utf8'));
  const filtered = records.filter((record) => record.assetId !== 'narration.zh-CN');
  const parametersJson = JSON.stringify({
    voice: VOICE,
    format: FORMAT,
    sampleRate: SAMPLE_RATE,
    speechRate: SPEECH_RATE,
    pitchRate: PITCH_RATE,
    volume: VOLUME,
    gateway: GATEWAY,
    textSha256,
    note: 'SAMPLE_RATE=24000：杰力豆 v2 音色最高支持 24 kHz（SPEC §6.2 的 48 kHz 为 Azure 口径）',
  });
  filtered.push({
    assetId: 'narration.zh-CN',
    spdxLicenseId: 'CC-BY-NC-SA-4.0',
    origin: 'generated',
    sourceUrl: null,
    sha256: createHash('sha256').update(audio).digest('hex'),
    bytes: audio.length,
    accessedOn: null,
    generatedBy: {
      tool: 'scripts/synthesize-narration.mjs',
      version: '0.1.0',
      parametersJson,
      seed: null,
    },
    modifications: [],
    attribution:
      '星球博物馆项目配音：阿里云智能语音交互 CosyVoice 合成（龙杰力豆·童声）；脚本经人工审核，AI 合成语音，站点已作披露',
    redistributable: true,
    evidencePath: 'scripts/synthesize-narration.mjs',
  });
  writeFileSync(path, `${JSON.stringify(filtered, null, 2)}\n`);
}

function writeReview(bodyDir, approved) {
  const review = {
    humanReviewStatus: approved ? 'approved' : 'pending-review',
    reviewer: '人工听审（星球博物馆项目组）',
    checklist: ['名称读音', '多音字', '漏字', '响度', '节奏', '适龄性'],
    reviewedOn: approved ? new Date().toISOString().slice(0, 10) : null,
  };
  writeFileSync(
    join(bodyDir, 'audio/narration.zh-CN.review.json'),
    `${JSON.stringify(review, null, 2)}\n`,
  );
}

// —— 主流程 ——
const targets = approveMode
  ? (ids.length > 0 ? ids : ALL_IDS)
  : (ids.length > 0 ? ids : ALL_IDS.filter((id) =>
      existsSync(join(bodiesRoot, id, 'content.zh-CN.ts')),
    ));

if (approveMode) {
  for (const id of targets) {
    const bodyDir = join(bodiesRoot, id);
    const audioPath = join(bodyDir, 'audio/narration.zh-CN.mp3');
    if (!existsSync(audioPath)) {
      console.error(`${id}: 无音频，不能听审通过`);
      process.exitCode = 1;
      continue;
    }
    writeReview(bodyDir, true);
    console.log(`${id}: 听审通过，narrationPlan 解锁为 ready`);
  }
  process.exit(process.exitCode ?? 0);
}

const token = await createToken();
console.log(`Token 获取成功；音色 ${VOICE}，共 ${targets.length} 段`);

for (const id of targets) {
  const bodyDir = join(bodiesRoot, id);
  try {
    const contentModule = await import(
      `file://${join(bodyDir, 'content.zh-CN.ts')}`
    );
    const content = contentModule[`${id}Content`];
    if (!content) throw new Error(`content.zh-CN.ts 未导出 ${id}Content`);
    const text = content.narration.sentences.join('');
    const textSha256 = createHash('sha256').update(text, 'utf8').digest('hex');

    const { audio, measureLength } = await synthesize(token, text);
    mkdirSync(join(bodyDir, 'audio'), { recursive: true });
    writeFileSync(join(bodyDir, 'audio/narration.zh-CN.mp3'), audio);
    writeReview(bodyDir, false);
    writeFileSync(
      join(bodyDir, 'audio/narration.zh-CN.metrics.json'),
      `${JSON.stringify(
        {
          scriptSha256: textSha256,
          outputSha256: createHash('sha256').update(audio).digest('hex'),
          charsBilled: measureLength,
          voice: VOICE,
          synthesizedAt: new Date().toISOString(),
          engine: '阿里云智能语音交互 CosyVoice（商用版）',
        },
        null,
        2,
      )}\n`,
    );
    patchBodyTs(bodyDir);
    upsertProvenance(bodyDir, audio, textSha256);
    console.log(`${id}: OK ${(audio.length / 1024).toFixed(0)} KB（计费字符 ${measureLength ?? '?'}）`);
  } catch (error) {
    console.error(`${id}: 失败 — ${error.message}`);
    process.exitCode = 1;
  }
}
