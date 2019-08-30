/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Section, SectionTitle, Button, Text, TextBlock, Hero, LabelText, Input, SectionHeader } from '@algolia/ui-library';
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
      <Hero
      background="curves"
      title={<img src="img/docsearch-logo.svg" alt="DocSearch"/>}
      subtitle= {siteConfig.tagline}
      cta={[
        <Button primary to={withBaseUrl('docs/what-is-docsearch')}>
          Join the Program
        </Button>,
      ]}
    />
    <Section>
      <SectionHeader title='State-of-the-art search for technical documentation'>
        <Text>We're kind of scratching our own itch here. As developers, we spend
        a lot of time reading documentation, and it isn’t always easy to find the
        information we need.</Text>
        <Text>No one's to blame, building a good search is a complex challenge.
        We just happen to have a lot of experience doing that, and we want to
        share it with the developer community.</Text>
      </SectionHeader>
      <div className="demo-content-wrapper">
        <div class="demo-header-wrapper">
          <div class="docsearch-live-demo-input-wrapper">
          </div>
        </div>
      </div>
    </Section>

    <Section>
      <SectionHeader title='Learn-as-you-type experience'>
        <Text>Documentation speaks to your users. Ideally, this conversation will
        be pleasant and efficient. Everyone visiting your documentation page
        has a different need: Some are exploring your product, some are
        trying to get started, and some are stuck and need help.</Text>
        <Text>DocSearch is designed to provide relevant search results at every
        level. Its structured layout give the users more context to understand
        the product.</Text>
      </SectionHeader>
      <img src="img/docsearch-UI-anatomy.png" alt="Anatomy of DocSearch UI"/>
    </Section>

    <Section>
      <div className="row">
        <div className="col col--4 col--offset-1">
          <img src="img/illus-analytics.svg" alt="DocSearch Analytics" width="400"/>
        </div>
        <div className="col col--5 uil-pt-48 uil-mt-32">
          <SectionTitle>Powerful Analytics with Algolia</SectionTitle>
          <Text>Follow your users' search behavior to get invaluable insights into
          what they are doing and to improve their experience - and to help
          them learn more about your product.</Text>
          <Text>Use metrics such as Popular Queries, No Results, and Click Position
          to better optimize your content.</Text>
        </div>
      </div>
    </Section>

    <Section>
      <SectionHeader title='How it works'></SectionHeader>
      <div className="row">
        <div className="col col--4">
          <img src="img/illus1.png"/>
          <TextBlock title="We scrap your documentation"  label='1 - Scraping'>
            <Text small>We built a website crawler designed to index every section of your documentation.</Text>
            <Text small>Just send us the URL of your documentation, and we’ll run the scraper every 24h so you’re always up-to-date.</Text>
          </TextBlock>
        </div>
        <div className="col col--4">
          <img src="img/illus2.png"/>
          <TextBlock title="We configure your search"  label='2 - Configuration'>
            <Text small>You don’t need to configure any settings or even have an Algolia account.</Text>
            <Text small>We take care of this automatically to ensure the best documentation search experience.</Text>
          </TextBlock>
        </div>
        <div className="col col--4">
          <img src="img/illus3.png"/>
          <TextBlock title="You add docsearch.js to your docs"  label='3 - Implementation'>
            <Text small>We'll send you a script that integrates Algolia's autocomplete to power your search.</Text>
            <Text small>You will receive the same speed, relevance, and best-in-class UX as our paying customers.</Text>
          </TextBlock>
        </div>
      </div>
    </Section>

    <Section>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <form className="shadow--md uil-p-48" method="POST" action="https://www.algolia.com/docsearch/join">

            <LabelText tag="label" htmlFor="url">
              Documentation URL
              <Input id="url" name="url" placeholder="https://project.org/docs" backgroundColor="white" type="url" required />
            </LabelText>
            <Text small>We'll crawl pages at this address and index the content on Algolia.</Text>

            <LabelText tag="label" htmlFor="Email">
              Email
            </LabelText>
            <Input id="email" name="email" placeholder="you@project.org" backgroundColor="white" type="email" required />
            <Text small>We'll send you the JavaScript snippet you'll have to integrate into your documentation.</Text>

            <LabelText tag="label" htmlFor="owner">
              <input name="owner" type="checkbox" required=""/>
              I'm the <span class="bold inline">owner</span> of the website and I <a href="./who-can-apply.html">read the checklist</a> before applying.
            </LabelText>

            <Button className="uil-m-48" type="submit" primary>Apply to DocSearch</Button>

            <Text small>
              Refer to <a href="https://www.algolia.com/policies/terms">Algolia's Privacy Policy</a> for more information on how we use and protect your data
            </Text>

            <div class="poppins text-4 mb-2">Thank you!</div>
            <p class="text-2 leading-2 mb-1">Your request will be processed by our team. </p>
            <p class="text-2 leading-2 mb-1">
              We'll get back to you on <span class="custom-placeholder-email inline text-nebula">your email</span> with the snippet of JavaScript you'll need to integrate into <span class="custom-placeholder-url inline text-nebula">your website</span>.
            </p>
            <p class="text-2 leading-2"> Please be patient, it can take a few days.</p>

          </form>
        </div>
      </div>
    </Section>

    </Layout>
  );
}

export default Home;
