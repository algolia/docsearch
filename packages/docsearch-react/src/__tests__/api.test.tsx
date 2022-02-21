import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';

import { DocSearch as DocSearchComponent } from '../DocSearch';
import type { DocSearchProps } from '../DocSearch';

function DocSearch(props: Partial<DocSearchProps>) {
  return (
    <DocSearchComponent appId="woo" apiKey="foo" indexName="bar" {...props} />
  );
}

// mock empty response
function noResultSearch(_queries: any, _requestOptions?: any): Promise<any> {
  return new Promise((resolve) => {
    resolve({
      results: [
        {
          hits: [],
          hitsPerPage: 0,
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          exhaustiveNbHits: true,
          params: '',
          query: '',
        },
      ],
    });
  });
}

describe('api', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders with minimal parameters', () => {
    render(<DocSearch />);

    expect(document.querySelector('.DocSearch')).toBeInTheDocument();
  });

  describe('translations', () => {
    it('overrides the default DocSearchButton text', () => {
      render(
        <DocSearch
          translations={{
            button: {
              buttonText: 'Recherche',
              buttonAriaLabel: 'Recherche',
            },
          }}
        />
      );

      expect(
        document.querySelector('.DocSearch-Button-Placeholder').innerHTML
      ).toBe('Recherche');
      expect(
        document.querySelector('.DocSearch-Button').getAttribute('aria-label')
      ).toBe('Recherche');
    });

    it('overrides the default DocSearchModal startScreen text', async () => {
      render(
        <DocSearch
          translations={{
            modal: {
              startScreen: {
                noRecentSearchesText: 'Pas de recherche récentes',
              },
            },
          }}
        />
      );

      await waitFor(() => {
        fireEvent.click(document.querySelector('.DocSearch-Button'));
      });

      expect(screen.getByText('Pas de recherche récentes')).toBeInTheDocument();
    });

    it('overrides the default DocSearchModal noResultsScreen text', async () => {
      render(
        <DocSearch
          transformSearchClient={(searchClient) => {
            return {
              ...searchClient,
              search: noResultSearch,
            };
          }}
          translations={{
            modal: {
              noResultsScreen: {
                noResultsText: 'Pas de résultats pour',
                reportMissingResultsText:
                  'Ouvrez une issue sur docsearch-configs',
                reportMissingResultsLinkText: 'Lien du repo',
              },
            },
          }}
          getMissingResultsUrl={() => 'algolia.com'}
        />
      );

      await act(async () => {
        await waitFor(() => {
          fireEvent.click(document.querySelector('.DocSearch-Button'));
        });

        fireEvent.input(document.querySelector('.DocSearch-Input'), {
          target: { value: 'q' },
        });
      });

      expect(screen.getByText(/Pas de résultats pour/)).toBeInTheDocument();
      expect(
        screen.getByText(/Ouvrez une issue sur docsearch-configs/)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: 'Lien du repo',
        })
      ).toBeInTheDocument();
    });

    it('overrides the default DocSearchModal searchbox text', async () => {
      render(
        <DocSearch
          translations={{
            modal: {
              searchBox: {
                resetButtonTitle: 'Effacer',
                resetButtonAriaLabel: 'Effacer',
                cancelButtonText: 'Annuler',
                cancelButtonAriaLabel: 'Annuler',
              },
            },
          }}
        />
      );

      await waitFor(() => {
        fireEvent.click(document.querySelector('.DocSearch-Button'));
      });

      expect(document.querySelector('.DocSearch-Cancel').innerHTML).toBe(
        'Annuler'
      );
      expect(
        document.querySelector('.DocSearch-Cancel').getAttribute('aria-label')
      ).toBe('Annuler');

      expect(
        document.querySelector('.DocSearch-Reset').getAttribute('title')
      ).toBe('Effacer');
      expect(
        document.querySelector('.DocSearch-Reset').getAttribute('aria-label')
      ).toBe('Effacer');
    });

    it('overrides the default DocSearchModal footer text', async () => {
      render(
        <DocSearch
          translations={{
            modal: {
              footer: {
                closeText: 'Fermer',
                navigateText: 'Naviguer',
                searchByText: 'Recherche par',
                selectText: 'Selectionner',
              },
            },
          }}
        />
      );

      await waitFor(() => {
        fireEvent.click(document.querySelector('.DocSearch-Button'));
      });

      expect(screen.getByText('Recherche par')).toBeInTheDocument();
      expect(screen.getByText('Fermer')).toBeInTheDocument();
      expect(screen.getByText('Naviguer')).toBeInTheDocument();
      expect(screen.getByText('Selectionner')).toBeInTheDocument();
    });
  });

  describe('getMissingResultsUrl', () => {
    it('does not render the link to the repository by default', async () => {
      render(
        <DocSearch
          transformSearchClient={(searchClient) => {
            return {
              ...searchClient,
              search: noResultSearch,
            };
          }}
        />
      );

      await act(async () => {
        await waitFor(() => {
          fireEvent.click(document.querySelector('.DocSearch-Button'));
        });

        fireEvent.input(document.querySelector('.DocSearch-Input'), {
          target: { value: 'q' },
        });
      });

      expect(screen.getByText(/No results for/)).toBeInTheDocument();
      expect(
        document.querySelector('.DocSearch-Help a')
      ).not.toBeInTheDocument();
    });

    it('render the link to the repository', async () => {
      render(
        <DocSearch
          transformSearchClient={(searchClient) => {
            return {
              ...searchClient,
              search: noResultSearch,
            };
          }}
          getMissingResultsUrl={({ query }) =>
            `https://github.com/algolia/docsearch/issues/new?title=${query}`
          }
        />
      );

      await act(async () => {
        await waitFor(() => {
          fireEvent.click(document.querySelector('.DocSearch-Button'));
        });

        fireEvent.input(document.querySelector('.DocSearch-Input'), {
          target: { value: 'q' },
        });
      });

      expect(screen.getByText(/No results for/)).toBeInTheDocument();

      const link = document.querySelector('.DocSearch-Help a');
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe(
        'https://github.com/algolia/docsearch/issues/new?title=q'
      );
    });
  });
});
