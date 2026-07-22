import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import React from 'react';

import { CloseIcon } from '../../icons';

export function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({
  className,
  ...props
}: PopoverPrimitive.Trigger.Props) {
  const cn = `DocSearch-Popover-Trigger${className ? ` ${className}` : ''}`;
  return <PopoverPrimitive.Trigger className={cn} {...props} />;
}

Popover.Trigger = PopoverTrigger;

type PopoverPopupProps = Pick<
  PopoverPrimitive.Positioner.Props,
  'align' | 'alignOffset' | 'collisionBoundary' | 'side' | 'sideOffset'
> &
  Pick<PopoverPrimitive.Portal.Props, 'container'> &
  PopoverPrimitive.Popup.Props;

function PopoverPopup({
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  collisionBoundary = 'clipping-ancestors',
  container,
  children,
  ...props
}: PopoverPopupProps) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Positioner
        className="DocSearch-Popover-Positioner"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionBoundary={collisionBoundary}
      >
        <PopoverPrimitive.Popup className="DocSearch-Popover-Popup" {...props}>
          <PopoverPrimitive.Arrow className="DocSearch-Popover-Arrow" />
          <PopoverPrimitive.Close className="DocSearch-Popover-Close">
            <CloseIcon />
          </PopoverPrimitive.Close>
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

Popover.Popup = PopoverPopup;

function PopoverTitle({ ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title className="DocSearch-Popover-Title" {...props} />
  );
}

Popover.Title = PopoverTitle;
