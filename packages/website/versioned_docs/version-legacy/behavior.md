---
title: Dropdown Behavior
sidebar_label: Behavior
---

:::caution

The following references to **[Autocomplete.js](https://github.com/algolia/autocomplete/tree/master)** are outdated. If you would like to try the latest version, please visit the **[Autocomplete documentation](https://www.algolia.com/doc/ui-libraries/autocomplete/introduction/what-is-autocomplete/)**

:::

Our JavaScript library [DocSearch.js][7] is a wrapper of the [Algolia autocomplete.js][1] library. This library listens to every keystrokes typed in the search input, queries Algolia, and displays the results in a dropdown. Everything is already configured for you to work with DocSearch. Our UI library also exposes configuration options you can use to go even further. You will discover Algolia out of the box for documentation. Let's start the **learn as you type** experience.

## `appId`

It defines your own application ID using the `appId` key.

```javascript
docsearch({
  appId: '<YOUR_APP_ID>',
  […],
});
```

## `handleSelected`

This method is called when a suggestion is selected (either from a click or a keystroke). By default, DocSearch displays anchor links to the results page. You can override results (also called hits) to add your own behavior. Note that you can already open a new tab thanks to the `CMD/CTRL + Click` action.

The method is called with the following arguments:

- `input`: a reference to the search `input` element. It comes with the `.open()`, `.close()`, `.getVal()` and `.setVal()` methods.

- `event`: the actual event triggering the selection.

- `suggestion`: the object representing the current selection. It contains a `.url` key representing the destination.

- `datasetNumber`: this should always be equal to `1` as DocSearch is searching into one dataset at a time. You can ignore this attribute.

- `context`: additional information about the selection. Contains a `.selectionMethod` key that can be either `click`, `enterKey`, `tabKey` or `blur`, depending how the suggestion was selected.

```javascript
docsearch({
  // ...
  handleSelected: function (input, event, suggestion, datasetNumber, context) {
    // Prevents the default behavior on click and rather opens the suggestion
    // in a new tab.
    if (context.selectionMethod === 'click') {
      input.setVal('');

      const windowReference = window.open(suggestion.url, '_blank');
      windowReference.focus();
    }
  },
});
```

You can [try it live on CodeSandbox][3].

## `queryHook`

This method is called on every keystroke to transform the typed keywords before querying Algolia. By default, it does not do anything, but we provide this hook for you to add your own logic if needed.

```javascript
docsearch({
  […],
  queryHook: function(query) {
    // Transform query, and then return the updated version
  }
});
```

## `transformData`

This method will be called on every hit before displaying them. It doesn't do anything by default, but we provide this hook for you to add your own logic and pre-process the hits returned by Algolia.

```javascript
docsearch({
  […],
  transformData: function(hits) {
    // Transform the list of hits
  }
});
```

## `autocompleteOptions`

You can pass any options to the underlying [Autocomplete.js](https://github.com/algolia/autocomplete/tree/master) library by using the `autocompleteOptions` parameter. You can find the list of all available values in [the official documentation][4].

You can also listen to `autocomplete` events through the `.autocomplete` property of the `docsearch` instance.

```javascript
const search = docsearch({
  […],
  autocompleteOptions: {
    // See https://github.com/algolia/autocomplete/tree/master#global-options
  }
});

// See https://github.com/algolia/autocomplete/tree/master#custom-events
search.autocomplete.on('autocomplete:opened', event => {
});
```

## `algoliaOptions`

You can forward search parameters to the Algolia API by using the `algoliaOptions` key. You can find all Algolia API options in their [own documentation][5].

For example, you might want to increase the number of results displayed in the dropdown. [`hitsPerPage` set the number of shown hits][6].

```javascript
docsearch({
  algoliaOptions: {
    hitsPerPage: 10,
    // See https://www.algolia.com/doc/api-reference/api-parameters/
  },
});
```

[1]: https://github.com/algolia/autocomplete/tree/master
[3]: https://codesandbox.io/s/docsearchjs-open-in-new-tab-tgs2h
[4]: https://github.com/algolia/autocomplete/tree/master#global-options
[5]: https://www.algolia.com/doc/api-reference/api-parameters/
[6]: https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/
[7]: https://github.com/algolia/docsearch.js
