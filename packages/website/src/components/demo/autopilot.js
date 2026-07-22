// Autopilot for the homepage DocSearch demo.
//
// Drives the *real* DocSearch widget (modal + side panel) through a scripted
// tour: open, pin/unpin a saved search, search-as-you-type, Ask AI in the
// modal, then open the side panel and ask a question there. Every action is a
// real API call or a synthetic DOM event, so the widget stays fully live.
//
// The tour yields to the user instantly: any *trusted* pointer/keyboard/scroll
// event pauses it (synthetic events dispatched here are `isTrusted === false`),
// and it resumes from the top after a period of inactivity.

const RESUME_AFTER_IDLE_MS = 10_000;
const MIN_AUTOPLAY_WIDTH = 640;

const SEARCH_QUERY = 'installation';
const MODAL_AI_QUESTION = 'How do I install DocSearch in Docusaurus?';
const SIDEPANEL_QUESTION = 'What can Ask AI do for my docs?';

// A believable set of "recently viewed docs" so the start screen has something
// to pin/unpin. Shape matches `StoredDocSearchHit`.
const SEED_RECENT_SEARCHES = [
  hit('getting-started', 'Getting started', 'Guides', 'installation'),
  hit('react', 'React', 'Integrations', 'react'),
  hit('api-reference', 'API reference', 'Reference', 'api'),
];

function hit(id, lvl1, lvl0, anchor) {
  const url = `https://docsearch.algolia.com/docs/${id}`;
  return {
    objectID: `demo-${id}`,
    content: null,
    url: `${url}#${anchor}`,
    url_without_anchor: url,
    type: 'lvl1',
    anchor,
    hierarchy: { lvl0, lvl1, lvl2: null, lvl3: null, lvl4: null, lvl5: null, lvl6: null },
  };
}

const rand = (min, max) => min + Math.random() * (max - min);

export function createAutopilot({ modalRef, sidepanelRef, indexName }) {
  const RECENT_KEY = `__DOCSEARCH_RECENT_SEARCHES__${indexName}`;
  const FAVORITE_KEY = `__DOCSEARCH_FAVORITE_SEARCHES__${indexName}`;

  let enabled = true;
  let visible = false;
  let userActive = false;
  let running = false;
  let token = { cancelled: true };
  let idleTimer = null;
  let cursorEl = null;

  // --- cancellation ------------------------------------------------------
  function newToken() {
    token.cancelled = true;
    token = { cancelled: false };
    return token;
  }
  const alive = (t) => !t.cancelled && visible && !userActive && enabled;

  function sleep(ms, t) {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      // Bail early if the run gets cancelled mid-wait.
      const check = setInterval(() => {
        if (t.cancelled) {
          clearTimeout(timer);
          clearInterval(check);
          resolve();
        }
      }, 60);
      setTimeout(() => clearInterval(check), ms + 10);
    });
  }

  async function waitFor(selector, t, timeout = 4000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (t.cancelled) return null;
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(80, t);
    }
    return document.querySelector(selector);
  }

  // --- ghost cursor ------------------------------------------------------
  function ensureCursor() {
    if (cursorEl && cursorEl.isConnected) return cursorEl;
    cursorEl = document.createElement('div');
    cursorEl.className = 'ds-demo-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorEl);
    return cursorEl;
  }

  function hideCursor() {
    if (cursorEl) cursorEl.classList.remove('is-visible', 'is-clicking');
  }

  async function moveCursorTo(el, t) {
    if (!el) return;
    const cursor = ensureCursor();
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    cursor.classList.add('is-visible');
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    await sleep(rand(520, 720), t);
  }

  function pulse() {
    if (!cursorEl) return;
    cursorEl.classList.add('is-clicking');
    setTimeout(() => cursorEl && cursorEl.classList.remove('is-clicking'), 240);
  }

  // --- synthetic interactions -------------------------------------------
  async function moveAndClick(selector, t) {
    const el = typeof selector === 'string' ? await waitFor(selector, t) : selector;
    if (!alive(t) || !el) return null;
    await moveCursorTo(el, t);
    if (!alive(t)) return null;
    pulse();
    el.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    el.click();
    return el;
  }

  function setNativeValue(el, value) {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(el, value);
    else el.value = value;
  }

  async function typeInto(el, text, t) {
    if (!el) return;
    el.focus();
    let current = '';
    for (const char of text) {
      if (!alive(t)) return;
      current += char;
      setNativeValue(el, current);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(rand(45, 95), t);
    }
  }

  // --- storage seeding ---------------------------------------------------
  function seedRecentSearches() {
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(SEED_RECENT_SEARCHES));
      window.localStorage.removeItem(FAVORITE_KEY);
    } catch {
      // localStorage may be unavailable; the tour still runs, just without the
      // pin/unpin beat.
    }
  }

  function reset() {
    try {
      modalRef.current?.close();
    } catch {
      /* noop */
    }
    try {
      sidepanelRef.current?.close();
    } catch {
      /* noop */
    }
    hideCursor();
  }

  // --- the tour ----------------------------------------------------------
  async function scenario(t) {
    reset();
    seedRecentSearches();
    await sleep(900, t);
    if (!alive(t)) return;

    // 1. Open the search modal.
    await moveAndClick('.DocSearch-Button', t);
    const input = await waitFor('.DocSearch-Input', t);
    if (!alive(t) || !input) return;
    await sleep(700, t);

    // 2. Pin a recently-viewed doc (recent -> favorite).
    const pin = document.querySelector('.DocSearch-Hit-action-button--pin');
    if (pin && alive(t)) {
      await moveAndClick(pin, t);
      await sleep(900, t);
    }

    // 3. Unpin it again.
    const unpin =
      document.querySelector('.DocSearch-Hit-action-button[title="Remove this saved search"]') ||
      document.querySelector('.DocSearch-Hits .DocSearch-Hit-action-button:not(.DocSearch-Hit-action-button--pin)');
    if (unpin && alive(t)) {
      await moveAndClick(unpin, t);
      await sleep(900, t);
    }
    if (!alive(t)) return;

    // 4. Search as you type.
    await moveCursorTo(input, t);
    await typeInto(input, SEARCH_QUERY, t);
    await waitFor('.DocSearch-Hit a', t, 3000);
    await sleep(1200, t);
    if (!alive(t)) return;

    // 5. Ask AI, in the modal.
    const askAiCta = document.querySelector('.DocSearch-Hit-AskAIButton, .DocSearch-Hit--AskAI');
    if (askAiCta) {
      await moveAndClick(askAiCta, t);
    } else {
      modalRef.current?.openAskAi({ query: MODAL_AI_QUESTION });
    }
    await waitFor('.DocSearch-AskAiScreen', t, 3000);
    // Let the (mocked) answer stream in and be read.
    await sleep(6500, t);
    if (!alive(t)) return;

    // 6. Close the modal.
    await moveAndClick('.DocSearch-Close', t);
    await sleep(1100, t);
    if (!alive(t)) return;

    // 7. Open the side panel.
    await moveAndClick('.DocSearch-SidepanelButton', t);
    const sidepanelOpen = await waitFor('.DocSearch-Sidepanel-Container.is-open', t, 3000);
    if (!alive(t) || !sidepanelOpen) return;
    await sleep(900, t);

    // 8. Ask a question in the side panel.
    const prompt = await waitFor('.DocSearch-Sidepanel-Prompt--textarea', t, 2000);
    if (prompt && alive(t)) {
      await moveCursorTo(prompt, t);
      await typeInto(prompt, SIDEPANEL_QUESTION, t);
      await sleep(400, t);
      await moveAndClick('.DocSearch-Sidepanel-Prompt--submit', t);
      await sleep(7000, t);
    }
    if (!alive(t)) return;

    // 9. Close and breathe before looping.
    await moveAndClick('.DocSearch-Sidepanel-Action-close', t);
    sidepanelRef.current?.close();
    await sleep(2200, t);
  }

  async function loop(t) {
    running = true;
    while (alive(t)) {
      try {
        await scenario(t);
      } catch {
        // A step failed (e.g. an element didn't appear). Reset and retry the
        // whole tour after a short pause rather than getting stuck.
        reset();
        await sleep(1500, t);
      }
    }
    running = false;
    reset();
  }

  function startRun() {
    if (!enabled || !visible || userActive) return;
    if (running) return;
    const t = newToken();
    loop(t);
  }

  // --- user takeover -----------------------------------------------------
  function onUserActivity(event) {
    if (!event.isTrusted) return; // ignore our own synthetic events
    userActive = true;
    running = false;
    token.cancelled = true;
    hideCursor();
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      userActive = false;
      idleTimer = null;
      startRun();
    }, RESUME_AFTER_IDLE_MS);
  }

  const activityEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

  // --- public API --------------------------------------------------------
  function start() {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || window.innerWidth < MIN_AUTOPLAY_WIDTH) {
      enabled = false;
    }
    activityEvents.forEach((name) =>
      document.addEventListener(name, onUserActivity, { capture: true, passive: true }),
    );
  }

  function stop() {
    token.cancelled = true;
    running = false;
    if (idleTimer) clearTimeout(idleTimer);
    activityEvents.forEach((name) => document.removeEventListener(name, onUserActivity, { capture: true }));
    if (cursorEl && cursorEl.isConnected) cursorEl.remove();
    cursorEl = null;
  }

  function setVisible(next) {
    if (visible === next) return;
    visible = next;
    if (visible) {
      startRun();
    } else {
      token.cancelled = true;
      running = false;
      reset();
    }
  }

  const isAutopilotActive = () => running && visible && !userActive && enabled;

  return { start, stop, setVisible, isAutopilotActive };
}
