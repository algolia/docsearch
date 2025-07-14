import React from 'react';

export const Button = ({ children, href, className = '', ...props }) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      {...props}
      {...(href ? { href } : { type: 'button' })}
      className={`relative cursor-pointer no-underline! h-12 text-sm overflow-hidden rounded flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 px-5 py-2.5 text-black dark:text-white transition-all! duration-300! ring-1 ring-neutral-100 dark:ring-neutral-800 ring-offset-3 dark:ring-offset-neutral-900 hover:bg-neutral-200 hover:dark:bg-neutral-700 hover:ring-2 hover:ring-neutral-200 hover:dark:ring-neutral-700 font-[Sora] hover:ring-offset-4 w-[10rem] ${className}`}
    >
      <span className="relative">{children}</span>
    </Component>
  );
};

export const PrimaryButton = ({ children, href, className = '', ...props }) => {
  const Component = href ? 'a' : 'button';

  return (
    <Component
      {...props}
      {...(href ? { href } : { type: 'button' })}
      className={`relative cursor-pointer no-underline! h-12 overflow-hidden text-sm rounded flex items-center justify-center font-[Sora] bg-gradient-to-tl from-blue-500 via-blue-600 to-blue-700 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 ring-1 ring-blue-300 dark:ring-blue-400 ring-offset-3 px-5 py-2.5 text-white! dark:ring-offset-neutral-900 transition-all! duration-300! hover:bg-blue-800 hover:dark:bg-blue-700 hover:ring-2 hover:ring-blue-800 hover:dark:ring-blue-700 hover:ring-offset-4 w-[10rem] ${className}`}
    >
      <span className="relative">{children}</span>
    </Component>
  );
};
