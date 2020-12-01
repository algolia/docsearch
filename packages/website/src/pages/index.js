import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import React from 'react';

import ApplyForm from '../components/ApplyForm.js';
import { DocSearchLogo } from '../components/DocSearchLogo';

import showcaseProjects from './showcase-projects.json';

import 'tailwindcss/tailwind.css';

function Home() {
  const { withBaseUrl } = useBaseUrlUtils();

  return (
    <>
      <div className="pb-16 relative overflow-hidden">
        <div className="relative">
          <main className="flex mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
            <div className="mt-24">
              <img src={withBaseUrl('img/algolia-logo.svg')} width="140" />
              <div className="mt-6">
                <DocSearchLogo width="430px" />
              </div>
              <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                The best search experience for docs, integrated in minutes, for
                free
              </p>
              <div className="mt-5 float-left sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </a>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    Live demo
                  </a>
                </div>
              </div>
            </div>
            <div className="pl-6">
              <img src={withBaseUrl('img/assets/tailwind.png')} width="600" />
            </div>
          </main>
        </div>
      </div>

      <div className="py-16 overflow-hidden">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
          <div className="relative">
            <h3 className="dark:text-red-900 text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Solve docs challenges with a search engine
            </h3>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl leading-7 text-gray-500">
              Reducing users’ efforts to get started on your product or to
              resolve problems is the trick to smooth the learning curve.
              DocSearch brings relevancy to the fingers of your users.
            </p>
          </div>

          <div className="pt-12">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-screen-xl lg:px-8">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                  <div className="mt-5">
                    <h5 className="text-lg leading-6 font-medium text-gray-900">
                      Respect users efforts
                    </h5>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      First built to fulfill our own developers' needs,
                      DocSearch quickly evolved as a successful community
                      project. Over the years, the project kept on adressing the
                      complex challenge of search for the open source community.
                    </p>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      Our team is now collecting feeback and PR from major docs
                      maintainers to provide the best relevancy and end-user
                      interface.
                    </p>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                  <div className="mt-5">
                    <h5 className="text-lg leading-6 font-medium text-gray-900">
                      Speak to all users
                    </h5>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      Documentation involves communicating complex information
                      to every audience with clarity and accuracy. It’s a
                      conversation which is a term for two-sided interactions.
                    </p>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      DocSearch understands your data, the user input, the
                      context and sends back instantly a fine selection of your
                      content available with less interactions than any other
                      method.
                    </p>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                  <div className="mt-5">
                    <h5 className="text-lg leading-6 font-medium text-gray-900">
                      Eliminate confusion
                    </h5>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      Overall consistency appearance and functional behavior is
                      essential.
                    </p>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      With a design very close to the native experience on
                      mobile, we leverage users acquaintance with the
                      interaction patterns of each OS.
                      <br />
                      As documentation users are expected to search your docs
                      from different devices, DocSearch ensures similar
                      experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 overflow-hidden">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
          <div className="">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xlleading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
                  Already trusted by your favorite docs
                </h2>
              </div>
            </div>
            <div className="pt-4 pb-12 sm:pb-16">
              <div className="relative">
                <div className="absolute inset-0 h-1/2 bg-gray-50"></div>
                <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto">
                    <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                      <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                        <dt
                          className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500"
                          id="item-1"
                        >
                          Free
                        </dt>
                        <dd
                          className="order-1 text-5xl leading-none font-extrabold text-indigo-600"
                          aria-describedby="item-1"
                        >
                          100%
                        </dd>
                      </div>
                      <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                          Searches per month
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                          75M
                        </dd>
                      </div>
                      <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                          DocSearch Live
                        </dt>
                        <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                          3500
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-0.5 md:grid-cols-6 lg:mt-0 lg:grid-cols-8">
              {showcaseProjects.map(({ name, href, image }) => (
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
                    <div className="uppercase text-gray-500 text-xs py-2">
                      {name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="diagonal-box py-16 bg-gray-200 overflow-hidden">
        <div className="diagonal-content max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
          <div className="max-w-screen-xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
                Out of the box
              </p>
              <h2 className="text-3xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
                How it works
              </h2>
              <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
                We scrap your documentation, configure the Algolia index and
                send you the snippet you'll have to integrate.
              </p>
            </div>
          </div>

          <div className="py-12">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:max-w-screen-lg lg:px-8 ">
              <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <div className="flex items-center justify-center">
                    <img
                      className="h-200"
                      src={withBaseUrl('img/assets/scraping.svg')}
                      width="190px"
                    />
                  </div>
                  <div className="mt-10 lg:mt-0 p-4">
                    <h5 className="text-lg leading-6 font-medium text-gray-900">
                      1. Scraping
                    </h5>
                    <p className="mt-2 text-base leading-6 text-gray-600">
                      We built a website crawler designed to index every section
                      of your documentation. Just send us the URL of your
                      documentation, and we’ll run the scraper every 24h so
                      you’re always up-to-date.
                    </p>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 p-4">
                  <div className="h-200 flex items-center justify-center">
                    <img
                      src={withBaseUrl('img/assets/configuration.svg')}
                      width="140px"
                    />
                  </div>
                  <div>
                    <h5 className="text-lg leading-6 font-medium text-gray-900">
                      2. Configuration
                    </h5>
                    <p className="mt-2 text-base leading-6 text-gray-600">
                      You don’t need to configure any settings or even have an
                      Algolia account. We take care of this automatically to
                      ensure the best documentation search experience.
                    </p>
                  </div>
                </div>
                <div className="mt-10 lg:mt-0 p-4">
                  <div className="h-200 flex items-center justify-center">
                    <img
                      src={withBaseUrl('img/assets/implementation.svg')}
                      width="220px"
                    />
                  </div>
                  <div>
                    <h5 className="text-lg leading-6 font-medium text-gray-900">
                      3. Implementation
                    </h5>
                    <p className="mt-2 text-base leading-6 text-gray-600">
                      We'll send you a script that integrates Algolia's
                      autocomplete to power your search. You will receive the
                      same speed, relevance, and best-in-class UX as our paying
                      customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h4 className="text-2xl leading-8 font-extrabold text-gray-900 tracking-tight sm:text-3xl sm:leading-9">
                Anatomy of DocSearch
              </h4>
              <p className="mt-3 text-lg leading-7 text-gray-500">
                Search is a conversation so we used a modal dialog to ask for
                information that, when provided, significantly lessen users’
                effort to navigate through the results. It gives space for the
                rendering so we could improve the content grouping.
              </p>

              <ul className="mt-10">
                <li>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                      <h5 className="text-lg leading-6 font-medium text-gray-900">
                        All featured search box
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-500">
                        The conversation start here: you want to have the
                        state-of-the-art search box to represent your voice.
                        DocSearch comes with our extensive experience in making
                        this search box respects all the best practices.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                      <h5 className="text-lg leading-6 font-medium text-gray-900">
                        {'Hierarchical display'}
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-500">
                        When displaying the results it's important to get a
                        sense of the documentation structure. DocSearch split
                        your content in small chunks and the UI is returning
                        this information to the user
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-10 -mx-4 lg:mt-0">
              <img
                className="relative mx-auto"
                width="490"
                src={withBaseUrl('img/assets/docsearch-shadow.png')}
                alt=""
              />
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <ul className="mt-10">
                  <li>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                        <h5 className="text-lg leading-6 font-medium text-gray-900">
                          Search shortcut
                        </h5>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          It looks almost similar to a search input but it’s a
                          button. When you click/touch or use the keyboard
                          shortcut, it opens a modal dropdown and focuses the
                          real search input.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="mt-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                        <h5 className="text-lg leading-6 font-medium text-gray-900">
                          Always sized and positionned correctly
                        </h5>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          The modal experience leverages behavior of most
                          populars Integrated Developement Environements or
                          native experience on mobile. An opaque layer is making
                          sure we keep the context of the documentation but
                          remove all visual pollution.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-10 -mx-4 lg:mt-0 lg:col-start-1">
                <img
                  className="relative mx-auto"
                  width="490"
                  src={withBaseUrl('img/assets/anatomy.svg')}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-indigo-600 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h4 className="text-2xl leading-8 font-extrabold text-white tracking-tight sm:text-3xl sm:leading-9">
                Powered by Algolia
              </h4>
              <p className="mt-3 text-lg leading-7 text-gray-300">
                Algolia is a search API that gives engineering teams a complete
                toolkit for adding search to their products with minimal
                development time.
              </p>
              <ul className="mt-10">
                <li>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-indigo-500">
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
                        Fast & Relevant
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-300">
                        Most of our search queries take take less than 20ms to
                        be processed.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md  bg-white text-indigo-500">
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
                <li className="mt-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-indigo-500">
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
                        Typo Tolerant
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-300">
                        Deliver relevant results, regardless of user errors with
                        robust, out-of-the-box typo tolerance.
                      </p>
                    </div>
                  </div>
                </li>
                <li className="mt-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white text-indigo-500">
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
                        Powerful analytics
                      </h5>
                      <p className="mt-2 text-base leading-6 text-gray-300">
                        Undertstand how your search performs with specialized
                        search metrics and ensure that your users are able to
                        find what they’re searching for.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0">
              <img
                className="relative mx-auto"
                width="490"
                src={withBaseUrl('img/assets/undraw_algolia_msba.svg')}
                alt=""
              />
              <p className="mt-3 leading-7 text-gray-300 px-24">
                Our SaaS platform removes complexities of building and
                integrating search technology while focusing on great developer
                experience. We take care of the infrastructure and API clients,
                provide extensive documentation, tooling and support, and have a
                highly specialized team entirely dedicated to security.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
              Accelerators
            </p>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              It’s All About Keyboards!
            </h3>
            <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
              Once users become familiar with a system they will become better
              and faster at doing what they need to. DocSearch offers
              accelerators to experts.
            </p>
            <div className="pt-12 items-center justify-center flex">
              <img
                className="w-full max-w-4xl"
                src={withBaseUrl('img/assets/keyboard.png')}
              />
            </div>
          </div>

          <div className="pt-16 w-5/6 mx-auto">
            <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
              <li>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                    <h4 className="text-lg leading-6 font-medium text-gray-900">
                      Keyboard Shortcut & Navigation
                    </h4>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      A great search experience must be possible by using a
                      keyboard only. DocSearch V3, one only needs a keyboard to
                      discover the documentation. We aim at keeping the
                      experience as smooth as your interaction with an IDE,
                      which explains the new Ctrl+K (⌘+K on macOS) keyboard
                      shortcut to open the search modal.
                    </p>
                  </div>
                </div>
              </li>
              <li className="mt-10 md:mt-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                    <h4 className="text-lg leading-6 font-medium text-gray-900">
                      Accessibility
                    </h4>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      We are releasing this version with our best efforts in
                      regards to accessibility and we are willing to go deeper.
                      We'd like to work closely with disabled users, expert of
                      the topic and other misrepresented minorities. Please
                      contact us.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-12 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-200 py-10">
          <div className="lg:text-center">
            <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
              Respect users efforts
            </p>

            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Full Featured User Experience
            </h3>

            <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
              Search is a path to some other purpose, rather than a target in
              itself. When developers are searching for knowledge, they do not
              want their flow of thinking disrupted by an intrusive interface.
              Keep It Simple.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap flex-row">
            <div className="w-full md:w-3/6 lg:w-4/6 mt-5 bg-indigo-800 p-4">
              <h4 className="relative text-lg leading-6 font-medium text-white">
                Recent searches & Favorites
              </h4>
              <p className="mt-2 max-w-1xl text-gray-500 lg:mx-auto">
                You can now view recent searches and save them to your favorite
                searches.
              </p>
              <img
                className="w-8/12 mx-auto my-6"
                src={withBaseUrl('img/assets/docsearch-shadow-dark.png')}
              />
            </div>
            <div className="flex flex-col w-full md:w-3/6 lg:w-2/6 mt-5 md:pl-5 min-h-500">
              <div className="relative h-full w-full bg-gray-500 p-4 overflow-hidden">
                <h4 className="relative text-lg leading-6 font-medium text-gray-800 z-10">
                  No Results
                </h4>
                <p className="relative z-10 mt-2 max-w-1xl text-gray-900 lg:mx-auto">
                  Clearly states that there are no results, and offers
                  suggestions for next steps.
                </p>
                <img
                  className="right-0 left-0 absolute bottom-0 z-0"
                  src={withBaseUrl('img/assets/no-results.png')}
                />
              </div>
              <div className="h-full flex-shrink w-full mt-5 bg-white relative overflow-hidden  p-4">
                <h4 className="relative text-lg leading-6 font-medium text-white z-10">
                  Offline Support
                </h4>
                <p className="relative z-10 mt-2 max-w-1xl text-gray-900 lg:mx-auto">
                  DocSearch detects networks are on low conditions or just not
                  available and display data according to your network state.
                </p>
                <img
                  className="w-full absolute bottom-0 right-0 z-0"
                  src={withBaseUrl('img/assets/offline.png')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase"></p>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl sm:leading-10">
              For developers
            </h3>
            <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
              Selecting technologies means committing to solutions that will
              support an active and growing project over the long term.
            </p>
          </div>

          <div className="mt-16">
            <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
              <li>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                    <h4 className="text-lg leading-6 font-medium text-white">
                      Lightweight
                    </h4>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      Although this new version provides more features, the
                      bundle is lightweight and compatible with lazy loading.
                      Only the code for the search button is loaded, until the
                      user is about to interact with the whole search
                      experience.
                    </p>
                  </div>
                </div>
              </li>
              <li className="mt-10 md:mt-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                    <h4 className="text-lg leading-6 font-medium text-white">
                      React components
                    </h4>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      DocSearch v3 has been rewritten in React, and now exposes
                      React components. Vanilla JavaScript version is based on
                      this React version with an alias to Preact.
                    </p>
                  </div>
                </div>
              </li>
              <li className="mt-10 md:mt-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg leading-6 font-medium text-white">
                      Open source
                    </h4>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      DocSearch is relying on our search engine service:
                      Algolia’s API and everything we’ve built around for
                      DocSearch is open sourced. The front-end UI and the
                      scrapper are developed directly on GitHub for and with the
                      community. We think transparency is key for a good
                      relation and a good product.
                    </p>
                  </div>
                </div>
              </li>
              <li className="mt-10 md:mt-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg leading-6 font-medium text-white">
                      Modularity of Autocomplete.js
                    </h4>
                    <p className="mt-2 text-base leading-6 text-gray-500">
                      Developers can introduce custom behavior between the core
                      of DocSearch and the renderer. The latest version of
                      Autocomplete.js is providing better accessibility,
                      increased responsiveness, themability, a better built-in
                      design, and customizability under low-network conditions.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <img
              className="mt-16 w-4/6 mx-auto"
              src={withBaseUrl('img/assets/developers.png')}
            />
          </div>
        </div>
      </div>
      <div className="my-12">
        <ApplyForm />
      </div>
    </>
  );
}

function HomePage() {
  return (
    <Layout
      title="DocSearch: Search made for documentation"
      description="The easiest way to add search to your documentation - Powered by Algolia"
    >
      <Home />
    </Layout>
  );
}

export default HomePage;
