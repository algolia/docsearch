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
  SectionHeader,
  SmallText,
  NumberedList,
  Card,
  CardsRow
} from "@algolia/ui-library";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import ApplyForm from "../components/ApplyForm.js";

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
            className={"td-none"}
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
      </Section>

      <Section background="white">
        <SectionHeader title="Providing search to your favorite projects"></SectionHeader>
        <div
          className="jc-between d-flex m-auto fx-wrap"
          style={{ maxWidth: "800px" }}
        >
          <div className="ta-center w-20p">
            <a
              href="https://getbootstrap.com/docs/4.1/getting-started/introduction/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/bootstrap.jpg")}
                alt={"Bootstrap logo"}
              />
              <SmallText tag="p">Bootstrap</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://babeljs.io/docs/en/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/babel.jpg")}
                alt={"Babel logo"}
              />
              <SmallText tag="p">Babel</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://graphql.org/learn/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/graphql.jpg")}
                alt={"Graphql logo"}
              />
              <SmallText tag="p">Graphql</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://www.typescriptlang.org/index.html"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/typescriptlang.svg")}
                alt={"TypeScript logo"}
              />
              <SmallText tag="p">TypeScript</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://reactjs.org/docs/getting-started.html"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/react.jpg")}
                alt={"React logo"}
              />
              <SmallText tag="p">React</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://requests.readthedocs.io/en/master/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/requests.png")}
                alt={"Requests logo"}
              />
              <SmallText tag="p">Requests</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://eslint.org/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/eslint.svg")}
                alt={"ESLint logo"}
              />
              <SmallText tag="p">ESLint</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://webpack.js.org/concepts/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/webpack.svg")}
                alt={"Webpack logo"}
              />
              <SmallText tag="p">Webpack</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://www.gatsbyjs.org/docs/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/gatsby.png")}
                alt={"Gatsby logo"}
              />
              <SmallText tag="p">Gatsby</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://docs.netlify.com/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/netlify.svg")}
                alt={"Netlify logo"}
              />
              <SmallText tag="p">Netlify</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://vuejs.org/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/vue.svg")}
                alt={"Vue logo"}
              />
              <SmallText tag="p">Vue</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://yarnpkg.com/lang/en/docs/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/yarn.jpg")}
                alt={"Yarn logo"}
              />
              <SmallText tag="p">Yarn</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://material-ui.com" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/material-ui.svg")}
                alt={"MATERIAL-UI logo"}
              />
              <SmallText tag="p">MATERIAL-UI</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://ant.design/index-cn"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/ant-design.svg")}
                alt={"Ant Design logo"}
              />
              <SmallText tag="p">Ant Design</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://facebook.github.io/react-native/docs/getting-started"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/react-native.svg")}
                alt={"React Native logo"}
              />
              <SmallText tag="p">React Native</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://api.jquery.com/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/jquery.jpg")}
                alt={"jQuery logo"}
              />
              <SmallText tag="p">jQuery</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://docs.gitlab.com/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/gitlab.svg")}
                alt={"GitLab logo"}
              />
              <SmallText tag="p">GitLab</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://brew.sh/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/homebrew.png")}
                alt={"Homebrew logo"}
              />
              <SmallText tag="p">Homebrew</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://momentjs.com/docs/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/momentjs.svg")}
                alt={"Moment.js logo"}
              />
              <SmallText tag="p">Moment.js</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://tailwindcss.com/docs/installation/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/tailwindcss.svg")}
                alt={"Tailwindcss logo"}
              />
              <SmallText tag="p">tailwindcss</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://bootstrap-vue.js.org/docs"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/bootstrap-vue.svg")}
                alt={"BootstrapVue logo"}
              />
              <SmallText tag="p">BootstrapVue</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://sass-lang.com/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/sass.png")}
                alt={"Sass logo"}
              />
              <SmallText tag="p">Sass</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://www.twilio.com/docs"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/twilio.png")}
                alt={"Twilio logo"}
              />
              <SmallText tag="p">Twilio</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://docusaurus.io/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/docusaurus.svg")}
                alt={"Docusaurus logo"}
              />
              <SmallText tag="p">Docusaurus</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://docs.gradle.org/current/userguide/userguide.html"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/gradle.png")}
                alt={"Gradle logo"}
              />
              <SmallText tag="p">Gradle</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://nuxtjs.org/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/nuxtjs.svg")}
                alt={"NUXTJS logo"}
              />
              <SmallText tag="p">NUXTJS</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://vuetifyjs.com/en/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/vuetify.png")}
                alt={"Vuetify.js logo"}
              />
              <SmallText tag="p">Vuetify.js</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://jekyllrb.com/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/jekyll.png")}
                alt={"Jekyll logo"}
              />
              <SmallText tag="p">Jekyll</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://pytorch.org/get-started/locally/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/pytorch.svg")}
                alt={"PyTorch logo"}
              />
              <SmallText tag="p">PyTorch</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://www.apollographql.com/docs/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/apollo.png")}
                alt={"Apollo logo"}
              />
              <SmallText tag="p">Apollo</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://docs.scala-lang.org/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/scala.svg")}
                alt={"Scala logo"}
              />
              <SmallText tag="p">Scala</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a
              href="https://laravel.com/docs/6.x"
              rel="noreferrer"
              target="_blank"
            >
              <img
                className="h-50"
                src={useBaseUrl("img/logos/laravel.svg")}
                alt={"Laravel logo"}
              />
              <SmallText tag="p">Laravel</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://socket.io/docs/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/socketio.svg")}
                alt={"Socket.io logo"}
              />
              <SmallText tag="p">socket.io</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href="https://jestjs.io/" rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/jest.png")}
                alt={"Jest logo"}
              />
              <SmallText tag="p">Jest</SmallText>
            </a>
          </div>
          <div className="ta-center w-20p">
            <a href={useBaseUrl("/apply")} rel="noreferrer" target="_blank">
              <img
                className="h-50"
                src={useBaseUrl("img/logos/three-dots.svg")}
                alt={"Your project logo?"}
              />
              <SmallText tag="p">You?</SmallText>
            </a>
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
          src={useBaseUrl("img/assets/docsearch-ui-anatomy.png")}
          alt="Anatomy of DocSearch UI"
        />
      </Section>

      <Section className="bg-analytics">
        <div className="row">
          <div className="col col--4 col--offset-1">
            <img
              src={useBaseUrl("img/assets/illus-analytics.svg")}
              alt="DocSearch Analytics"
              width="400"
            />
          </div>
          <div className="col col--5 pt-48 mt-32">
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
            We helped integrate DocSearch into several open source projects. Try
            it live.
          </Text>
        </SectionHeader>
        <CardsRow>
          <Card
            image="img/demos/example-bootstrap.gif"
            imageAlt="Bootstrap demo"
          >
            <LightCta
              withArrow
              href="https://getbootstrap.com/docs/4.3/getting-started/introduction/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                style={{
                  marginTop: "-2px",
                  marginRight: "12px"
                }}
                className={"h-30 va-middle"}
                src={useBaseUrl("img/logos/bootstrap.jpg")}
                alt={"Bootstrap logo"}
              />
              Visit Bootstrap
            </LightCta>
          </Card>
          <Card image="img/demos/example-vuejs.gif" imageAlt="Vue demo">
            <img
              style={{
                marginTop: "-2px",
                marginRight: "12px"
              }}
              className={"h-30 va-middle"}
              src={useBaseUrl("img/logos/vue.svg")}
              alt={"Vue logo"}
            />
            <LightCta
              withArrow
              href="https://vuejs.org/v2/guide/"
              rel="noreferrer"
              target="_blank"
            >
              Visit Vue.js
            </LightCta>
          </Card>
          <Card image="img/demos/example-react.gif" imageAlt="React demo">
            <img
              style={{
                marginTop: "-2px",
                marginRight: "12px"
              }}
              className={"h-30 va-middle"}
              src={useBaseUrl("img/logos/react.jpg")}
              alt={"React logo"}
            />
            <LightCta
              withArrow
              href="https://reactjs.org/docs/getting-started.html"
              rel="noreferrer"
              target="_blank"
            >
              Visit React
            </LightCta>
          </Card>
          <Card
            image="img/demos/example-momentjs.gif"
            imageAlt="Moment.js demo"
          >
            <img
              style={{
                marginTop: "-2px",
                marginRight: "12px"
              }}
              className={"h-30 va-middle"}
              src={useBaseUrl("img/logos/momentjs.svg")}
              alt={"Moment.js logo"}
            />
            <LightCta
              withArrow
              href="https://momentjs.com/docs/"
              rel="noreferrer"
              target="_blank"
            >
              Visit Moment.js
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
