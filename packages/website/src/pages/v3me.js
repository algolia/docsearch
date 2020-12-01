import {
  Button,
  Hero,
  Text,
  Pill,
  LabelText,
  InlineLink,
} from '@algolia/ui-library';
import Card from '@algolia/ui-library/public/components/Card';
import { DocSearchModal } from '@docsearch/react';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import algoliasearch from 'algoliasearch/lite';
import queryString from 'query-string';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import ErrorBoundary from '../components/ErrorBoundary';

function V3Me() {
  const { withBaseUrl } = useBaseUrlUtils();
  const theme = useThemeContext.isDarkTheme ? 'dark' : 'light';

  const getParams = queryString.parse(useLocation().search);
  const {
    appId: appIdQS = 'BH4D9OD16A',
    indexName: indexNameQS = '',
    apiKey: apiKeyQS = '',
  } = getParams;

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

  const searchParameters = { hitsPerPage: 10 };
  for (const [name, value] of Object.entries(getParams)) {
    if (name !== 'appId' && name !== 'indexName' && name !== 'apiKey') {
      const parsedInt = parseInt(value, 10);
      const parsedBool =
        // eslint-disable-next-line no-nested-ternary
        value === 'true' ? true : value === 'false' ? false : null;
      // eslint-disable-next-line no-nested-ternary
      searchParameters[name] = !isNaN(parsedInt)
        ? parsedInt
        : parsedBool
        ? parsedBool !== null
        : value;
    }
  }

  return (
    <>
      <Hero background="orbInside" title="V3Me" padding="small" />
      <Card
        background={theme}
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px' }}
      >
        <Text>
          Try it out the v3 WIP with the index: <Pill>{`${indexName}`}</Pill>
        </Text>
        <ErrorBoundary>
          {isValidDSCred && (
            <DocSearchModal
              appId={appId}
              apiKey={apiKey}
              indexName={indexName}
            />
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
        background={theme}
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px', marginTop: '2em' }}
      >
        <LabelText big>Instructions:</LabelText>
        <Text className="mt-4">
          You can try it out with your own <Pill>apiKey</Pill> and{' '}
          <Pill>indexName</Pill> by fetching the following URL:
        </Text>
        <Text className="mt-4">
          <a
            href={withBaseUrl('/v3me/?indexName=<indexName>&apiKey=<apiKey>')}
          >{`https://docsearch.algolia.com/v3me/?indexName=<indexName>&apiKey=<apiKey>&appId=<appId>`}</a>
        </Text>
        <Text className="mt-4">
          <Pill>appId</Pill> is optional.
        </Text>
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
            href={withBaseUrl('/apply')}
          >
            Join the Program
          </Button>
        </div>
      </Card>
    </>
  );
}

function V3MePage() {
  return (
    <Layout>
      <V3Me />
    </Layout>
  );
}

export default V3MePage;
