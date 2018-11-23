---
layout: two-columns
title: Dropdown Behavior
---

Our JS library `docsearch.js` is a wrapper of the [autocomplete.js][1] library.
This library will listen to every keystrokes in the search input, query Algolia,
and display the results in a dropdown. Everything is already configured for you
to work with DocSearch. Our UI library also exposes configuration options you
can use to go even further. You will empower Algolia.

## `appId`

If you're [running the DocSearch crawler on your own][2], you'll need to define
your own application ID using the `appId` key. If you're using the free hosted
version, you don't need to add anything.

```javascript
docsearch({
  appId: '<YOUR_CUSTOM_APP_ID>',
  […],
});
```

## `handleSelected`

This method is called when a suggestion is selected (either from a click or a
keystroke). By default, DocSearch will display links redirecting to the results
page, at the related anchor. You can override it to add your own behavior.
Please note that you can already open a new tab thanks to the `CMD/CTRL + Click`

The method is called with the following arguments:

- `input`, a reference to the search `input` element. It comes with the
  `.open()`, `.close()`, `.getVal()` and `.setVal()` methods.

- `event`, the actual event triggering the selection.

- `suggestion`, the object representing the current selection. Contains a `.url`
  key representing the destination.

- `datasetNumber`, this should always equal `1` as DocSearch is searching into
  one dataset at a time. You can ignore this attribute.

- `context`, additional information about the selection. Contains a
  `.selectionMethod` key that can be either `click`, `enterKey`, `tabKey` or
  `blur`, depending how the suggestion was selected.

```javascript
docsearch({
  […],
  handleSelected: function(input, event, suggestion, datasetNumber, context) {
    // Default implementation is as follow:
    input.setVal('');
    window.location.assign(suggestion.url);
  }
});
```

## `queryHook`

This method will be called on every keystroke to transform the typed keywords
before querying them to Algolia. By default, it does not do anything, but we
provide this hook for you to add your own logic if needed.

```javascript
docsearch({
  […],
  queryHook: function(query) {
    // Transform query, and then return the updated version
  }
});
```

## `transformData`

This method will be called on all suggestions before displaying them. It doesn't
do anything by default, but we provide this hook for you to add your own logic.

```javascript
docsearch({
  […],
  transformData: function(suggestions) {
    // Transform the list of suggestions, and the return the updated list
  }
});
```

## `autocompleteOptions`

You can pass any option to the underlying `autocomplete.js` instance by using
the `autocompleteOptions` parameter. You will find the list of all available
values in [the official documentation][3].

You can also listen to `autocomplete` events through the `.autocomplete`
property of the `docsearch` instance.

```javascript
const search = docsearch({
  […]
  autocompleteOptions: {
    // See https://github.com/algolia/autocomplete.js#options
  }
});

// See https://github.com/algolia/autocomplete.js#custom-events
search.autocomplete.on('autocomplete:opened', event => {
});
```

## `algoliaOptions`

You can pass options to the Algolia API by using the `algoliaOptions` key. You
will find all Algolia API options in their [own documentation][4].

For example, you might want to increase the number of results displayed in the
dropdown. [`hitsPerPage` set the number of shown hits][5].

```javascript
docsearch({
  algoliaOptions: {
    hitsPerPage: 10,
    // See https://www.algolia.com/doc/api-reference/api-parameters/
  },
});
```

[1]: https://github.com/algolia/autocomplete.js
[2]: ./run-your-own.html
[3]: https://github.com/algolia/autocomplete.js#options
[4]: https://www.algolia.com/doc/api-reference/api-parameters/
[5]: https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/
