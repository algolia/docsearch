import { Hero, Button, InlineLink } from '@algolia/ui-library';
import { useColorMode } from '@docusaurus/theme-common';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React from 'react';

import DocSearchLogo from './DocSearchLogo';
import showcaseProjects from './showcase-projects.json';

function Home() {
  const { withBaseUrl } = useBaseUrlUtils();
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    if (colorMode === 'dark') {
      document.querySelector('html').classList.add('dark');
    } else {
      document.querySelector('html').classList.remove('dark');
    }
  }, [colorMode]);

  function Header() {
    return (
      <Hero
        id="hero"
        title={
          <>
            <DocSearchLogo width="100%" />
            <span className="hero-title text-3xl leading-9 font-extrabold md:text-3xl lg:text-3xl md:leading-10 max-w-xxs inline-block">
              Free Algolia Search For Developer Docs
            </span>
          </>
        }
        background="curves"
        cta={[
          <Button
            key="get-started"
            href={withBaseUrl('docs/what-is-docsearch')}
          >
            Get started
          </Button>,
          <Button
            key="apply"
            href={withBaseUrl('apply')}
            background="blue"
            color="white"
            className="apply-button"
          >
            Apply
          </Button>,
        ]}
      />
    );
  }

  function Description() {
    return (
      <>
        {/* Showcase */}
        <div className="py-16 overflow-hidden">
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl leading-9 font-extrabold md:text-4xl md:leading-10">
                  Already trusted by your favorite docs
                </h2>
              </div>
            </div>
            <div className="pt-4 pb-12 md:pb-16">
              <div className="relative">
                <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6">
                  <div className="max-w-4xl mx-auto">
                    <dl className="rounded-lg shadow-xl lg:grid lg:grid-cols-3 showcase">
                      <div className="flex flex-col border-b p-6 text-center lg:border-0 showcase-border">
                        <dt
                          className="order-2 mt-2 text-lg leading-6 font-medium text-description"
                          id="item-1"
                        >
                          Free Service
                        </dt>
                        <dd
                          className="order-1 text-5xl leading-none font-extrabold text-algolia"
                          aria-describedby="item-1"
                        >
                          100%
                        </dd>
                      </div>
                      <div className="flex flex-col border-t border-b p-6 text-center lg:border-0 lg:border-l showcase-border">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-description">
                          Searches per month
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-algolia">
                          +170M
                        </dd>
                      </div>
                      <div className="flex flex-col border-t p-6 text-center lg:border-0 lg:border-l showcase-border">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-description">
                          DocSearch Live
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-algolia">
                          +7000
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-0.5 md:grid-cols-6 lg:mt-0 lg:grid-cols-8">
              {showcaseProjects
                .sort((a, b) => {
                  return a.name.localeCompare(b.name);
                })
                .map(({ name, href, image }) => (
                  <div
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
                        className="inline-block h-10 w-10"
                        src={withBaseUrl(image)}
                        alt={`Discover DocSearch on the ${name} documentation`}
                      />
                      <div className="text-description uppercase text-xs py-2 font-semibold">
                        {name}
                      </div>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="py-16 overflow-hidden">
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="relative">
              <h3 className="text-center text-3xl leading-8 font-extrabold tracking-tight md:text-4xl md:leading-10">
                Solve docs challenges with a search engine
              </h3>
              <p className="mt-4 max-w-3xl mx-auto text-center text-xl leading-7 text-description">
                Docs are only helpful when your users can find answers easily.
                Enter DocSearch.
              </p>
            </div>

            <div className="pt-16">
              <ul className="lg:grid lg:grid-cols-3 lg:col-gap-8 lg:row-gap-10">
                <li>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="search w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium">
                        Made for Developer docs
                      </h4>
                      <p className="mt-2 text-base leading-6 text-description">
                        Initially created to fulfill our own documentation
                        needs, DocSearch eventually became a community project
                        for open source docs. But, now it is available for
                        any/all kinds of developer documentation.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-10 lg:mt-0">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="user-group w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium">
                        Customizable and fast
                      </h4>
                      <p className="mt-2 text-base leading-6 text-description">
                        DocSearch understands how the user input fits into the
                        context of your project and instantly presents the most
                        relevant content with fewer interactions than any other
                        method.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-10 lg:mt-0">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="device-mobile w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium">
                        Mobile design
                      </h4>
                      <p className="mt-2 text-base leading-6 text-description">
                        With a design very close to the native experience on
                        mobile, we leverage users acquaintance with the
                        interaction patterns of each OS.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="diagonal-box py-16 bg-gray-200 overflow-hidden">
          <div className="diagonal-content max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="max-w-screen-xl mx-auto pt-6 px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl leading-9 font-extrabold text-gray-900 md:text-4xl md:leading-10">
                  How it works
                </h2>
                <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
                  We scrape your documentation or technical blog, configure the
                  Algolia application and send you the snippet you'll have to
                  integrate. It's that simple.
                </p>
              </div>
            </div>

            <div className="py-16">
              <div className="max-w-xl mx-auto px-4 md:px-6 lg:max-w-screen-lg lg:px-8 ">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                  <div>
                    <div className="flex items-center justify-center">
                      <img
                        className="h-200"
                        src={withBaseUrl('img/assets/scraping.svg')}
                        width="190px"
                        height="220px"
                        alt="Scraping with Algolia Crawler"
                      />
                    </div>
                    <div className="mt-10 lg:mt-0 p-4">
                      <h5 className="text-lg leading-6 font-medium text-gray-900">
                        1. Scraping
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-600">
                        We leverage the{' '}
                        <InlineLink
                          target="_blank"
                          href="https://www.algolia.com/products/search-and-discovery/crawler/"
                        >
                          Algolia Crawler
                        </InlineLink>{' '}
                        to index every section of your website.
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 lg:mt-0 p-4">
                    <div className="h-200 flex items-center justify-center">
                      <img
                        src={withBaseUrl('img/assets/configuration.svg')}
                        width="140px"
                        height="220px"
                        alt="Configuration of your crawler"
                      />
                    </div>
                    <div>
                      <h5 className="text-lg leading-6 font-medium text-gray-900">
                        2. Configuration
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-600">
                        You don't need to configure any settings or even have an
                        Algolia account. We take care of this for you!
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 lg:mt-0 p-4">
                    <div className="h-200 flex items-center justify-center">
                      <img
                        src={withBaseUrl('img/assets/implementation.svg')}
                        width="220px"
                        height="220px"
                        alt="Implementation on your website"
                      />
                    </div>
                    <div>
                      <h5 className="text-lg leading-6 font-medium text-gray-900">
                        3. Implementation
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-600">
                        We'll send you a small snippet to integrate DocSearch to
                        your website and an invite to your fully configured
                        Algolia application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Anatomy of DocSearch */}
        <div className="py-16 overflow-hidden lg:py-24">
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <h4 className="text-2xl leading-8 font-extrabold tracking-tight md:text-3xl md:leading-9">
                  Overview of DocSearch
                </h4>
                <p className="mt-3 text-lg leading-7 text-description">
                  Search doesn't have to be painful — when a user searches
                  through your docs, they'll get a frictionless modal dialog to
                  work in. And it's a Free Service!
                </p>

                <ul className="mt-10">
                  <li>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="sparkles w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h5 className="text-lg leading-6 font-medium">
                          All featured search box
                        </h5>
                        <p className="mt-2 text-base leading-6 text-description">
                          The conversation start here: you want to have the
                          state-of-the-art search box to represent your voice.
                          DocSearch comes with our extensive experience in
                          making this search box respects all the best
                          practices.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="mt-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="menu-alt2 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h5 className="text-lg leading-6 font-medium">
                          Hierarchical display
                        </h5>
                        <p className="mt-2 text-base leading-6 text-description">
                          DocSearch organizes the search results into chunks
                          that reflect how your documentation is structured.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-10 -mx-4 lg:mt-0 uil-ta-center">
                <img
                  className="relative mx-auto rounded-lg shadow-lg image-rendering-crisp"
                  src={withBaseUrl(
                    `img/assets/${
                      colorMode === 'dark'
                        ? 'docsearch-shadow-dark'
                        : 'docsearch-shadow'
                    }.png`
                  )}
                  alt="docsearch-modal"
                />
              </div>
            </div>

            <div className="relative mt-12 md:mt-16 lg:mt-24">
              <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div className="lg:col-start-2">
                  <ul className="mt-10">
                    <li>
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="lightning-bolt w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg leading-6 font-medium">
                            Inputs and shortcuts
                          </h5>
                          <p className="mt-2 text-base leading-6 text-description">
                            It looks almost similar to a search input but it's a
                            button. When you click/touch or use the keyboard
                            shortcut, it opens a modal dropdown and focuses the
                            search input.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="mt-10">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                            <svg
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="arrows-expand w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h5 className="text-lg leading-6 font-medium">
                            Always sized and positioned correctly
                          </h5>
                          <p className="mt-2 text-base leading-6 text-description">
                            The modal experience leverages behavior of most
                            popular Integrated Developement Environements (IDEs)
                            or native experience on mobile. An opaque layer is
                            making sure we keep the context of the documentation
                            but remove all visual pollution.
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-10 -mx-4 lg:mt-0 lg:col-start-1 uil-ta-center">
                  <img
                    className="relative mx-auto"
                    width="490"
                    src={withBaseUrl('img/assets/anatomy.svg')}
                    alt="anatomy-of-docsearch"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Powered by Algolia */}
        <div className="py-16 bg-algolia overflow-hidden lg:py-24">
          <div className="text-center">
            <h3 className="mt-2 text-3xl leading-8 font-extrabold text-white tracking-tight md:text-4xl md:leading-10">
              Powered by Algolia
            </h3>
          </div>
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="relative">
                <ul className="mt-10">
                  <li className="mt-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-algolia">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="chip w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h5 className="text-lg leading-6 font-medium text-white">
                          Highly efficient
                        </h5>
                        <p className="mt-2 text-base leading-6 text-gray-300">
                          Most of our search queries take less than 20ms, so
                          Algolia can run a new search on every keystroke and
                          instantly highlight relevant content to your users.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="mt-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md  bg-white text-algolia">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="chat w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h5 className="text-lg leading-6 font-medium text-white">
                          Search as you type
                        </h5>
                        <p className="mt-2 text-base leading-6 text-gray-300">
                          Instantly magnify relevant content to your users from
                          the first keystroke, thanks to Algolia speed.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="relative">
                <ul className="mt-10">
                  <li className="mt-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-algolia">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="backspace w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h5 className="text-lg leading-6 font-medium text-white">
                          Detailed and straightforward analytics
                        </h5>
                        <p className="mt-2 text-base leading-6 text-gray-300">
                          Use our analytics to keep an eye on your search
                          performance and to make sure that your users are
                          finding what they're searching for.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="mt-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-algolia">
                          <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="chart-bar w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h5 className="text-lg leading-6 font-medium text-white">
                          Typo tolerant
                        </h5>
                        <p className="mt-2 text-base leading-6 text-gray-300">
                          Algolia knows what your users mean to search for right
                          out-of-the-box, so they won't be spending time
                          correcting typos.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="py-16 lg:py-24">
          <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight md:text-4xl md:leading-10">
                It's all about keyboards
              </h3>
              <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-description lg:mx-auto">
                Once users become familiar with a system they will become better
                and faster at doing what they need to. DocSearch offers
                accelerators to experts.
              </p>
              <div className="pt-12 items-center justify-center flex">
                <img
                  className="w-full max-w-4xl image-rendering-pixel"
                  src={withBaseUrl('img/assets/keyboard.png')}
                  alt="keyboard-shortcuts"
                />
              </div>
            </div>

            <div className="pt-16 w-5/6 mx-auto">
              <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
                <li>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium">
                        Keyboard Shortcut & Navigation
                      </h4>
                      <p className="mt-2 text-base leading-6 text-description">
                        We aim at keeping the experience as smooth as your
                        interaction with an IDE, which explains the Ctrl+K (⌘+K
                        on macOS) keyboard shortcut to open the search modal.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-10 md:mt-0">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-algolia text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium">
                        Accessibility
                      </h4>
                      <p className="mt-2 text-base leading-6 text-description">
                        We have released this version with our best efforts on
                        addressing accessibility issues and we are willing to
                        make further changes. We'd like to work closely with an
                        expert in accessibility. Please contact us if you are
                        interested.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div id="tailwind">
      <Header />
      <Description />
    </div>
  );
}

export default Home;
