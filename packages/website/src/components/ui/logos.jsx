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
    <div className="pt-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-4">
          {logos.map(({ alt, src, width, href }) => (
            <a
              key={alt}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer flex-col items-center justify-center bg-[var(--surface)] p-6 transition-colors duration-200 !no-underline hover:bg-[var(--accent-light)] sm:p-10"
            >
              <img
                alt={alt}
                src={src}
                width={width}
                height={40}
                className="max-h-10 w-full object-contain opacity-80 transition-opacity hover:opacity-100"
              />
              <span className="mt-4 text-sm font-medium text-[var(--text-tertiary)] !no-underline">
                {alt}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
