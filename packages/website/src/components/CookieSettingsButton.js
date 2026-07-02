import React from 'react';

const ONE_TRUST_POLL_INTERVAL_MS = 100;
const ONE_TRUST_POLL_TIMEOUT_MS = 10_000;

function isOneTrustLoaded() {
  return typeof window !== 'undefined' && (window.OneTrust !== undefined || window.Optanon !== undefined);
}

function useOneTrustAvailable() {
  const [isAvailable, setIsAvailable] = React.useState(false);

  React.useEffect(() => {
    if (isOneTrustLoaded()) {
      setIsAvailable(true);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (isOneTrustLoaded()) {
        setIsAvailable(true);
        window.clearInterval(intervalId);
      }
    }, ONE_TRUST_POLL_INTERVAL_MS);

    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
    }, ONE_TRUST_POLL_TIMEOUT_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return isAvailable;
}

export function CookieSettingsButton() {
  const isOneTrustAvailable = useOneTrustAvailable();

  if (!isOneTrustAvailable) {
    return null;
  }

  return (
    <button type="button" id="ot-sdk-btn" className="ot-sdk-show-settings">
      Cookie settings
    </button>
  );
}
