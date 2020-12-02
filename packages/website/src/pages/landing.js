import {
  Button,
  Hero,
  Text,
  Pill,
  LabelText,
  InlineLink,
} from '@algolia/ui-library';
import Card from '@algolia/ui-library/public/components/Card';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import algoliasearch from 'algoliasearch/lite';
import github from 'prism-react-renderer/themes/github';
import vsDark from 'prism-react-renderer/themes/vsDark';
import queryString from 'query-string';
import React, { useState, useEffect, useMemo } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useLocation } from 'react-router';

import DocSearch from '../components/DocSearch';
import ErrorBoundary from '../components/ErrorBoundary';

function Landing() {
  const { siteConfig } = useDocusaurusContext();
  const { isDarkTheme } = useThemeContext();
  const location = useLocation();
  const theme = isDarkTheme ? 'dark' : 'light';

  const DEFAULT_APP_ID = siteConfig.themeConfig.algolia.appId;
  const DEFAULT_API_KEY = siteConfig.themeConfig.algolia.apiKey;
  const DEFAULT_INDEX_NAME = siteConfig.themeConfig.algolia.indexName;

  const initialCredentials = useMemo(
    () => ({
      appId: DEFAULT_APP_ID,
      apiKey: DEFAULT_API_KEY,
      indexName: DEFAULT_INDEX_NAME,
    }),
    [DEFAULT_APP_ID, DEFAULT_API_KEY, DEFAULT_INDEX_NAME]
  );
  const [credentials, setCredentials] = useState(() => {
    return {
      ...initialCredentials,
      ...queryString.parse(location.search),
    };
  });
  const [areCredentialsValid, setAreCredentialsValid] = useState(true);

  useEffect(() => {
    if (!credentials.indexName || !credentials.apiKey) {
      setAreCredentialsValid(false);
      return;
    }

    const searchClient = algoliasearch(credentials.appId, credentials.apiKey);
    const index = searchClient.initIndex(credentials.indexName);

    index
      .search('')
      .then((_) => {
        setAreCredentialsValid(true);
      })
      .catch((_) => {
        setAreCredentialsValid(false);
      });
  }, [credentials.appId, credentials.apiKey, credentials.indexName]);

  useEffect(() => {
    if (!areCredentialsValid) {
      setCredentials(initialCredentials);
    }
  }, [areCredentialsValid, initialCredentials]);

  return (
    <>
      <Hero background="orbInside" title="Integrate it!" padding="small" />
      <Card
        background={theme}
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px' }}
      >
        <Text>
          Try it out with the index: <Pill>{credentials.indexName}</Pill>
        </Text>
        <ErrorBoundary>
          {areCredentialsValid ? (
            <DocSearch
              appId={credentials.appId}
              apiKey={credentials.apiKey}
              indexName={credentials.indexName}
            />
          ) : (
            <Text color="mars-0">
              The credentials provided from the URL were wrong, we will demo the
              search with the search of our documentation instead.
            </Text>
          )}
        </ErrorBoundary>
      </Card>
      <Card
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px', marginTop: '2em' }}
        background={theme}
      >
        <LabelText big>Instructions:</LabelText>

        <Text className="mt-4">
          We have successfully configured the underlying crawler and it will now
          run every 24 hours.
        </Text>
        <Text>
          You're now a few steps away from having it working on your website:
        </Text>
        <Text className="mt-4">Include a search input:</Text>
        <LiveProvider
          code={`<input type="text" id="q" placeholder="Search docs" />`}
          language="html"
          noInline={true}
          transformCode={(_code) =>
            `class Null extends React.Component {render(){return null}}`
          }
          theme={theme === 'dark' ? vsDark : github}
        >
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>

        <Text className="mt-4">Include these assets:</Text>

        <LiveProvider
          code={`<!-- at the end of the HEAD -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" />

<!-- at the end of the BODY -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script type="text/javascript">
  docsearch({
    apiKey: '${credentials.apiKey}',
    indexName: '${credentials.indexName}',
    inputSelector: '#q', // CSS selector to target the <input/>
    debug: false // Set to true if you want to inspect the dropdown
  });
</script>`}
          language="html"
          noInline={true}
          transformCode={(_code) =>
            `class Null extends React.Component {render(){return null}}`
          }
          theme={theme === 'dark' ? vsDark : github}
        >
          <LiveEditor />
          <LiveError />
          <LivePreview />
        </LiveProvider>
        <Text>
          Need to change something?
          <InlineLink
            style={{
              textDecoration: 'none',
              alignItems: 'center',
              paddingLeft: '1em',
            }}
            href={`https://github.com/algolia/docsearch-configs/blob/master/configs/${credentials.indexName}.json`}
          >
            Please submit a PR on your configuration
          </InlineLink>
        </Text>

        <Text>
          <LabelText big>Want another website?</LabelText>
        </Text>

        <div className="jc-center fxd-column d-flex my-4">
          <Button
            primary
            style={{ textDecoration: 'none', alignItems: 'center' }}
            href={useBaseUrl('/apply')}
          >
            Join the Program
          </Button>
        </div>
      </Card>
    </>
  );
}

function LandingPage() {
  return (
    <Layout
      title="DocSearch Landing"
      description="Try out the search for your DocSearch project"
    >
      <Landing />
    </Layout>
  );
}

export default LandingPage;
