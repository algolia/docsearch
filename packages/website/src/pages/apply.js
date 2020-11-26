import React from 'react';
import Layout from '@theme/Layout';
import { Section, Hero } from '@algolia/ui-library';
import ApplyForm from '../components/ApplyForm.js';
import { DocSearchLogo } from '../components/DocSearchLogo';
import useThemeContext from '@theme/hooks/useThemeContext';

function Apply() {
  const theme = useThemeContext.isDarkTheme ? 'dark' : 'light';

  return (
    <>
      <Hero background="curves" title={<DocSearchLogo width="50%" />} />
      <Section>
        <ApplyForm theme={theme} />
      </Section>
    </>
  );
}

function ApplyPage() {
  return (
    <Layout
      title="DocSearch: Search made for documentation"
      description="The easiest way to add search to your documentation - Powered by Algolia"
    >
      <Apply />
    </Layout>
  );
}

export default ApplyPage;
