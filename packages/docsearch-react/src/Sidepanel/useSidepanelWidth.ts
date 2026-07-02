import React from 'react';

const BASE_WIDTH = 360;
const EXPANDED_WIDTH = 580;

type UseSidepanelWidthProps = {
  isExpanded: boolean;
  width?: number | string;
  expandedWidth?: number | string;
};

export const useSidepanelWidth = ({ isExpanded, width, expandedWidth }: UseSidepanelWidthProps): string => {
  const baseWidth = React.useMemo(() => {
    return typeof width === 'number' ? `${width}px` : (width ?? `${BASE_WIDTH}px`);
  }, [width]);

  const resolvedExpandedWidth = React.useMemo(() => {
    return typeof expandedWidth === 'number' ? `${expandedWidth}px` : (expandedWidth ?? `${EXPANDED_WIDTH}px`);
  }, [expandedWidth]);

  const expectedWidth = isExpanded ? resolvedExpandedWidth : baseWidth;

  return expectedWidth;
};
