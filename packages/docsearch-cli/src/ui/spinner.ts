/* eslint-disable import/no-unresolved -- NodeNext source imports use runtime .js extensions. */
import { color, symbols } from './theme.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const FRAME_INTERVAL_MS = 80;

export interface Spinner {
  fail: (text?: string) => void;
  stop: () => void;
  succeed: (text?: string) => void;
}

export function startSpinner(
  text: string,
  stream: NodeJS.WriteStream = process.stderr
): Spinner {
  const animate = stream.isTTY === true && !('NO_COLOR' in process.env);

  if (!animate) {
    stream.write(`${color.dim(symbols.bullet)} ${text}\n`);
    return { fail: noop, stop: noop, succeed: noop };
  }

  let frame = 0;
  stream.write('\u001B[?25l');

  const timer = setInterval(() => {
    frame = (frame + 1) % FRAMES.length;
    stream.write(`\r${color.cyan(FRAMES[frame])} ${text}`);
  }, FRAME_INTERVAL_MS);

  function clear(): void {
    clearInterval(timer);
    stream.write('\r\u001B[K\u001B[?25h');
  }

  return {
    fail(message) {
      clear();
      stream.write(`${color.red(symbols.cross)} ${message ?? text}\n`);
    },
    stop() {
      clear();
    },
    succeed(message) {
      clear();
      stream.write(`${color.green(symbols.tick)} ${message ?? text}\n`);
    },
  };
}

function noop(): void {
  // Intentionally empty: non-animated spinners have nothing to clear.
}
