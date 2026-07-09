import pc from 'picocolors';

const colorEnabled =
  !('NO_COLOR' in process.env) && (process.stdout.isTTY === true || process.env.FORCE_COLOR !== undefined);

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
  process.platform !== 'win32' || process.env.WT_SESSION !== undefined || process.env.TERM_PROGRAM !== undefined;

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
  return process.stdin.isTTY === true && process.stderr.isTTY === true;
}

// Maps a 0..1 level to the xterm-256 grayscale ramp (232=black .. 255=white)
// so we can paint a smooth vertical gradient on the wordmark.
export function shade(level: number): (text: string) => string {
  const clamped = Math.max(0, Math.min(1, level));
  const code = 232 + Math.round(clamped * 23);
  return (text: string) => (colorEnabled ? `\u001B[38;5;${code}m${text}\u001B[39m` : text);
}
