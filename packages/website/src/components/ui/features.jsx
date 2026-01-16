import React, { useCallback } from 'react';

const mcpSteps = [
  { id: 'signup', text: 'Sign up with Algolia or use an existing app' },
  { id: 'navigate', text: 'Go to the MCP section under Generative AI' },
  { id: 'create', text: 'Create a new MCP server with your index' },
  { id: 'use', text: 'Use it anywhere' },
];

export const IntroducingSection = () => {
  const handleTryAskAI = useCallback(() => {
    const sidepanelButton = document.querySelector('.DocSearch-SidepanelButton');
    if (sidepanelButton) {
      sidepanelButton.click();
    }
  }, []);

  return (
    <div className="py-16 overflow-hidden snap-start">
      <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
        {/* Section Header */}
        <div className="max-w-screen-xl mx-auto mb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-3xl text-black dark:text-white font-bold leading-9 font-[Sora] md:text-4xl md:leading-10">
              Expand your Docs beyond the search box
            </p>
            <p className="text-lg md:text-2xl text-slate-400 dark:text-slate-500">Power your documentation with AI</p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Ask AI Card */}
          <div className="relative rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white font-[Sora]">Ask AI</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get instant, AI-powered answers from your documentation. Ask natural language questions and receive
              accurate, context-aware responses.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-sm font-medium transition-all cursor-pointer"
                onClick={handleTryAskAI}
              >
                Try now
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                  />
                </svg>
              </button>
              <a
                href="/docs/v4/askai?utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=askai"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium no-underline!"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* MCP Card */}
          <div className="relative rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white font-[Sora]">MCP Server</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Connect your documentation to AI assistants like Claude and Cursor with the Model Context Protocol.
            </p>
            <div className="space-y-2 mb-4">
              {mcpSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{step.text}</span>
                </div>
              ))}
            </div>
            <a
              href="https://www.algolia.com/doc/guides/algolia-ai/mcp-server/overview?utm_source=docsearch.algolia.com&utm_medium=referral&utm_campaign=mcp"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium no-underline!"
            >
              Learn more
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
