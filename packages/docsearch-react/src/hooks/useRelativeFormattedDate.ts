import { useMemo, useState } from 'react';

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;

const UNITS: Array<[number, Intl.RelativeTimeFormatUnit]> = [
  [MS_IN_DAY, 'day'],
  [MS_IN_HOUR, 'hour'],
  [MS_IN_MINUTE, 'minute'],
  [MS_IN_SECOND, 'second'],
];

export function useRelativeFormattedDate(start: Date | null, end = Date.now()): string | null {
  const [diff] = useState<[number, Intl.RelativeTimeFormatUnit]>(() => {
    const elapsed = Math.abs(Number(end) - Number(start));
    const [ms, unit] = UNITS.find(([threshold]) => elapsed >= threshold) ?? UNITS[UNITS.length - 1];

    return [Math.floor(elapsed / ms), unit];
  });

  const formattedDate = useMemo(() => {
    const locale = typeof navigator !== 'undefined' ? navigator.language : undefined;
    const [elapsedTime, elapsedUnit] = diff;

    return new Intl.RelativeTimeFormat(locale, {
      style: 'long',
    }).format(elapsedTime * -1, elapsedUnit);
  }, [diff]);

  return start ? formattedDate : null;
}
