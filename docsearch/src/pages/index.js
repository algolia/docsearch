/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { LightCta, Section, SectionTitle, Button, Text, TextBlock, Hero, LabelText, Input, SectionHeader, SmallText, NumberedList, Card, CardsRow } from '@algolia/ui-library';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';
import styles from './styles.module.css';
import bg from '../../static/img/bg-docsearch.svg';

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title="DocSearch: Search made for documentation"
      description="The easiest way to add search to your documentation - Powered by Algolia">
      <Hero
      title={<img src="img/docsearch-logo.svg" alt="DocSearch"/>}
      subtitle= {siteConfig.tagline}
      cta={[
        <Button primary tag="a" href={withBaseUrl('docs/what-is-docsearch')}>
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

    <Section background="white">
      <SectionHeader title='Providing Search for 1500+ docs, and counting'>
      </SectionHeader>
      <div className="row">
        <div className="col col--1">
          <img style={{ height: '50px' }} src="img/logos/bootstrap.jpg" />
        </div>
        <div className="col col--1">
          <img style={{ height: '50px' }} src="img/logos/babel.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/graphql.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/jest.png" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/react.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/webpack.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/gatsby.png" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/brew.png" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50%' }} src="img/logos/jquery.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/netlify.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/vue.jpg" />
        </div>
        <div className="col col--1">
        <img style={{ height: '50px' }} src="img/logos/yarn.jpg" />
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
      <NumberedList columns={3}>
      <TextBlock title="We scrap your documentation"  label='Scraping'>
        <Text small>We built a website crawler designed to index every section of your documentation.</Text>
        <Text small>Just send us the URL of your documentation, and we’ll run the scraper every 24h so you’re always up-to-date.</Text>
      </TextBlock>
      <TextBlock title="We configure your search"  label='Configuration'>
        <Text small>You don’t need to configure any settings or even have an Algolia account.</Text>
        <Text small>We take care of this automatically to ensure the best documentation search experience.</Text>
      </TextBlock>
      <TextBlock title="You add docsearch.js to your docs"  label='Implementation'>
        <Text small>We'll send you a script that integrates Algolia's autocomplete to power your search.</Text>
        <Text small>You will receive the same speed, relevance, and best-in-class UX as our paying customers.</Text>
      </TextBlock>
      </NumberedList>
    </Section>

<Section>
  <SectionHeader title='Try it Live'>
    <Text>We helped integrate DocSearch into several open source projects. Have a look.</Text>
  </SectionHeader>

  <CardsRow>
    <Card image='img/demos/example-bootstrap.gif'>
      <LightCta withArrow>
        <img style={{ height: '30px', verticalAlign: 'middle', marginRight: '12px', marginTop: '-2px' }} src="img/logos/bootstrap.jpg" />
        Visit Bootstrap
      </LightCta>
    </Card>
    <Card image='img/demos/example-vuejs.gif'>
      <img style={{ height: '30px', verticalAlign: 'middle', marginRight: '12px', marginTop: '-2px' }} src="img/logos/vue.jpg" />
      <LightCta withArrow>Visit Vue</LightCta>
    </Card>
    <Card image='img/demos/example-react.gif'>
    <img style={{ height: '30px', verticalAlign: 'middle', marginRight: '12px', marginTop: '-2px' }} src="img/logos/react.jpg" />
      <LightCta withArrow>Visit React</LightCta>
    </Card>
    <Card image='img/demos/example-momentjs.gif'>
      <img style={{ height: '30px', verticalAlign: 'middle', marginRight: '12px', marginTop: '-2px' }} src="img/logos/momentjs.jpg" />
      <LightCta withArrow>Visit Momenjs</LightCta>
    </Card>
  </CardsRow>

</Section>


    <Section>
      <div className="row">
        <div className="col col--6 col--offset-3">
          <form className="shadow--md uil-bgc-white" method="POST" action="https://www.algolia.com/docsearch/join">
            <div className="uil-pv-32 uil-ph-32 uil-bdr-6">
              <SectionTitle>Join the Program</SectionTitle>
              <br/>
              <LabelText tag="label" htmlFor="url">
                Documentation URL
                <Input id="url" name="url" placeholder="https://project.org/docs" backgroundColor="white" type="url" required />
              </LabelText>
              <Text small className="uil-pv-8 uil-mb-16" tag="div">We'll crawl pages at this address and index the content on Algolia.</Text>
              <LabelText tag="label" htmlFor="Email">
                Email
              </LabelText>
              <Input id="email" name="email" placeholder="you@project.org" backgroundColor="white" type="email" required />
              <Text small className="uil-pv-8" tag="div">We'll send you the JavaScript snippet you'll have to integrate into your documentation.</Text>
            </div>
            <div className="uil-mb-16 uil-ph-32 uil-bdtw-1 uil-bdc-proton uil-bgc-moon uil-bdts-solid uil-pv-32 uil-ta-center">
              <LabelText tag="label" htmlFor="owner">
                <input id="owner" name="owner" type="checkbox" required=""/>
                I'm the <span class="bold inline">owner</span> of the website and I've <a href="./who-can-apply.html">read the checklist</a>
              </LabelText>
              <br/><br/>
              <Button className="uil-mh-48 uil-d-block" type="submit" primary>Apply to DocSearch</Button>
              <br/><br/><br/>
              <Text small>
                Refer to <a href="https://www.algolia.com/policies/terms">Algolia's Privacy Policy</a> for<br/>more information on how we use and protect your data
              </Text>
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col col--6 col--offset-3">
          <div className="shadow--md uil-bgc-white uil-pv-32 uil-ph-32">
            <TextBlock title="Thank you!">
              <Text small>Your request will be processed by our team.</Text>
              <Text small>We'll get back to you on <span class="custom-placeholder-email">your email</span> with the snippet of JavaScript you'll need to integrate into <span class="custom-placeholder-url">your website</span>.</Text>
              <Text small>Please be patient, it can take a few days.</Text>
            </TextBlock>
          </div>
        </div>
      </div>
    </Section>

    </Layout>
  );
}

export default Home;
