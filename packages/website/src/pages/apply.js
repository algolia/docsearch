import { Section, Hero } from '@algolia/ui-library';
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import React from 'react';

import ApplyForm from '../components/ApplyForm.js';
import { DocSearchLogo } from '../components/DocSearchLogo';

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
