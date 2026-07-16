/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import Head from '@docusaurus/Head';
import { HtmlClassNameProvider, usePluralForm } from '@docusaurus/theme-common';
import Translate, { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { type ReactNode } from 'react';

import { useAlgoliaThemeConfig } from '../../client';

import { ActiveRefinements } from './components/ActiveRefinements';
import { PoweredByAlgolia } from './components/PoweredByAlgolia';
import { SearchEmptyState } from './components/SearchEmptyState';
import { SearchFacets } from './components/SearchFacets';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import { SearchResultsSkeleton } from './components/SearchResultsSkeleton';
import { TOP_SECTIONS_FACET } from './constants';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useSearchPage } from './hooks/useSearchPage';
import { useTopSections } from './hooks/useTopSections';
import styles from './styles.module.css';
import type { SearchResultItem } from './types';

// Very simple pluralization: probably good enough for now
function useDocumentsFoundPlural(): (count: number) => string {
  const { selectMessage } = usePluralForm();
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.SearchPage.documentsFound.plurals',
          description:
            'Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One document found|{count} documents found',
        },
        { count }
      )
    );
}

function getSearchPageTitle(searchQuery: string | undefined): string {
  return searchQuery
    ? translate(
        {
          id: 'theme.SearchPage.existingResultsTitle',
          message: 'Search results for "{query}"',
          description: 'The search page title for non-empty query',
        },
        {
          query: searchQuery,
        }
      )
    : translate({
        id: 'theme.SearchPage.emptyResultsTitle',
        message: 'Search the documentation',
        description: 'The search page title for empty query',
      });
}

function SearchPageContent(): ReactNode {
  const {
    searchQuery,
    setSearchQuery,
    items,
    totalResults,
    loading,
    loadingMore,
    error,
    hasMore,
    facets,
    refinements,
    toggleRefinement,
    clearRefinements,
    hasActiveRefinements,
    loadMore,
    sendResultClick,
    versionHelpers,
  } = useSearchPage();
  const { contextualSearch } = useAlgoliaThemeConfig();
  const documentsFoundPlural = useDocumentsFoundPlural();
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();
  const topSections = useTopSections();

  const pageTitle = getSearchPageTitle(searchQuery);
  const showVersionSelects =
    contextualSearch && versionHelpers.versioningEnabled;
  const hasSidebar = showVersionSelects || facets.length > 0;
  const isSearching = Boolean(searchQuery) || hasActiveRefinements;

  const handleSelectResult = (
    item: SearchResultItem,
    position: number
  ): void => {
    sendResultClick(item, position);
    if (searchQuery) {
      addRecentSearch(searchQuery);
    }
  };

  function renderMainContent(): ReactNode {
    if (!isSearching) {
      return (
        <SearchEmptyState
          recentSearches={recentSearches}
          topSections={topSections}
          onSelectRecent={setSearchQuery}
          onRemoveRecent={removeRecentSearch}
          onClearRecent={clearRecentSearches}
          onSelectSection={(section) =>
            toggleRefinement(TOP_SECTIONS_FACET, section)
          }
        />
      );
    }

    if (error) {
      return (
        <div className={styles.stateMessage}>
          <Translate
            id="theme.SearchPage.errorText"
            description="The paragraph shown when the search request fails"
          >
            Something went wrong while searching. Please try again.
          </Translate>
        </div>
      );
    }

    if (loading && items.length === 0) {
      return <SearchResultsSkeleton />;
    }

    if (items.length > 0) {
      return (
        <>
          <SearchResults items={items} onSelect={handleSelectResult} />
          {hasMore && (
            <div className={styles.loadMoreWrapper}>
              <button
                type="button"
                className={clsx(
                  'button',
                  'button--secondary',
                  'button--lg',
                  styles.loadMoreButton
                )}
                disabled={loadingMore}
                onClick={loadMore}
              >
                {loadingMore ? (
                  <Translate
                    id="theme.SearchPage.fetchingNewResults"
                    description="The label for the load-more button while fetching new results"
                  >
                    Fetching new results...
                  </Translate>
                ) : (
                  <Translate
                    id="theme.SearchPage.loadMore"
                    description="The label for the button that loads more search results"
                  >
                    Load more results
                  </Translate>
                )}
              </button>
            </div>
          )}
        </>
      );
    }

    return (
      <div className={styles.stateMessage}>
        <p>
          <Translate
            id="theme.SearchPage.noResultsText"
            description="The paragraph for empty search result"
          >
            No results were found
          </Translate>
        </p>
        {hasActiveRefinements && (
          <button
            type="button"
            className={clsx('button', 'button--secondary')}
            onClick={clearRefinements}
          >
            <Translate
              id="theme.SearchPage.clearFiltersFromNoResults"
              description="The label for the button that clears filters when there are no results"
            >
              Clear all filters
            </Translate>
          </button>
        )}
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        {/*
         We should not index search pages
          See https://github.com/facebook/docusaurus/pull/3233
        */}
        <meta property="robots" content="noindex, follow" />
      </Head>

      <div className="container margin-vert--lg">
        <header className={styles.pageHeader}>
          <Heading as="h1" className={styles.pageTitle}>
            {pageTitle}
          </Heading>
          <PoweredByAlgolia />
        </header>

        <form
          className={styles.searchForm}
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <SearchInput
            autoFocus={true}
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </form>

        <div
          className={clsx(
            styles.layout,
            hasSidebar && styles.layoutWithSidebar
          )}
        >
          {hasSidebar && (
            <SearchFacets
              facets={facets}
              refinements={refinements}
              hasActiveRefinements={hasActiveRefinements}
              showVersionSelects={showVersionSelects}
              versionHelpers={versionHelpers}
              onToggle={toggleRefinement}
              onClear={clearRefinements}
            />
          )}

          <div className={styles.mainColumn}>
            {isSearching && (totalResults !== null || hasActiveRefinements) && (
              <div className={styles.resultsMeta}>
                {totalResults !== null && (
                  <span className={styles.resultsCount}>
                    {documentsFoundPlural(totalResults)}
                  </span>
                )}
                <ActiveRefinements
                  refinements={refinements}
                  onRemove={toggleRefinement}
                />
              </div>
            )}

            {renderMainContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function SearchPage(): ReactNode {
  return (
    <HtmlClassNameProvider className="search-page-wrapper">
      <SearchPageContent />
    </HtmlClassNameProvider>
  );
}
