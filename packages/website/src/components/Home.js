import { useColorMode } from '@docusaurus/theme-common';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React from 'react';

import { Button, PrimaryButton } from './ui/button';
import { FeaturesBento } from './ui/features-bento';
import { FlipWords } from './ui/flip-words';
import Keyboard from './ui/keyboard';
import { Logos } from './ui/logos';
import { Spotlight } from './ui/spotlight';

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
      <div className="mt-20 mb-10 snap-start">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60 z-[10]" fill="white" />
        <div className="flex flex-col items-center rounded-md p-10 pb-0">
          <div className="text-center font-[Sora] text-black dark:text-white">
            <p className="text-center text-4xl font-bold bg-gradient-to-tl from-neutral-900 to-neutral-600 md:text-8xl dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 bg-clip-text text-transparent">
              Search Made For Documentation
            </p>
            <p className="text-base md:text-2xl">
              DocSearch by Algolia makes your docs and blogs instantly searchable—
              <span className="font-black">for free</span>.
            </p>
          </div>
          <div className="flex my-12 gap-8">
            <Button key="get-started" href={withBaseUrl('docs/what-is-docsearch')}>
              Get started
            </Button>
            <PrimaryButton key="apply" href={'https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch'}>
              Apply
            </PrimaryButton>
          </div>
          <div className="w-full">
            <video
              className="bg-blue-100 w-4xl mx-auto h-auto rounded-md"
              loop={true}
              muted={true}
              playsInline={true}
              autoPlay={true}
              preload="auto"
              poster="/img/resources/hero-video-poster.png"
            >
              <source src="/img/resources/askai720p.mp4" type="video/mp4" />
              <track kind="captions" />
            </video>
          </div>
        </div>
      </div>
    );
  }

  function Description() {
    return (
      <>
        {/* Showcase */}
        <div className="py-16 overflow-hidden snap-start">
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="max-w-screen-xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-3xl text-black dark:text-white font-bold leading-9 font-[Sora] md:text-4xl md:leading-10">
                  Already trusted by your favorite docs
                </p>
                <p className="text-lg md:text-2xl text-slate-400 dark:text-slate-500">
                  Join 7,000+ projects finding answers in milliseconds
                </p>
              </div>
            </div>
            <Logos />

            <div className="w-full flex justify-center">
              <a
                href="https://github.com/algolia/docsearch/network/dependents"
                rel="noreferrer"
                target="_blank"
                className="text-center text-lg text-slate-400 dark:text-slate-500"
              >
                ...And <span className="font-bold">much more!</span>
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16 overflow-hidden snap-start">
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="max-w-screen-xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-3xl text-black dark:text-white font-bold leading-9 font-[Sora] md:text-4xl md:leading-10">
                  Solve docs challenges with a search engine
                </p>
                <p className="text-lg md:text-2xl text-slate-400 dark:text-slate-500">
                  Docs are only helpful when your users can find answers easily. Enter DocSearch.
                </p>
              </div>
            </div>
            <FeaturesBento />
          </div>
        </div>

        <div className="py-16 overflow-hidden snap-start">
          <div className="relative max-w-xl mx-auto px-4 md:px-6 lg:px-8 lg:max-w-screen-xl">
            <div className="max-w-screen-xl mx-auto mb-16 px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4">
                <Keyboard />
                <br />
                <br />
                <p className="text-3xl text-black dark:text-white font-bold leading-9 font-[Sora] md:text-4xl md:leading-10">
                  Build{' '}
                  <FlipWords
                    className="text-blue-600"
                    words={['faster', 'smarter', 'freely', 'simpler', 'better', 'everything', 'NOW!']}
                  />{' '}
                  <br />
                  with DocSearch
                </p>
                <PrimaryButton key="apply" href={'https://dashboard.algolia.com/users/sign_up?selected_plan=docsearch'}>
                  Apply Now
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div id="tailwind" className="container snap-y z-[10] snap-proximity">
        <Header />
        <Description />
      </div>
    </>
  );
}

export default Home;
