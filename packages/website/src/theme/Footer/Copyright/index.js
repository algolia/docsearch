import { CookieSettingsButton } from '@site/src/components/CookieSettingsButton';
import React from 'react';

export default function FooterCopyright({ copyright }) {
  if (!copyright) {
    return (
      <div className="footer__copyright footer__copyright--with-cookie-settings">
        <CookieSettingsButton />
      </div>
    );
  }

  return (
    <div className="footer__copyright footer__copyright--with-cookie-settings">
      <div dangerouslySetInnerHTML={{ __html: copyright }} />
      <CookieSettingsButton />
    </div>
  );
}
