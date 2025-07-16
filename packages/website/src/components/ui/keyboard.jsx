import React, { useEffect, useRef, useState } from 'react';

export default function Keyboard() {
  function isAppleDevice() {
    if (typeof navigator !== 'undefined') {
      return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    }
    return false;
  }

  /* ---------- audio --------------------------------------------------- */
  const clickRef = useRef(null);

  const playClick = () => {
    if (clickRef.current) {
      clickRef.current.currentTime = 0; // rewind so rapid taps always sound
      clickRef.current.volume = 0.1; // play at lower volume (10% of full volume)
      clickRef.current.play().catch(() => {}); // ignore autoplay blocks
    }
  };

  /* ---------- key map / state ----------------------------------------- */
  // Detect if the user is on Windows to adapt the modifier key label / mapping

  const commandLabel = isAppleDevice() ? '⌘' : 'Ctrl';
  const commandKeyCodes = isAppleDevice() ? ['Meta'] : ['Control'];

  const keySpec = [
    {
      id: 'cmd',
      label: commandLabel,
      keyCodes: commandKeyCodes,
      hue: 512,
      saturate: 1.4,
      bright: 1.1,
    }, // ⌘ / Ctrl key depending on platform
    {
      id: 'k',
      label: 'K',
      keyCodes: ['k', 'K'],
      hue: 300,
      saturate: 1.3,
      bright: 0.8,
    },
    {
      id: 'search',
      label: 'Search',
      double: true,
      keyCodes: ['Enter', 'Space'],
      hue: 344,
      saturate: 1.3,
      bright: 1.0,
    },
  ];

  const [pressed, setPressed] = useState(keySpec.reduce((acc, k) => ({ ...acc, [k.id]: false }), {}));

  const pressOn = (id) => setPressed((p) => ({ ...p, [id]: true }));
  const pressOff = (id) => setPressed((p) => ({ ...p, [id]: false }));

  /* ---------- global keyboard listeners ------------------------------- */
  useEffect(() => {
    const down = (e) => {
      keySpec.forEach((k) => {
        if (k.keyCodes.includes(e.key)) {
          pressOn(k.id);
          playClick();
        }
      });
    };
    const up = (e) => {
      keySpec.forEach((k) => {
        if (k.keyCodes.includes(e.key)) pressOff(k.id);
      });
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- render --------------------------------------------------- */
  return (
    <>
      {/* hidden <audio> element — preload for instant playback */}
      <audio ref={clickRef} src="https://cdn.freesound.org/previews/378/378085_6260145-lq.mp3" preload="auto">
        <track kind="captions" />
      </audio>

      <div className="keypad">
        {/* base plate / shadow */}
        <div className="keypad__base">
          <img src="/img/resources/keypad-base.webp" alt="" />
        </div>

        {keySpec.map((k) => (
          <button
            type="button"
            key={k.id}
            className={[
              'key',
              k.double ? 'keypad__double' : 'keypad__single',
              k.id === 'cmd' ? 'keypad__single--left' : '',
            ].join(' ')}
            data-pressed={pressed[k.id] || undefined}
            style={{
              '--hue': `${k.hue}`,
              '--saturate': `${k.saturate}`,
              '--bright': `${k.bright}`,
            }}
            onPointerDown={() => {
              pressOn(k.id);
              playClick();
            }}
            onPointerUp={() => pressOff(k.id)}
            onPointerLeave={() => pressOff(k.id)}
          >
            <span className="key__mask">
              <span className="key__content">
                <span className={`key__text ${k.id === 'search' ? 'key__text--search' : ''}`}>{k.label}</span>
                <img
                  style={{
                    filter: `hue-rotate(${k.hue}deg) saturate(${k.saturate}) brightness(${k.bright})`,
                  }}
                  src={`/img/resources/${k.double ? 'keypad-double' : 'keypad-single'}.png`}
                  alt=""
                />
              </span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
