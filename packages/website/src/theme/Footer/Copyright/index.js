import { CookieSettingsButton } from '@site/src/components/CookieSettingsButton';
import React from 'react';

export default function FooterCopyright({ copyright }) {
  return (
    <div className="footer__copyright footer__copyright--with-cookie-settings">
      {copyright ? <div dangerouslySetInnerHTML={{ __html: copyright }} /> : null}
      <CookieSettingsButton />
    </div>
  );
}
