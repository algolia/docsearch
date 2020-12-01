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
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import algoliasearch from 'algoliasearch/lite';
import github from 'prism-react-renderer/themes/github';
import vsDark from 'prism-react-renderer/themes/vsDark';
import queryString from 'query-string';
import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { useLocation } from 'react-router';

import DocSearch from '../components/DocSearch';
import ErrorBoundary from '../components/ErrorBoundary';

function Landing() {
  const theme = useThemeContext.isDarkTheme ? 'dark' : 'light';

  const {
    appId: appIdQS = 'BH4D9OD16A',
    indexName: indexNameQS = '',
    apiKey: apiKeyQS = '',
  } = queryString.parse(useLocation().search);

  const [isValidDSCred, setisValidDSCred] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [appId, setAppId] = useState(appIdQS);
  const [indexName, setIndexName] = useState(indexNameQS);
  const [apiKey, setApiKey] = useState(apiKeyQS);

  const fallbackToDocSearchDocCred = () => {
    setisValidDSCred(false);
    setAppId('BH4D9OD16A');
    setIndexName('docsearch');
    setApiKey('25626fae796133dc1e734c6bcaaeac3c');
  };

  useEffect(() => {
    // Credential not provided
    if (!indexName && !apiKey) {
      fallbackToDocSearchDocCred();
      return;
    }
    if ((!indexName && !apiKey) || apiKey.length !== 32) {
      setWrongCredentials(true);
      fallbackToDocSearchDocCred();
      return;
    }
    const searchClient = algoliasearch(appId, apiKey);
    const index = searchClient.initIndex(indexName);
    index
      .search('')
      .then((_) => setisValidDSCred(true))
      .catch((_) => {
        setWrongCredentials(true);
        fallbackToDocSearchDocCred();
      });
  }, [appId, indexName, apiKey]);

  return (
    <>
      <Hero background="orbInside" title="Integrate it!" padding="small" />
      <Card
        background={theme}
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px' }}
      >
        <Text>
          Try it out with the index: <Pill>{`${indexName}`}</Pill>
        </Text>
        <ErrorBoundary>
          {isValidDSCred && (
            <DocSearch appId={appId} indexName={indexName} apiKey={apiKey} />
          )}
          {wrongCredentials && (
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
          We ha've successfully configured the underlying crawler and it will
          now run every 24h.
          <br />
          You're now a few steps away from having it working on your website:
        </Text>
        <Text className="mt-4">Include a search input:</Text>
        <LiveProvider
          code={`<input type="text" id="q" placeholder="Search the doc" />`}
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
<script type="text/javascript"> docsearch({
    apiKey: '${apiKey}',
    indexName: '${indexName}',
    inputSelector: '#q', // CSS selector to target <input/>
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
            href={`https://github.com/algolia/docsearch-configs/blob/master/configs/${indexName}.json`}
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
