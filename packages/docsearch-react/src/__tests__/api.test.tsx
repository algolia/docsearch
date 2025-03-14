import { render, act, fireEvent, screen, cleanup } from '@testing-library/react';
import React, { type JSX } from 'react';
import { describe, it, expect, afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

import { DocSearch as DocSearchComponent } from '../DocSearch';
import type { DocSearchProps } from '../DocSearch';

function DocSearch(props: Partial<DocSearchProps>): JSX.Element {
  return <DocSearchComponent appId="woo" apiKey="foo" indexName="bar" {...props} />;
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
  const docSearchSelector = '.DocSearch';

  afterEach(() => {
    cleanup();
  });

  it('renders with minimal parameters', () => {
    render(<DocSearch />);

    expect(document.querySelector(docSearchSelector)).toBeInTheDocument();
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
        />,
      );
      expect(document.querySelector(docSearchSelector)).toBeInTheDocument();
      expect(document.querySelector('.DocSearch-Button-Placeholder')?.innerHTML).toBe('Recherche');
      expect(document.querySelector('.DocSearch-Button')?.getAttribute('aria-label')).toBe('Recherche (Ctrl+K)');
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
        />,
      );

      expect(document.querySelector(docSearchSelector)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      expect(document.querySelector('.DocSearch-Modal')).toBeInTheDocument();
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
                reportMissingResultsText: 'Ouvrez une issue sur docsearch-configs',
                reportMissingResultsLinkText: 'Lien du repo',
              },
            },
          }}
          getMissingResultsUrl={() => 'algolia.com'}
        />,
      );

      expect(document.querySelector(docSearchSelector)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      await act(async () => {
        fireEvent.input(await screen.findByPlaceholderText('Search docs'), {
          target: { value: 'q' },
        });
      });

      expect(screen.getByText(/Pas de résultats pour/)).toBeInTheDocument();
      expect(screen.getByText(/Ouvrez une issue sur docsearch-configs/)).toBeInTheDocument();
      expect(
        screen.getByRole('link', {
          name: 'Lien du repo',
        }),
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
                searchInputLabel: 'Recherche',
              },
            },
          }}
        />,
      );

      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      const searchInputLabel = document.querySelector('.DocSearch-MagnifierLabel');

      expect(document.querySelector(docSearchSelector)).toBeInTheDocument();

      expect(document.querySelector('.DocSearch-Cancel')?.innerHTML).toBe('Annuler');
      expect(document.querySelector('.DocSearch-Cancel')?.getAttribute('aria-label')).toBe('Annuler');
      expect(document.querySelector('.DocSearch-Reset')?.getAttribute('title')).toBe('Effacer');
      expect(document.querySelector('.DocSearch-Reset')?.getAttribute('aria-label')).toBe('Effacer');
      expect(searchInputLabel?.textContent).toBe('Recherche');
    });

    it('overrides the default DocSearchModal footer text', async () => {
      render(
        <DocSearch
          translations={{
            modal: {
              footer: {
                closeText: 'Pour fermer',
                closeKeyAriaLabel: "Touche d'échappement",
                navigateText: 'Pour naviguer',
                navigateUpKeyAriaLabel: 'Flèche vers le haut',
                navigateDownKeyAriaLabel: 'Flèche le bas',
                searchByText: 'Recherche par',
                selectText: 'Pour selectionner',
                selectKeyAriaLabel: "Touche d'entrée",
              },
            },
          }}
        />,
      );

      expect(document.querySelector(docSearchSelector)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      expect(screen.getByText('Recherche par')).toBeInTheDocument();
      expect(screen.getByText('Pour fermer')).toBeInTheDocument();
      expect(screen.getByText('Pour naviguer')).toBeInTheDocument();
      expect(screen.getByText('Pour selectionner')).toBeInTheDocument();
      expect(
        document.querySelector('.DocSearch-Commands-Key > svg[aria-label="Touche d\'échappement"]'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('.DocSearch-Commands-Key > svg[aria-label="Flèche vers le haut"]'),
      ).toBeInTheDocument();
      expect(document.querySelector('.DocSearch-Commands-Key > svg[aria-label="Flèche le bas"]')).toBeInTheDocument();
      expect(
        document.querySelector('.DocSearch-Commands-Key > svg[aria-label="Touche d\'entrée"]'),
      ).toBeInTheDocument();
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
        />,
      );

      expect(document.querySelector(docSearchSelector)).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      await act(async () => {
        fireEvent.input(await screen.findByPlaceholderText('Search docs'), {
          target: { value: 'q' },
        });
      });

      expect(screen.getByText(/No results for/)).toBeInTheDocument();
      expect(document.querySelector('.DocSearch-Help a')).not.toBeInTheDocument();
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
          getMissingResultsUrl={({ query }) => `https://github.com/algolia/docsearch/issues/new?title=${query}`}
        />,
      );

      await act(async () => {
        fireEvent.click(await screen.findByText('Search'));
      });

      await act(async () => {
        fireEvent.input(await screen.findByPlaceholderText('Search docs'), {
          target: { value: 'q' },
        });
      });

      expect(screen.getByText(/No results for/)).toBeInTheDocument();
      const link = document.querySelector('.DocSearch-Help a');
      expect(link).toBeInTheDocument();
      expect(link?.getAttribute('href')).toBe('https://github.com/algolia/docsearch/issues/new?title=q');
    });
  });
});
