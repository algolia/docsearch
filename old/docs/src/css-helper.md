---
layout: two-columns
title: CSS config helper
---

To speed up the process of defining which selectors could make a good candidate,
we created a custom CSS file to help us to see what tags it needs.

![Jest documentation after][3]

## Installation

We suggest you use a browser extension like Stylus (available for [Firefox][1]
and [Chrome][2]) to add the following piece of CSS to the page.

```css
/* Headers */
h1:before,
h2:before,
h3:before,
h4:before,
h5:before {
  font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  display: inline-block !important;
  visibility: visible !important;
  color: white;
  padding: 0.25rem;
  border-radius: 0.125rem;
  margin: 0 0.5rem 0 0 !important;
}
h1:before {
  content: '<h1>' !important;
  background-color: #3a46a1;
}
h2:before {
  content: '<h2>' !important;
  background-color: #5560b5;
}
h3:before {
  content: '<h3>' !important;
  background-color: #707bcc;
}
h4:before {
  content: '<h4>' !important;
  background-color: #8d97e3;
}
h5:before {
  content: '<h5>' !important;
  background-color: #a6b0f9;
}

/* Text elements */
p:before,
li:before {
  color: white;
  padding: 0.25rem;
  border-radius: 0.125rem;
  margin-right: 0.5rem;
}
p:before {
  content: '<p>';
  background: #f3a57e;
}
li:before {
  content: '<li>';
  background: #f8be9a;
}

/* Elements you should probably not index
 * Note that we have to manually exclude it from applying in #stylus
 * to avoid styling the extension itself ¯\_(ツ)_/¯
 */
html:not(#stylus) pre:before,
img:before {
  background: grey;
  color: white;
  padding: 0.25rem;
  border-radius: 0.125rem;
  margin-right: 0.5rem;
  display: block;
}
html:not(#stylus) pre:before {
  content: '<pre>';
}
html:not(#stylus) img:before {
  content: '<img>';
}
html:not(#stylus) iframe:before {
  content: '<iframe>';
}
html:not(#stylus) pre,
html:not(#stylus) img,
html:not(#stylus) iframe {
  background: grey;
  opacity: 0.2;
}
```

[1]: https://addons.mozilla.org/en-US/firefox/addon/styl-us/
[2]:
  https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne
[3]: ./assets/css-helper-after.png
