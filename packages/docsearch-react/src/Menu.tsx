import type { PropsWithChildren, JSX, ButtonHTMLAttributes } from 'react';
import React from 'react';

const MenuContext = React.createContext({
  open: false,
  setOpen: (_open: boolean) => {},
});

export function Menu({ children }: PropsWithChildren): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function close(e): void {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener('click', close);
    }

    return function removeListener(): void {
      window.removeEventListener('click', close);
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="DocSearch-Menu">
        {children}
      </div>
    </MenuContext.Provider>
  );
}

type MenuTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

function MenuTrigger({ children, className = '' }: PropsWithChildren<MenuTriggerProps>): JSX.Element {
  const { open, setOpen } = React.useContext(MenuContext);

  function toggleOpen(): void {
    setOpen(!open);
  }

  return (
    <button type="button" className={`DocSearch-Menu-trigger ${className}`} onClick={() => toggleOpen()}>
      {children}
    </button>
  );
}

Menu.Trigger = MenuTrigger;

function MenuContent({ children }: PropsWithChildren): JSX.Element {
  const { open } = React.useContext(MenuContext);

  return <div className={`DocSearch-Menu-content${open ? ' open' : ''}`}>{children}</div>;
}

Menu.Content = MenuContent;

type MenuItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

function MenuItem({ children, className = '', onClick, ...props }: PropsWithChildren<MenuItemProps>): JSX.Element {
  const { setOpen } = React.useContext(MenuContext);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e): void => {
    if (onClick) {
      onClick(e);
      setOpen(false);
    }
  };
  return (
    <button type="button" className={`DocSearch-Menu-item ${className}`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

Menu.Item = MenuItem;
