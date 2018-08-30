# Documentation website

This subdirectory holds the documentation website content as well as scripts to
generate it.

## Main commands

### Building the website

You can build a new version of the website by running `yarn run build` in this
directory or `yarn run docs:build` at the repository root.

It will read all source files in `./src` and build the final static website in
`./dist`.

### Local development

You can run a local copy of the documentation website by running
`yarn run serve`. This is an alias for running `yarn run docs:serve` at the
repository root.

This will build the website in `./dist` and expose it on `localhost`, along with
live-reload.

### Deploying the website

You can deploy the website manually by running `yarn run deploy` in this
directory or `yarn run docs:deploy` at the repository root.

This will build the website and then commit the content of the `./dist` folder
to the `gh-pages` branch and push it to GitHub.

Netlify is configured to listen to all commits on `master` and
run `netlify-master` (see`netlify.toml` in the root). This script will check if
any changes were made in the `./docs` subfolder. If no changes were made, it
will finish, otherwise it will build the website and push it to
`gh-pages`.

## Internals

The documentation generation is not using any existing static websites
generators, but custom JavaScript scripts.

The main two entry points are `./scripts/build.js` and `./scripts/serve.js`. The
second one adds a webserver with live-reload on top of the first one.

### HTML

All Markdown files situated in `./src` will be transformed into `.html` files in
`./dist`. They will be wrapped into the layout defined in their front-matter.

All the headers will be converted to their respective `<hX>` tag, along with a
unique `#id` to allow for easy anchoring.

You can also use plain HTML inside those Markdown files if you need more
advanced styling.

### Layouts

All layouts are saved in the `./src/_layouts` folder.

All config options defined into `config.json` are passed to the layouts and can
be used there.

You can also use mixins or include other files from the layouts.

_Note that the current layout logic is simple and might not handle complex
recursive cases, but should be enough for simple cases._

### CSS

CSS is processed through PostCSS. It expects an entry file in `./src/style.css`.

We are using `postcss-import`, allowing you to `@import` files from the
`./src/_styles/` directory to better split your CSS code in logical chunks.

Most of the styling based on tailwind.css, with the config file behing
`tailwind.config.js`. It contains default sizing and coloring to follow the
Algolia brand guidelines.

The final CSS files is then compressed through PurgeCSS (to keep CSS classes
that are actually used) and CleanCSS (to minify it).

### JavaScript

JavaScript code is processed through Babel. It will compile all files situated
in `./src/js`.

_Note that it compiles JS, and does not bundle it. We might add Webpack/Parcel
support later._

### Assets

Any file with the following extensions found in the `./src` folder will be
automatically copied to the `./dist` folder with the same folder structure:
`gif`, `jpg`, `png`, `ico`, `html`, `svg` and `woff`.

### Placeholders

Values defined in the `placeholders` key of the `config.json` file can be used
in JavaScript and Markdown files by using the `{{key}}` syntax.

For example if you have:

```json
// config.json
{
  "placeholders": {
    "projectVersion": "1.4.2"
  }
}
```

Every occurrence of `{{projectVersion}}` in any `.md` or `.js` file will be
replaced with `1.4.2`.

### Sidebar

The left sidebar of the documentation is generated based on the `sidebar` key of
the `config.json`. The key should contain an array where each key is a part of
the sidebar, with a `title` and a list of `pages`. Each of those pages in turn
is an object with a `title` and `url` value.

The layout will then automatically create all the links and color the active
page. Subsections inside the current page will also be added for every `h2`
element extracted from the markup of the current page.

### Redirects

The `config.json` file can hold a `redirects` array, with object containing both
a `from` and a `to` key. For each `from`, it will create a plain HTML page at
this location, that will redirect anyone visiting it to the page defined in
`to`.

_Note that both those links must be defined as relative to the `site.url`
value._
