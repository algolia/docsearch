export const log = {
  colors: {
    reset: '\x1b[0m',
    info: Bun.color('oklch(86.5% 0.127 207.078)', 'ansi'),
    success: Bun.color('oklch(76.5% 0.177 163.223)', 'ansi'),
    warn: Bun.color('oklch(87.9% 0.169 91.605)', 'ansi'),
    error: Bun.color('oklch(71.2% 0.194 13.428)', 'ansi'),
    border: Bun.color('oklch(70.7% 0.022 261.325)', 'ansi'),
  },
  log(message: string) {
    process.stdout.write(`${message}\n`);
  },
  line() {
    this.log('');
  },
  info(message: string) {
    this.log(`${this.colors.info}\u2022 ${message}${this.colors.reset}`);
  },
  success(message: string) {
    this.log(`${this.colors.success}\u2713 ${message}${this.colors.reset}`);
  },
  warn(message: string) {
    this.log(`${this.colors.warn}! ${message} !${this.colors.reset}`);
  },
  error(message: string) {
    this.log(`${this.colors.error}\u2717 ${message}${this.colors.reset}`);
  },
  section(title: string) {
    this.log(
      `${log.colors.border}--------- ${title} -----------${log.colors.reset}`
    );
  },
};
