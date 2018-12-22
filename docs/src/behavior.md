---
layout: two-columns
title: Dropdown Behavior
---

Our JS library `docsearch.js` is a wrapper of the [Algolia autocomplete.js][1]
library. This library will listen to every keystrokes typed in the search input,
query Algolia, and display the results in a dropdown. Everything is already
configured for you to work with DocSearch. Our UI library also exposes
configuration options you can use to go even further. You will discover Algolia
out of the box for documentation. Let's start the **learn as you type**
experience.

## `appId`

Only required if you're [running the DocSearch crawler on your own][2]. It
defines your own application ID using the `appId` key. If you're using the free
hosted version, you don't need to consider this parameter.

```javascript
docsearch({
  appId: '<YOUR_CUSTOM_APP_ID>',
  […],
});
```

## `handleSelected`

This method is called when a suggestion is selected (either from a click or a
keystroke). By default, DocSearch will display links redirecting to the results
page, at the related position (using anchor). You can override results (hit) to
add your own behavior. Please note that you can already open a new tab thanks to
the `CMD/CTRL + Click` action.

The method is called with the following arguments:

- `input`, a reference to the search `input` element. It comes with the
  `.open()`, `.close()`, `.getVal()` and `.setVal()` methods.

- `event`, the actual event triggering the selection.

- `suggestion`, the object representing the current selection. It contains a
  `.url` key representing the destination.

- `datasetNumber`, this should always be equal to `1` as DocSearch is searching
  into one dataset at a time. You can ignore this attribute.

- `context`, additional information about the selection. Contains a
  `.selectionMethod` key that can be either `click`, `enterKey`, `tabKey` or
  `blur`, depending how the suggestion was selected.

```javascript
docsearch({
  […],
  handleSelected: function(input, event, suggestion, datasetNumber, context) {
    // Do nothing if click on the suggestion, as it's already a <a href>, the
    // browser will take care of it. This allow Ctrl-Clicking on results and not
    // having the main window being redirected as well
    if (context.selectionMethod === 'click') {
      return;
    }

    input.setVal('');
    window.location.assign(suggestion.url);
  }
});
```

## `queryHook`

This method is called on every keystroke to transform the typed keywords before
querying Algolia. By default, it does not do anything, but we provide this hook
for you to add your own logic if needed.

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

You can pass any options to the underlying `autocomplete.js` instance by using
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
