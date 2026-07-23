import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Home } from 'iconoir-react';
import React from 'react';

import styles from './styles.module.css';

export default function HomeBreadcrumbItem() {
  const homeHref = useBaseUrl('/');

  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className={`breadcrumbs__link ${styles.breadcrumbHomeLink}`}
        href={homeHref}
      >
        <Home
          className={styles.breadcrumbHomeIcon}
          width={18}
          height={18}
          aria-hidden={true}
        />
      </Link>
    </li>
  );
}
