import { useColorMode } from '@docusaurus/theme-common';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import React, { useRef, useState } from 'react';

import { Button, PrimaryButton } from './ui/button';
import { FeaturesBento } from './ui/features-bento';
import { FlipWords } from './ui/flip-words';
import Keyboard from './ui/keyboard';
import { Logos } from './ui/logos';
import { Spotlight } from './ui/spotlight';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VideoPlayer({ chapters }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);

  return (
    <div className="w-full">
      <video
        loop={true}
        muted={true}
        playsInline={true}
        autoPlay={true}
        ref={videoRef}
        className="bg-blue-100 w-4xl mx-auto h-auto rounded-md"
        preload="auto"
        poster="/img/resources/hero-video-poster.png"
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      >
        <source src="/img/resources/askai720p.mp4" type="video/mp4" />
        <track kind="captions" />
      </video>
      {/* Video chapter controls below video */}
      <div className="relative w-full max-w-2xl mx-auto mt-4">
        {/* Time labels */}
        <div className="flex justify-between text-xs text-slate-500 mt-8">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        {/* Progress bar */}
        <div
          className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative cursor-pointer"
          role="slider"
          tabIndex={0}
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
          onClick={(e) => {
            const bar = e.currentTarget;
            const rect = bar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = x / rect.width;
            if (videoRef.current && duration) {
              videoRef.current.currentTime = percent * duration;
            }
          }}
        >
          <div
            className="h-2 bg-blue-500 transition-all absolute top-0 left-0 rounded-full pointer-events-none"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {/* Chapter markers... */}
        </div>
        {/* Chapter buttons below the bar */}
        <div className="absolute left-0 w-full" style={{ top: '1.5rem' }}>
          {chapters.map((chapter) => (
            <div
              key={chapter.label}
              className="absolute flex flex-col items-center"
              style={{ left: `${(chapter.time / duration) * 100}%`, transform: 'translateX(-50%)' }}
            >
              {/* Arrow/triangle */}
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '8px solid #2563eb', // blue-600
                  marginBottom: '-2px',
                }}
              />
              {/* Button */}
              <button
                className="px-3 py-0.5 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-800 transition max-w-[120px] min-w-[60px] whitespace-normal break-words text-center"
                style={{ minWidth: 0 }}
                type="button"
                title={chapter.label}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = chapter.time;
                  }
                }}
              >
                {chapter.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { withBaseUrl } = useBaseUrlUtils();
  const { colorMode } = useColorMode();

  const videoChapters = [
    { label: 'Keyword', time: 9 },
    { label: 'Ask AI', time: 37 },
    { label: 'Conversations', time: 65 },
    { label: 'Dark Mode', time: 103 },
  ];

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
            <div className="flex items-center justify-center mb-2">
              <span role="img" aria-label="sparkles" className="mr-2 animate-pulse">
                ✨
              </span>
              <span className="text-blue-600 font-semibold text-lg md:text-xl shimmer-effect">
                Celebrating 10 Years of DocSearch
              </span>
              <span role="img" aria-label="sparkles" className="ml-2 animate-pulse">
                ✨
              </span>
            </div>
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
          <VideoPlayer chapters={videoChapters} />
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
                <div className="text-3xl text-black dark:text-white font-bold leading-9 font-[Sora] md:text-4xl md:leading-10">
                  Build{' '}
                  <FlipWords
                    className="text-blue-600"
                    words={['faster', 'smarter', 'freely', 'simpler', 'better', 'everything', 'NOW!']}
                  />{' '}
                  <br />
                  with DocSearch
                </div>
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
