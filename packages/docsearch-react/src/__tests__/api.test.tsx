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
  return <DocSearchComponent apiKey="foo" indexName="bar" {...props} />;
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
          // mock empty response
          transformSearchClient={(searchClient) => {
            return {
              ...searchClient,
              search: () => {
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
              },
            };
          }}
          translations={{
            modal: {
              noResultsScreen: {
                noResultsText: 'Pas de résultats pour',
                openIssueText: 'Ouvrez une issue sur docsearch-configs',
                openIssueLinkText: 'Lien du repo',
              },
            },
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
});
