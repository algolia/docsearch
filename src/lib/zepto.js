/* zepto work-around */

const current$ = window.$;
const currentZepto = window.Zepto;
require('autocomplete.js/zepto.js');
const zepto = window.Zepto;
window.$ = current$;
window.Zepto = currentZepto;

export default zepto;
