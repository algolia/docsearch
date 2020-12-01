import { Hero, Text, Pill, LabelText } from '@algolia/ui-library';
import Card from '@algolia/ui-library/public/components/Card';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useThemeContext from '@theme/hooks/useThemeContext';
import Layout from '@theme/Layout';
import algoliasearch from 'algoliasearch';
import queryString from 'query-string';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import { DocSearchLogo } from '../components/DocSearchLogo';

function Inspector() {
  const { siteConfig } = useDocusaurusContext();
  const theme = useThemeContext.isDarkTheme ? 'dark' : 'light';

  const DEFAULT_INDEX_NAME = siteConfig.themeConfig.algolia.indexName;

  const { indexName = DEFAULT_INDEX_NAME } = queryString.parse(
    useLocation().search
  );
  const [record, setIndexRecord] = useState(null);
  const [objectID, setObjectID] = useState(null);

  const searchClient = algoliasearch(
    'BH4D9OD16A',
    '2b64d7d554f4bea7e9f7fa5c0ae39948'
  );
  const index = searchClient.initIndex(indexName);

  useEffect(() => {
    if (objectID) {
      index.getObjects([objectID], {}).then(({ results }) => {
        setIndexRecord(results[0]);
      });
    }
  }, [index, objectID]);

  return (
    <>
      <Hero
        background="orbInside"
        title="Inspect your DocSearch index"
        padding="small"
      />
      <Card
        background={theme}
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DocSearchLogo width="190px" />
          <img
            className="ds-icon-heart"
            src={useBaseUrl('/img/icons/icon-heart.png')}
            width="30px"
          />
          <Pill>{indexName}</Pill>
        </div>
        <LabelText>Object:ID</LabelText>
        <br />
        <input
          type="text"
          style={{ margin: '3em 0', height: '2em', width: '80%' }}
          onChange={(e) => setObjectID(e.target.value)}
        />
        <br />
        {record ? <Record record={record}></Record> : null}
        {objectID && !record && (
          <Text>No record found for the ObjectID {objectID}</Text>
        )}
      </Card>
      <Card
        background={theme}
        className="m-auto mt-4"
        style={{ position: 'relative', maxWidth: '800px' }}
      >
        <LabelText>Instruction to select another index:</LabelText>
        <br />
        <br />
        <br />
        <Text>
          Just change the GET parameter indexName{' '}
          <a href="https://docsearch.algolia.com/inspector?indexName=<MyIndexName>">
            {'https://docsearch.algolia.com/inspector?indexName=<MyIndexName>'}
          </a>
        </Text>
      </Card>
    </>
  );
}

function InspectorPage() {
  return (
    <Layout
      title="DocSearch Inspector"
      description="Try out the search for your DocSearch project"
    >
      <Inspector />
    </Layout>
  );
}

function Record(props) {
  const record = props.record;
  return (
    <>
      <LabelText>One record found: </LabelText>

      <Text>
        URL is <a href={record.url}>{record.url}</a>
      </Text>

      <Text style={{ marginTop: '1.5rem' }}>
        lvl0 : {record.hierarchy.lvl0}
      </Text>
      <Text style={{ marginTop: '1.5rem' }}>
        lvl1 : {record.hierarchy.lvl1}
      </Text>
      <Text style={{ marginTop: '1.5rem' }}>
        lvl2 : {record.hierarchy.lvl2}
      </Text>
      <Text style={{ marginTop: '1.5rem' }}>
        lvl3 : {record.hierarchy.lvl3}
      </Text>
      <Text style={{ marginTop: '1.5rem' }}>
        lvl4 : {record.hierarchy.lvl4}
      </Text>
      <Text style={{ marginTop: '1.5rem' }}>
        lvl5 : {record.hierarchy.lvl5}
      </Text>
      <Text style={{ marginTop: '1.5rem' }}>
        lvl6 : {record.hierarchy.lvl0}
      </Text>
      {record.content ? (
        <Text>Content is {record.content} </Text>
      ) : (
        <Text> This record has no content (matching the Text selector)</Text>
      )}
    </>
  );
}

export default InspectorPage;
