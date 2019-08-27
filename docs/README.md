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

### Deploying the website manually

You can deploy the website manually by running `yarn run deploy` in this
directory or `yarn run docs:deploy` at the repository root.

This will build the website and then commit the content of the `./dist` folder
to the `gh-pages` branch and push it to GitHub.

### Auto-deploying

Any new commit on `master` that modifies the `./docs` folder will automatically
trigger a build and deploy it.

It works by having Netlify listen to any new commit on `master` and running
`./scripts/netlify-master` in response (see `netlify.toml` for details). Note
that the website is **not** hosted on Netlify, but on GitHub Pages (more on that
later).

The script compares the date of the last commit in `./docs` with the date of the
last deploy. If there are no new commits, it will stop. Otherwise, it will
continue and build the website.

To make this comparison, both this script and the manual deploy script add a
`last_update` file to the `./dist` folder containing the timestamp of the last
deploy. This file is then used to see if changes are present if it should deploy
anything.

Once the build is complete, it commits the `./dist` folder to the `gh-pages`
branch and pushed to GitHub. This part requires some non-trivial `git` and `ssh`
configuration commands to push data from Netlify to GitHub pages on our behalf
(check `./scripts/netlify-master` for more details).

### Deploy previews

Any new Pull Request to the documentation will trigger a deploy preview build.

Netlify runs `./scripts/netlify-deploy-preview` on each new PR (check
`netlify.toml` for details).

This script will first check if the PR changes anything to the `./docs` subfolder.
If PR doesn't change anything, it will not generate the preview (this will make
processing time faster).

Whenever the preview is ready, Algobot adds a message to the PR, along with the
link to the preview. This is a Netlify UI setting in _Build and Deploy > Deploy
notifications > Comment on GitHub pull request when deploy succeeds_. It uses a
GitHub token from Algobot to post on its behalf. To generate such a token, login
to Netlify with Algobot and pretend to create such a notification on any
project, generate a token, and then copy-paste it in the real DocSearch account
in Netlify.

## Internals

The documentation generation is not using any existing static websites
generators, but custom JavaScript scripts.

The main two entry points are `./scripts/build.js` and `./scripts/serve.js`. The
second one adds a webserver with live-reload on top of the first one.

### HTML

It transforms every Markdown files situated in `./src` into `.html` files in
`./dist`. It wrapps them into the layout defined in their front-matter.

It converts every header to their respective `<hX>` tag, along with a unique
`#id` to allow for easy anchoring.

You can use plain HTML inside those Markdown files if you need more advanced
styling. The custom `{my-class}` syntax is also possible if to add CSS classes
to elements.

```markdown
This is my paragraph. {p-2}

![Pretty image](./img.jpg) {mt-2}
```

```html
<p class="p-2">This is my paragraph</p>

<p class="mt-2">
  <img src="./img.jpg" alt="Pretty image" />
</p>
```

### Layouts

Layouts are in the `./src/_layouts` folder.

It passes every config options defined into `config.json` to the layouts and are
available there.

You can also use mixins or include other files from the layouts.

_Note that the current layout logic is simple and might not handle complex
recursive cases, but should be enough for simple cases._

### CSS

PostCSS processes CSS. It expects an entry file in `./src/style.css`.

We are using `postcss-import`, allowing you to `@import` files from the
`./src/_styles/` directory to better split your CSS code in logical chunks.

Most of the styling based on tailwind.css, with the config file behing
`tailwind.config.js`. It contains default sizing and coloring to follow the
Algolia brand guidelines.

The final CSS files is then compressed through PurgeCSS (to keep CSS classes
that are actually used) and CleanCSS (to minify it).

### JavaScript

Babel processes JavaScript code. It will compile all files situated in
`./src/js`.

_Note that it compiles JS, and does not bundle it. We might add Webpack/Parcel
support later._

### Assets

Any file with the following extensions found in the `./src` folder will be
automatically copied to the `./dist` folder with the same folder structure:
`gif`, `jpg`, `png`, `ico`, `html`, `svg` and `woff`.

### Placeholders

You can use the values defined in the `placeholders` key of the `config.json` in
JavaScript and Markdown files by using the `{{key}}` syntax.

For example if you have:

```json
// config.json
{
  "placeholders": {
    "projectVersion": "1.4.2"
  }
}
```

It replaces every occurrence of `{{projectVersion}}` in any `.md` or `.js` file
with `1.4.2`.

### Sidebar

It generates the left sidebar of the documentation based on the `sidebar` key of
the `config.json`. The key should contain an array where each key is a part of
the sidebar, with a `title` and a list of `pages`. Each of those pages in turn
is an object with a `title` and `url` value.

The layout will then automatically create all the links and color the active
page. It adds subsections inside the current page for every `h2` element
extracted from the markup of the current page.

### Redirects

The `config.json` file can hold a `redirects` array, with object containing both
a `from` and a `to` key. For each `from`, it will create a plain HTML page at
this location, that will redirect anyone visiting it to the page defined in
`to`.

_Note You must define the links as relative to the `site.url` value._
