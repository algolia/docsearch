/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title="DocSearch: Search made for documentation"
      description="The easiest way to add search to your documentation - Powered by Algolia">
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            <img src="img/docsearch-logo.svg"/>
          </h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <h1>Providing search for 1 500+ docs, and counting.</h1>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button-cta',
                styles.getStarted,
              )}
              to={withBaseUrl('docs/what-is-docsearch')}>
              Join the Program
            </Link>
          </div>
        </div>
      </header>
      <main>
      <div className="container">

        <section>
          <div className="row">
            <div className="col col--8  col--offset-2 text--center">
              <h2>State-of-the-art search for technical documentation</h2>
              <p>We're kind of scratching our own itch here. As developers, we spend a lot of time reading documentation, and it isn’t always easy to find the information we need.</p>
              <p>No one's to blame, building a good search is a complex challenge. We just happen to have a lot of experience doing that, and we want to share it with the developer community.</p>
            </div>
          </div>
          </section>

          <section>
            <div className="row">
              <div className="col col--8 col--offset-2 text--center">
                <h2>Learn-as-you-type experience</h2>
                <p>Documentation speaks to your users. Ideally, this conversation will
                be pleasant and efficient. Everyone visiting your documentation page
                has a different need: Some are exploring your product, some are
                trying to get started, and some are stuck and need help.
                </p>
                <p>DocSearch is designed to provide relevant search results at every
                level. Its structured layout give the users more context to understand
                the product.</p>
              </div>
            </div>
            <div className="row">
              <div className="col col--12 text--center">
                <img src="img/docsearch-UI-anatomy.png" alt="Anatomy of DocSearch UI"/>
              </div>
            </div>
          </section>

          <section>
            <div className="row">
              <div className="col col--4 col--offset-2">
                <img src="img/illus-analytics.svg" alt="DocSearch Analytics" width="400"/>
              </div>
              <div className="col col--4">
                <h2>Powerful Analytics with Algolia</h2>
                <p>Follow your users' search behavior to get invaluable insights into
                what they are doing and to improve their experience - and to help
                them learn more about your product.</p>
                <p>Use metrics such as Popular Queries, No Results, and Click Position
                to better optimize your content.</p>
              </div>
            </div>
          </section>

          <section>
            <h2> How it works</h2>
            <div className="row">
              <div className="col col--4">
                <img src="img/illus1.png"/>
                <h3>We crawl your documentation pages</h3>
                <p>We built a website crawler designed to index every section of yourdocumentation.<br/>
                Just send us the URL of your documentation, and we’ll run the crawler every 24h so you’re always up-to-date.</p>
              </div>
              <div className="col col--4">
                <img src="img/illus2.png"/>
                <h3>We configure your search experience</h3>
                <p>You don’t need to configure any settings or even have an Algolia account.<br/>
                We take care of this automatically to ensure the best documentation search experience.</p>
              </div>
              <div className="col col--4">
                <img src="img/illus3.png"/>
                <h3>You add the search autocomplete to your UI</h3>
                <p>We'll send you a script that integrates Algolia's autocomplete to power your search.<br/>
                You will receive the same speed, relevance, and best-in-class UX as our paying customers.</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </Layout>
  );
}

export default Home;
