import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React from 'react';

export function Menu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root {...props} />;
}

function MenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  const cn = `DocSearch-Menu-Trigger${className ? ` ${className}` : ''}`;
  return <MenuPrimitive.Trigger className={cn} {...props} />;
}

Menu.Trigger = MenuTrigger;

type MenuPopupProps = MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Portal.Props, 'container'> &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'collisionBoundary' | 'side' | 'sideOffset'>;

function MenuPopup({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  collisionBoundary = 'clipping-ancestors',
  container,
  ...props
}: MenuPopupProps) {
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

function MenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup {...props} />;
}

Menu.RadioGroup = MenuRadioGroup;

function MenuRadioItem({ className, ...props }: MenuPrimitive.RadioItem.Props) {
  const cn = `DocSearch-Menu-RadioItem${className ? ` ${className}` : ''}`;
  return <MenuPrimitive.RadioItem className={cn} closeOnClick={true} {...props} />;
}

Menu.RadioItem = MenuRadioItem;

function MenuRadioItemIndicator({ className, ...props }: MenuPrimitive.RadioItemIndicator.Props) {
  const cn = `DocSearch-Menu-RadioItem-Indicator${className ? ` ${className}` : ''}`;
  return <MenuPrimitive.RadioItemIndicator className={cn} {...props} />;
}

Menu.RadioItemIndicator = MenuRadioItemIndicator;

function MenuGroupLabel({ className, ...props }: MenuPrimitive.GroupLabel.Props) {
  const cn = `DocSearch-Menu-GroupLabel${className ? ` ${className}` : ''}`;
  return <MenuPrimitive.GroupLabel className={cn} {...props} />;
}

Menu.GroupLabel = MenuGroupLabel;
