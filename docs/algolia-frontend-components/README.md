## Algolia front end components

This project was created so that we can more easily update our components across all of our websites and avoid issues with consistency. 

### Why this approach

We have a lot of different websites running, a lot of community projects where our components are functionaly and design wise the same, yet we see offsets in CSS and changes to HTML structure which prove hard to maintain. There is no single source of truth for our components and thus we are seeing various different implementations and styles. In the future we want to avoid this and move faster. Changing a header on all of our websites should not take a week's time, but it should be as simple as pulling the components repository, rebuilding the components and re-deploying the websites. No manual cleaning of old CSS, copy/pasting html etc.

### How does it work?
The package uses javascript to generate custom content inside your component. All you need to specify is the data for that package to render and include it in your project.

Each component has a `<component>.example.json` file which you can simply rename to `<component>.data.json` to have it use the json file.


### Usage

Depending on your build process you can have a few different use cases.

### Build the components

Depending on the build tool, there a few use cases of how you can import components.

## @TODO write best practice for different build steps





