import React from 'react';

// Logo metadata with direct links.
const logos = [
  { alt: 'Angular', src: 'img/usage-logos/angular.svg', width: 158, href: 'https://angular.dev/' },
  { alt: 'Astro', src: 'img/usage-logos/astro.svg', width: 158, href: 'https://astro.build/' },
  {
    alt: 'Bootstrap',
    src: 'img/usage-logos/bootstrap.svg',
    width: 158,
    href: 'https://getbootstrap.com/docs/5.2/getting-started/introduction/',
  },
  {
    alt: 'Chromium Developers',
    src: 'img/usage-logos/chrome.svg',
    width: 158,
    href: 'https://www.chromium.org/developers/',
  },
  { alt: 'Discord', src: 'img/usage-logos/discord.svg', width: 120, href: 'https://discord.com/developers/docs/intro' },
  { alt: 'Docusaurus', src: 'img/usage-logos/docusaurus.svg', width: 158, href: 'https://docusaurus.io/' },
  { alt: 'Expo', src: 'img/usage-logos/expo.svg', width: 158, href: 'https://docs.expo.dev/' },
  { alt: 'Helm', src: 'img/usage-logos/helm.svg', width: 158, href: 'https://docs.helm.sh/docs/' },
  { alt: 'Homebrew', src: 'img/usage-logos/homebrew.svg', width: 158, href: 'https://brew.sh/' },
  { alt: 'Laravel', src: 'img/usage-logos/laravel.svg', width: 158, href: 'https://laravel.com/docs/master' },
  { alt: 'Jest', src: 'img/usage-logos/jest.svg', width: 158, href: 'https://jestjs.io/' },
  { alt: 'MarkDoc', src: 'img/usage-logos/markdoc.svg', width: 158, href: 'https://markdoc.io/' },
  { alt: 'Material UI', src: 'img/usage-logos/material-ui.svg', width: 158, href: 'https://material-ui.com/' },
  { alt: 'React', src: 'img/usage-logos/react.svg', width: 158, href: 'https://react.dev/' },
  { alt: 'Remix', src: 'img/usage-logos/remix.svg', width: 158, href: 'https://remix.run/docs' },
  { alt: 'Scala', src: 'img/usage-logos/scala.svg', width: 158, href: 'https://docs.scala-lang.org/' },
  { alt: 'Snap Developers', src: 'img/usage-logos/snapchat.svg', width: 158, href: 'https://developers.snap.com/' },
  { alt: 'Tailwind CSS', src: 'img/usage-logos/tailwind.svg', width: 158, href: 'https://tailwindcss.com/' },
  { alt: 'Twilio', src: 'img/usage-logos/twilio.svg', width: 158, href: 'https://www.twilio.com/docs' },
  { alt: 'Typescript', src: 'img/usage-logos/typescript.svg', width: 158, href: 'https://www.typescriptlang.org/' },
  { alt: 'Vite', src: 'img/usage-logos/vite.svg', width: 158, href: 'https://vitejs.dev/' },
  { alt: 'VitePress', src: 'img/usage-logos/vitepress.svg', width: 158, href: 'https://vitepress.dev/' },
  { alt: 'Vue', src: 'img/usage-logos/vue.svg', width: 158, href: 'https://v3.vuejs.org/' },
  { alt: 'WebPack', src: 'img/usage-logos/webpack.svg', width: 158, href: 'https://webpack.js.org/concepts/' },
];

export const Logos = () => {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="-mx-6 grid grid-cols-3 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-4">
          {logos.map(({ alt, src, width, href }) => (
            <a
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-400/7 dark:bg-xenon-900 p-6 sm:p-10 flex flex-col items-center justify-center transition-all duration-200 motion-reduce:duration-0 cursor-pointer inset-shadow-none hover:inset-shadow-sm hover:bg-blue-400/40 !no-underline"
            >
              <img alt={alt} src={src} width={width} height={48} className="max-h-12 w-full object-contain" />
              <span className="mt-4 text-sm font-medium text-zinc-400 dark:text-slate-200 !no-underline">{alt}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
