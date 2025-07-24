import { DropdownMenu } from 'radix-ui';
import React from 'react';

import { ChevronDown, ChevronUp } from './icons';

const ASKAI_URL = 'https://askai.algolia.com/api';

async function fetchProviders({ search, filter, sorts } = {}) {
  const params = new URLSearchParams();

  if (search !== '') {
    params.set('search', search);
  }

  if (filter !== null) {
    params.set('filter', filter.name);
  }

  if (sorts) {
    const sortList = [];
    Object.entries(sorts).forEach(([key, val]) => {
      if (val) {
        sortList.push(`${val === 'desc' ? '-' : ''}${key}`);
      }
    });

    params.set('sort', sortList.join(','));
  }

  const res = await fetch(`${ASKAI_URL}/providers?${params.toString()}`);
  const data = await res.json();

  return data;
}

function formatProvidersFilters(providers) {
  return Object.values(providers).map((provider) => ({
    name: provider.name,
    displayName: provider.displayName,
  }));
}

function FiltersMenu({ providers, selectedProvider, onSelect }) {
  if (!providers) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild={true}>
        <button
          type="button"
          className="bg-background px-3 py-1.5 text-foreground ring-1 rounded cursor-pointer inline-flex items-center space-x-1 order-1 md:order-2"
        >
          <span>{selectedProvider?.displayName ?? 'Filter providers'}</span>
          <ChevronDown />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={5}
          align="start"
          className="bg-background text-popover-foreground py-2 shadow"
        >
          <DropdownMenu.Item
            className="px-6 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            onClick={() => onSelect(null)}
          >
            View all
          </DropdownMenu.Item>
          {providers.map((provider) => (
            <DropdownMenu.Item
              className="px-6 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              key={provider.name}
              onClick={() => onSelect(provider)}
            >
              {provider.displayName}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function SortIndicator({ sort }) {
  if (sort === 'asc') {
    return <ChevronUp className="ml-2" />;
  }

  if (sort === 'desc') {
    return <ChevronDown className="ml-2" />;
  }

  return null;
}

export function ProvidersTable() {
  const [providers, setProviders] = React.useState({});
  const [providersFilters, setProvidersFilters] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const [filter, setFilter] = React.useState(null);
  const [sorts, setSorts] = React.useState({});

  const handleFilter = (provider) => {
    setFilter(provider);
  };

  const handleSorting = React.useCallback(
    (sortKey) => {
      const newSorts = { ...sorts };

      if (newSorts[sortKey]) {
        if (newSorts[sortKey] === 'asc') {
          newSorts[sortKey] = 'desc';
        } else {
          newSorts[sortKey] = null;
        }
      } else {
        newSorts[sortKey] = 'asc';
      }

      setSorts(newSorts);
    },
    [sorts],
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  React.useEffect(() => {
    async function getProviders(q) {
      const data = await fetchProviders({
        search: q,
        filter,
        sorts,
      });

      setProviders(data);

      if (!providersFilters) {
        setProvidersFilters(formatProvidersFilters(data));
      }
    }

    getProviders(debouncedQuery);
  }, [debouncedQuery, filter, providersFilters, sorts]);

  const rows = React.useMemo(
    () =>
      Object.values(providers).map((provider) =>
        provider.availableModels.map((model) => (
          <tr key={model.id}>
            <td>{provider.displayName}</td>
            <td>{model.displayName}</td>
            <td>{provider.name}</td>
            <td>{model.name}</td>
          </tr>
        )),
      ),
    [providers],
  );

  return (
    <div>
      <div className="flex items-start md:items-center mb-4 mt-8 md:space-x-4 flex-col md:flex-row">
        <input
          type="text"
          name="providers"
          placeholder="Search providers and models"
          className="border rounded px-3 py-1.5 w-full md:w-1/2 placeholder-foreground order-2 md:order-1 mt-4 md:mt-0"
          onChange={(e) => setQuery(e.target.value)}
        />
        <FiltersMenu selectedProvider={filter} providers={providersFilters} onSelect={handleFilter} />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="providers-table">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSorting('provider')}>
                <span className="inline-flex items-center">
                  Provider
                  <SortIndicator sort={sorts.provider} />
                </span>
              </th>
              <th className="cursor-pointer w-1/4" onClick={() => handleSorting('model')}>
                <span className="inline-flex items-center">
                  Model
                  <SortIndicator sort={sorts.model} />
                </span>
              </th>
              <th>Provider ID</th>
              <th>Model ID</th>
            </tr>
          </thead>
          <tbody>{rows.map((row) => row)}</tbody>
        </table>
      </div>
    </div>
  );
}
