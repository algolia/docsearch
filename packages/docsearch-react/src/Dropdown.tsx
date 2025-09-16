import type { PropsWithChildren, JSX, ButtonHTMLAttributes } from 'react';
import React from 'react';

const DropdownContext = React.createContext({
  open: false,
  setOpen: (_open: boolean) => {},
});

export function Dropdown({ children }: PropsWithChildren): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function close(e): void {
      if (!dropdownRef.current?.contains(e.target)) {
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
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={dropdownRef} className="Dropdown">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

type DropdownButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function DropdownButton({ children, className = '' }: PropsWithChildren<DropdownButtonProps>): JSX.Element {
  const { open, setOpen } = React.useContext(DropdownContext);

  function toggleOpen(): void {
    setOpen(!open);
  }

  return (
    <button type="button" className={`Dropdown--Button ${className}`} onClick={() => toggleOpen()}>
      {children}
    </button>
  );
}

Dropdown.Button = DropdownButton;

function DropdownContent({ children }: PropsWithChildren): JSX.Element {
  const { open } = React.useContext(DropdownContext);

  return <div className={`Dropdown--Content${open ? ' open' : ''}`}>{children}</div>;
}

Dropdown.Content = DropdownContent;

type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

function DropdownItem({
  children,
  className = '',
  onClick,
  ...props
}: PropsWithChildren<DropdownItemProps>): JSX.Element {
  const { setOpen } = React.useContext(DropdownContext);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e): void => {
    if (onClick) {
      onClick(e);
      setOpen(false);
    }
  };
  return (
    <button type="button" className={`Dropdown--Item ${className}`} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}

Dropdown.Item = DropdownItem;
