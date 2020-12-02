import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import React from 'react';

import showcaseProjects from './showcase-projects.json';

function Showcase(props) {
  const { withBaseUrl } = useBaseUrlUtils();

  return (
    <div>
      <div className="py-8  lg:mx-auto text-center">
        <h1 className="text-3xl leading-9 font-extrabold text-gray-900">
          {props.title}
        </h1>
        <p className="mt-4 text-xl leading-7 text-gray-500">
          {props.description}
        </p>
      </div>

      <div className="my-8">
        <ul className="m-auto max-w-6xl grid grid-cols-4 gap-0.5 md:grid-cols-6 lg:mt-0 lg:grid-cols-8">
          {showcaseProjects.map(({ name, href, image }) => (
            <li
              key={href}
              className="col-span-1 flex justify-center py-2 px-2 text-center"
            >
              <a
                href={href}
                rel="noreferrer"
                target="_blank"
                alt={`Discover DocSearch on the ${name} documentation`}
              >
                <img
                  className="inline-block h-16 w-16"
                  src={withBaseUrl(image)}
                  alt={`Discover DocSearch on the ${name} documentation`}
                />
                <div className="uppercase text-gray-500 text-xs py-2">
                  {name}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ShowcasePage() {
  const title = 'Showcase';
  const description = 'See great search experiences using DocSearch';

  return (
    <Layout title={title} description={description}>
      <Showcase title={title} description={description} />
    </Layout>
  );
}

export default ShowcasePage;
