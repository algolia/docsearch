import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { type JSX } from 'react';

import { CheckIcon } from '../../icons';

export function Menu({ ...props }: MenuPrimitive.Root.Props): JSX.Element {
  return <MenuPrimitive.Root {...props} />;
}

function MenuTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props): JSX.Element {
  const cn = `DocSearch-Menu-Trigger${className ? ` ${className}` : ''}`;
  return <MenuPrimitive.Trigger className={cn} {...props} />;
}

Menu.Trigger = MenuTrigger;

type MenuPopupProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Portal.Props, 'container'> &
  Pick<
    MenuPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'collisionBoundary' | 'side' | 'sideOffset'
  >;

function MenuPopup({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  collisionBoundary = 'clipping-ancestors',
  container,
  ...props
}: MenuPopupProps): JSX.Element {
  return (
    <MenuPrimitive.Portal container={container}>
      <MenuPrimitive.Positioner
        className="DocSearch-Menu-Positioner"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionBoundary={collisionBoundary}
      >
        <MenuPrimitive.Popup className="DocSearch-Menu-Popup" {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

Menu.Popup = MenuPopup;

function MenuRadioGroup({
  ...props
}: MenuPrimitive.RadioGroup.Props): JSX.Element {
  return <MenuPrimitive.RadioGroup {...props} />;
}

Menu.RadioGroup = MenuRadioGroup;

function MenuRadioItem({
  className,
  children,
  ...props
}: MenuPrimitive.RadioItem.Props): JSX.Element {
  const cn = `DocSearch-Menu-Item DocSearch-Menu-RadioItem${className ? ` ${className}` : ''}`;
  return (
    <MenuPrimitive.RadioItem className={cn} closeOnClick={true} {...props}>
      <span className="DocSearch-Menu-RadioItem-Indicator">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

Menu.RadioItem = MenuRadioItem;

function MenuGroupLabel({
  className,
  ...props
}: MenuPrimitive.GroupLabel.Props): JSX.Element {
  const cn = `DocSearch-Menu-GroupLabel${className ? ` ${className}` : ''}`;
  return <MenuPrimitive.GroupLabel className={cn} {...props} />;
}

Menu.GroupLabel = MenuGroupLabel;
