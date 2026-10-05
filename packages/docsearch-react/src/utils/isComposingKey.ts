/**
 * Key code browsers report while an IME is processing a key. Safari fires
 * `compositionend` before the confirming `keydown`, so `isComposing` is already
 * false and this code is the remaining signal.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
 * @see https://github.com/algolia/docsearch/issues/1304
 */
const IME_PROCESS_KEY_CODE = 229;

type ComposingKeyEvent = {
  keyCode: number;
  nativeEvent: {
    isComposing: boolean;
  };
};

/**
 * True when a keydown belongs to an in-progress IME composition, including the
 * Enter that confirms a conversion.
 */
export function isComposingKey(event: ComposingKeyEvent): boolean {
  return (
    event.nativeEvent.isComposing || event.keyCode === IME_PROCESS_KEY_CODE
  );
}
