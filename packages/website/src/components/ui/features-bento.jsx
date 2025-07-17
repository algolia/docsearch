import React from 'react';

export const FeaturesBento = () => {
  return (
    <div className="pb-8">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg dark:bg-gray-400/7 bg-white max-lg:rounded-t-4xl lg:rounded-tl-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
              <img alt="" src="/img/resources/docs.png" className="h-80 object-cover object-left" />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold text-blue-600 font-[Sora] dark:text-white my-4">Made for docs</p>
                <p className="mt-2 max-w-lg text-base text-gray-600 dark:text-slate-100">
                  DocSearch is purpose-built to index and surface technical content, from API references to how-tos. It
                  understands code snippets, tables, and markdown structures so your users get pinpoint answers every
                  time.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl lg:rounded-tl-4xl" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg dark:bg-gray-400/7 bg-white lg:rounded-tr-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
              <img
                alt=""
                src="/img/resources/ai-powered.png"
                className="h-80 object-cover object-left lg:object-right"
              />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold text-blue-600 font-[Sora] dark:text-white my-4">AI-powered</p>
                <p className="mt-2 max-w-lg text-base text-gray-600 dark:text-slate-100">
                  Leveraging Algolia Ask AI, DocSearch interprets natural-language queries, suggests synonyms, and ranks
                  results by relevance. It turns even complex developer questions into instant, context-aware answers.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl" />
          </div>

          <div className="relative lg:col-span-6">
            <div className="absolute inset-0 rounded-lg dark:bg-gray-400/7 bg-white" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
              <img alt="" src="/img/resources/powered-by-algolia.png" className="h-80 object-cover" />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold text-blue-600 font-[Sora] dark:text-white my-4">
                  Powered by Algolia
                </p>
                <p className="mt-2 text-base text-gray-600 dark:text-slate-100">
                  Built & deployed on Algolia’s global search infrastructure, DocSearch delivers sub-20 ms replies at
                  any scale. Enjoy 99.99% uptime and auto-scaled capacity without lifting a finger—your docs stay
                  lightning-fast, always.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5" />
          </div>
          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg dark:bg-gray-400/7 bg-white lg:rounded-bl-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-bl-[calc(2rem+1px)]">
              <img
                alt=""
                src="img/resources/customizable-light.png"
                className="h-80 object-cover object-left hidden dark:block"
              />
              <img
                alt=""
                src="img/resources/customizable-dark.png"
                className="h-80 object-cover object-left dark:hidden"
              />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold text-blue-600 font-[Sora] dark:text-white my-4">Customizable</p>
                <p className="mt-2 max-w-lg text-base text-gray-600 dark:text-slate-100">
                  Tailor DocSearch to match your brand and UX needs—colors, fonts, layouts, and even search behaviors
                  are under your control. Drop-in CSS variables and simple JS hooks make it effortless to blend search
                  seamlessly into any docs site.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-bl-4xl" />
          </div>

          <div className="relative lg:col-span-3">
            <div className="absolute inset-0 rounded-lg dark:bg-gray-400/7 bg-white max-lg:rounded-b-4xl lg:rounded-br-4xl" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-br-[calc(2rem+1px)]">
              <img alt="" src="/img/resources/accessible.png" className="h-80 object-cover" />

              <div className="p-10 pt-4">
                <p className="text-xl font-semibold text-blue-600 font-[Sora] dark:text-white my-4">A11y</p>
                <p className="mt-2 max-w-lg text-base text-gray-600 dark:text-slate-100">
                  DocSearch follows WAI-ARIA best practices to ensure full keyboard, screen-reader, and voice-control
                  support. Delight every user with an inclusive search experience that’s tested against WCAG 2.1
                  standards.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-br-4xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
