import * as React from 'react';

type UseAutoResizingTextareaOptions = {
  maxRows: number;
  cssVarName?: string;
  initialCssVarName?: string;
  shouldResetOnMount: boolean;
};

export function useAutoResizingTextarea(
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  {
    maxRows,
    cssVarName = '--docsearch-searchbox-height',
    initialCssVarName = '--docsearch-searchbox-initial-height',
    shouldResetOnMount,
  }: UseAutoResizingTextareaOptions,
): () => void {
  const initialHeightPxRef = React.useRef<number>(0);

  const recompute = React.useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;

    const styles = window.getComputedStyle(element);
    const lineHeight = parseFloat(styles.lineHeight || '0') || 20;
    const paddingTop = parseFloat(styles.paddingTop || '0') || 0;
    const paddingBottom = parseFloat(styles.paddingBottom || '0') || 0;
    const borderTop = parseFloat(styles.borderTopWidth || '0') || 0;
    const borderBottom = parseFloat(styles.borderBottomWidth || '0') || 0;
    const maxHeight = maxRows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom;

    element.style.height = 'auto';
    const newHeight = Math.min(element.scrollHeight, maxHeight);
    element.style.height = `${newHeight}px`;
    element.style.overflowY = element.scrollHeight > maxHeight ? 'auto' : 'hidden';

    // sync measured form height to css var so dropdown height stays accurate
    const formHeight = Math.ceil(element.getBoundingClientRect().height);
    const clampedFormHeight = Math.max(formHeight, initialHeightPxRef.current || 0);
    document.documentElement.style.setProperty(cssVarName, `${clampedFormHeight}px`);
  }, [textareaRef, maxRows, cssVarName]);

  // measure initial height and optionally reset css var on mount when empty
  React.useLayoutEffect((): void => {
    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    const currentCssVar = styles.getPropertyValue(cssVarName).trim();
    const initialCssVar = styles.getPropertyValue(initialCssVarName).trim();

    const parsedCurrent = parseFloat(currentCssVar.replace('px', ''));
    const parsedInitial = parseFloat(initialCssVar.replace('px', ''));

    // determine baseline initial height: prefer explicit initial css var, fallback to current element height
    if (!Number.isNaN(parsedInitial) && parsedInitial > 0) {
      initialHeightPxRef.current = parsedInitial;
    } else if (!Number.isNaN(parsedCurrent) && parsedCurrent > 0) {
      initialHeightPxRef.current = parsedCurrent;
    } else if (textareaRef.current) {
      initialHeightPxRef.current = Math.ceil(textareaRef.current.getBoundingClientRect().height);
    }

    // when mounting with an empty query, reset the css var to the initial height
    if (shouldResetOnMount) {
      if (!Number.isNaN(parsedInitial) && parsedInitial > 0) {
        root.style.setProperty(cssVarName, `${parsedInitial}px`);
      } else {
        // remove any inline override so stylesheet defaults apply
        root.style.removeProperty(cssVarName);
      }
    }
  }, [textareaRef, cssVarName, initialCssVarName, shouldResetOnMount]);

  return recompute;
}
