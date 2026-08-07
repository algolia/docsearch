import pc from 'picocolors';

const colorEnabled =
  !('NO_COLOR' in process.env) &&
  (process.stdout.isTTY === true || process.env.FORCE_COLOR !== undefined);

function paint(fn: (input: string) => string): (text: string) => string {
  return (text: string) => (colorEnabled ? fn(text) : text);
}

export const color = {
  blue: paint(pc.blue),
  bold: paint(pc.bold),
  cyan: paint(pc.cyan),
  dim: paint(pc.dim),
  gray: paint(pc.gray),
  green: paint(pc.green),
  magenta: paint(pc.magenta),
  red: paint(pc.red),
  underline: paint(pc.underline),
  yellow: paint(pc.yellow),
};

const richUnicode =
  process.platform !== 'win32' ||
  process.env.WT_SESSION !== undefined ||
  process.env.TERM_PROGRAM !== undefined;

export const symbols = {
  accent: richUnicode ? '▍' : '|',
  arrow: richUnicode ? '→' : '->',
  bullet: richUnicode ? '•' : '*',
  checkboxOff: richUnicode ? '◯' : '[ ]',
  checkboxOn: richUnicode ? '◉' : '[x]',
  codeBottom: richUnicode ? '└' : '+',
  codeGutter: richUnicode ? '│' : '|',
  codeTop: richUnicode ? '┌' : '+',
  cross: richUnicode ? '✖' : 'x',
  diamond: richUnicode ? '◆' : '*',
  info: richUnicode ? 'ℹ' : 'i',
  link: richUnicode ? '↗' : '->',
  pointer: richUnicode ? '❯' : '>',
  rule: richUnicode ? '─' : '-',
  scoreOff: richUnicode ? '▱' : '-',
  scoreOn: richUnicode ? '▰' : '#',
  tick: richUnicode ? '✔' : 'v',
};

export function isInteractive(): boolean {
  return (
    process.stdin.isTTY === true &&
    process.stderr.isTTY === true &&
    typeof process.stdin.setRawMode === 'function'
  );
}

const DOCSEARCH_CYAN = [44, 200, 247] as const;
const DOCSEARCH_NEBULA = [84, 104, 255] as const;
const DOCSEARCH_PINK = [248, 44, 170] as const;

export function brandShade(level: number): (text: string) => string {
  const clamped = Math.max(0, Math.min(1, level));
  const [from, to, progress] =
    clamped >= 0.5
      ? [DOCSEARCH_NEBULA, DOCSEARCH_PINK, (clamped - 0.5) * 2]
      : [DOCSEARCH_CYAN, DOCSEARCH_NEBULA, clamped * 2];
  const [red, green, blue] = from.map((channel, index) =>
    Math.round(channel + (to[index] - channel) * progress)
  );

  return (text: string) =>
    colorEnabled
      ? `\u001B[38;2;${red};${green};${blue}m${text}\u001B[39m`
      : text;
}
