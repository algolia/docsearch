/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import {
  LightCta,
  Section,
  SectionTitle,
  Button,
  Text,
  TextBlock,
  Hero,
  LabelText,
  Input,
  SectionHeader,
  SmallText,
  NumberedList,
  Card,
  CardsRow
} from "@algolia/ui-library";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ApplyForm from "./applyComponent.js";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title="DocSearch: Search made for documentation"
      description="The easiest way to add search to your documentation - Powered by Algolia"
    >
      <Hero
        style={{ backgroundImage: "linear-gradient(#fff, #f5f5fa)" }}
        background="curves"
        title={
          <img src={useBaseUrl("img/docsearch-logo.svg")} alt="DocSearch" />
        }
        subtitle={siteConfig.tagline}
        cta={[
          <Button
            style={{ textDecoration: "none" }}
            primary
            tag="a"
            href={useBaseUrl("docs/what-is-docsearch")}
          >
            Join the Program
          </Button>
        ]}
      />

      <Section>
        <SectionHeader title="State-of-the-art search for technical documentation">
          <Text style={{ maxWidth: "800px" }}>
            We're kind of scratching our own itch here. As developers, we spend
            a lot of time reading documentation, and it isn’t always easy to
            find the information we need.
          </Text>
          <Text style={{ maxWidth: "800px" }}>
            No one's to blame, building a good search is a complex challenge. We
            just happen to have a lot of experience doing that, and we want to
            share it with the developer community.
          </Text>
        </SectionHeader>
        <div className="demo-content-wrapper">
          <div className="demo-header-wrapper">
            <div className="docsearch-live-demo-input-wrapper"></div>
          </div>
        </div>
      </Section>

      <Section background="white">
        <SectionHeader title="Providing Search for 1500+ docs, and counting"></SectionHeader>
        <div className="row">
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/bootstrap.jpg")}
            />
            <SmallText tag="p">Bootstrap</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/babel.jpg")}
            />
            <SmallText tag="p">Babel</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/graphql.jpg")}
            />
            <SmallText tag="p">Graphql</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/react.jpg")}
            />
            <SmallText tag="p">React</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/webpack.jpg")}
            />
            <SmallText tag="p">Webpack</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/gatsby.png")}
            />
            <SmallText tag="p">Gatsby</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/Netlify.svg")}
            />
            <SmallText tag="p">Netlify</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/vue.jpg")}
            />
            <SmallText tag="p">Vue</SmallText>
          </div>
          <div className="col text--center">
            <img
              style={{ height: "50px" }}
              src={useBaseUrl("img/logos/yarn.jpg")}
            />
            <SmallText tag="p">Yarn</SmallText>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="Learn-as-you-type experience">
          <Text style={{ maxWidth: "800px" }}>
            Documentation speaks to your users. Ideally, this conversation will
            be pleasant and efficient. Everyone visiting your documentation page
            has a different need: Some are exploring your product, some are
            trying to get started, and some are stuck and need help.
          </Text>
          <Text style={{ maxWidth: "800px" }}>
            DocSearch is designed to provide relevant search results at every
            level. Its structured layout give the users more context to
            understand the product.
          </Text>
        </SectionHeader>
        <img
          src={useBaseUrl("img/docsearch-UI-anatomy.png")}
          alt="Anatomy of DocSearch UI"
        />
      </Section>

      <Section className="bg-analytics">
        <div className="row">
          <div className="col col--4 col--offset-1">
            <img
              src={useBaseUrl("img/illus-analytics.svg")}
              alt="DocSearch Analytics"
              width="400"
            />
          </div>
          <div className="col col--5 uil-pt-48 uil-mt-32">
            <SectionTitle>Powerful Analytics with Algolia</SectionTitle>
            <Text>
              Follow your users' search behavior to get invaluable insights into
              what they are doing and to improve their experience - and to help
              them learn more about your product.
            </Text>
            <Text>
              Use metrics such as Popular Queries, No Results, and Click
              Position to better optimize your content.
            </Text>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader title="How it works"></SectionHeader>
        <NumberedList columns={3}>
          <TextBlock title="We scrap your documentation" label="Scraping">
            <Text>
              We built a website crawler designed to index every section of your
              documentation.
            </Text>
            <Text>
              Just send us the URL of your documentation, and we’ll run the
              scraper every 24h so you’re always up-to-date.
            </Text>
          </TextBlock>
          <TextBlock title="We configure your search" label="Configuration">
            <Text>
              You don’t need to configure any settings or even have an Algolia
              account.
            </Text>
            <Text>
              We take care of this automatically to ensure the best
              documentation search experience.
            </Text>
          </TextBlock>
          <TextBlock
            title="You add docsearch.js to your docs"
            label="Implementation"
          >
            <Text>
              We'll send you a script that integrates Algolia's autocomplete to
              power your search.
            </Text>
            <Text>
              You will receive the same speed, relevance, and best-in-class UX
              as our paying customers.
            </Text>
          </TextBlock>
        </NumberedList>
      </Section>

      <Section>
        <SectionHeader title="Try it live">
          <Text>
            We helped integrate DocSearch into several open source projects.
            Have a look.
          </Text>
        </SectionHeader>
        <CardsRow>
          <Card image="img/demos/example-bootstrap.gif">
            <LightCta
              withArrow
              href="http://getbootstrap.com/docs/4.1/getting-started/introduction/"
              target="_blank"
            >
              <img
                style={{
                  height: "30px",
                  verticalAlign: "middle",
                  marginRight: "12px",
                  marginTop: "-2px"
                }}
                src={useBaseUrl("img/logos/bootstrap.jpg")}
              />
              Visit Bootstrap
            </LightCta>
          </Card>
          <Card image="img/demos/example-vuejs.gif">
            <img
              style={{
                height: "30px",
                verticalAlign: "middle",
                marginRight: "12px",
                marginTop: "-2px"
              }}
              src={useBaseUrl("img/logos/vue.jpg")}
            />
            <LightCta
              withArrow
              href="https://vuejs.org/v2/guide/"
              target="_blank"
            >
              Visit Vue
            </LightCta>
          </Card>
          <Card image="img/demos/example-react.gif">
            <img
              style={{
                height: "30px",
                verticalAlign: "middle",
                marginRight: "12px",
                marginTop: "-2px"
              }}
              src={useBaseUrl("img/logos/react.jpg")}
            />
            <LightCta
              withArrow
              href="https://reactjs.org/docs/getting-started.html"
              target="_blank"
            >
              Visit React
            </LightCta>
          </Card>
          <Card image="img/demos/example-momentjs.gif">
            <img
              style={{
                height: "30px",
                verticalAlign: "middle",
                marginRight: "12px",
                marginTop: "-2px"
              }}
              src={useBaseUrl("img/logos/momentjs.jpg")}
            />
            <LightCta withArrow href="https://momentjs.com/" target="_blank">
              Visit Momenjs
            </LightCta>
          </Card>
        </CardsRow>
      </Section>

      <Section>
        <SectionHeader title="Join the DocSearch program">
          <Text>
            We’ll get back to you with everything you need to integrate your new
            search into your website.
          </Text>
          <Text>
            Oh, and did we mention it's FREE?
            <br />
            No commitment. No subscription. Everything is on us!
          </Text>
        </SectionHeader>
        <ApplyForm />
      </Section>
    </Layout>
  );
}

export default Home;
