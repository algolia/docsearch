import React from "react";
import Layout from "@theme/Layout";
import { Section, Hero } from "@algolia/ui-library";
import ApplyForm from "../components/ApplyForm.js";
import useBaseUrl from "@docusaurus/useBaseUrl";

function Apply() {
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
      />
      <Section background="white">
        <ApplyForm />
      </Section>
    </Layout>
  );
}

export default Apply;
