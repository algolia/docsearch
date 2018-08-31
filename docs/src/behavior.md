---
layout: two-columns
title: Dropdown Behavior
---

Our JS library `docsearch.js` is a wrapper of the [autocomplete.js][1] library.
This library will listen to keystrokes in the search input, query Algolia and
displays the results in a dropdown. Everything is already configured for you to
work with DocSearch, but it also exposes configuration options you can use to go
even further.

## `appId`

If you're running the DocSearch crawler on your own, you'll need to define your
application ID using the `appId` key. If you're using the free hosted version,
you don't need to add anything.

```javascript
docsearch({
  appId: '<YOUR_CUSTOM_APP_ID>',
  […],
});
```

## `handleSelected`

This method is called when a suggestion is selected. By default, DocSearch will
redirect the browser to the result's page at the related anchor, but you can
override it to add your own behavior.

The method is called with three arguments:

- `input`, a reference to the search `input` element. It comes with the
  `.open()`, `.close()`, `.getVal()` and `.setVal()` methods.

- `event`, the actual event triggering the selection. This can come from a click
  or a keyboard navigation.

- `suggestion`, the object representing the current selection.

```javascript
docsearch({
  […],
  handleSelected: function(input, event, suggestion) {
  }
});
```

## `queryHook`

This method will be called on every keystroke to transform the typed keywords
before sending them to Algolia. By default, it does not do anything, but we
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
the `autocompleteOptions` parameter. You will find all the list of all available
value in its [the official documentation][2].

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
will find all Algolia API options in their [own documentation][3].

For example, you might want to increase the number of results displayed in the
dropdown. [`hitsPerPage` set the number of shown hits][4].

```javascript
docsearch({
  algoliaOptions: {
    hitsPerPage: 10,
    // See https://www.algolia.com/doc/api-reference/api-parameters/
  },
});
```

[1]: https://github.com/algolia/autocomplete.js
[2]: https://github.com/algolia/autocomplete.js#options
[3]: https://www.algolia.com/doc/api-reference/api-parameters/
[4]: https://www.algolia.com/doc/api-reference/api-parameters/hitsPerPage/
