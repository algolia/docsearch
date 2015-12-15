import $ from 'npm-zepto';

let utils = {
  /*
  * Move the content of an object key one level higher.
  * eg.
  * {
  *   name: 'My name',
  *   hierarchy: {
  *     lvl0: 'Foo',
  *     lvl1: 'Bar'
  *   }
  * }
  * Will be converted to
  * {
  *   name: 'My name',
  *   lvl0: 'Foo',
  *   lvl1: 'Bar'
  * }
  * @param {Object} object Main object
  * @param {String} property Main object key to move up
  * @return {Object}
  * @throws Error when key is not an attribute of Object or is not an object itself
  */
  mergeKeyWithParent(object, property) {
    if (object[property] === undefined) {
      throw new Error(`[mergeKeyWithParent]: Object has no key ${property}`);
    }
    if (typeof object[property] !== 'object') {
      throw new Error(`[mergeKeyWithParent]: Key ${property} is not an object`);
    }
    let newObject = $.extend({}, object, object[property]);
    delete newObject[property];
    return newObject;
  },
  /*
  * Group all objects of a collection by the value of the specified attribute
  * eg.
  * groupBy([
  *   {name: 'Tim', category: 'dev'},
  *   {name: 'Vincent', category: 'dev'},
  *   {name: 'Ben', category: 'sales'},
  *   {name: 'Jeremy', category: 'sales'},
  *   {name: 'AlexS', category: 'dev'},
  *   {name: 'AlexK', category: 'sales'}
  * ], 'category');
  * =>
  * {
  *   'devs': [
  *     {name: 'Tim', category: 'dev'},
  *     {name: 'Vincent', category: 'dev'},
  *     {name: 'AlexS', category: 'dev'}
  *   ],
  *   'sales': [
  *     {name: 'Ben', category: 'sales'},
  *     {name: 'Jeremy', category: 'sales'},
  *     {name: 'AlexK', category: 'sales'}
  *   ]
  * }
  * @param {array} collection Array of objects to group
  * @param {String} property The attribute on which apply the grouping
  * @return {array}
  * @throws Error when one of the element does not have the specified property
  */
  groupBy(collection, property) {
    let newCollection = {};
    $.each(collection, (index, item) => {
      if (item[property] === undefined) {
        throw new Error(`[groupBy]: Object has no key ${property}`);
      }
      let key = item[property];
      if (!newCollection[key]) {
        newCollection[key] = [];
      }
      newCollection[key].push(item);
    });
    return newCollection;
  },
 /*
  * Return an array of all the values of the specified object
  * eg.
  * values({
  *   foo: 42,
  *   bar: true,
  *   baz: 'yep'
  * })
  * =>
  * [42, true, yep]
  * @param {object} object Object to extract values from
  * @return {array}
  */
  values(object) {
    return Object.keys(object).map(key => object[key]);
  },
 /*
  * Flattens an array
  * eg.
  * flatten([1, 2, [3, 4], [5, 6]])
  * =>
  * [1, 2, 3, 4, 5, 6]
  * @param {array} array Array to flatten
  * @return {array}
  */
  flatten(array) {
    let results = [];
    array.forEach((value) => {
      if (!Array.isArray(value)) {
        results.push(value);
        return;
      }
      value.forEach((subvalue) => {
        results.push(subvalue);
      });
    });
    return results;
  },
 /*
  * Flatten all values of an object into an array, marking each first element of
  * each group with a specific flag
  * eg.
  * flattenAndFlagFirst({
  *   'devs': [
  *     {name: 'Tim', category: 'dev'},
  *     {name: 'Vincent', category: 'dev'},
  *     {name: 'AlexS', category: 'dev'}
  *   ],
  *   'sales': [
  *     {name: 'Ben', category: 'sales'},
  *     {name: 'Jeremy', category: 'sales'},
  *     {name: 'AlexK', category: 'sales'}
  *   ]
  * , 'isTop');
  * =>
  * [
  *     {name: 'Tim', category: 'dev', isTop: true},
  *     {name: 'Vincent', category: 'dev', isTop: false},
  *     {name: 'AlexS', category: 'dev', isTop: false},
  *     {name: 'Ben', category: 'sales', isTop: true},
  *     {name: 'Jeremy', category: 'sales', isTop: false},
  *     {name: 'AlexK', category: 'sales', isTop: false}
  * ]
  * @param {object} object Object to flatten
  * @param {string} flag Flag to set to true on first element of each group
  * @return {array}
  */
  flattenAndFlagFirst(object, flag) {
    let values = this.values(object).map(value => {
      value[0][flag] = true;
      return value;
    });
    return this.flatten(values);
  },
 /*
  * Removes all empty strings, null, false and undefined elements array
  * eg.
  * compact([42, false, null, undefined, '', [], 'foo']);
  * =>
  * [42, [], 'foo']
  * @param {array} array Array to compact
  * @return {array}
  */
  compact(array) {
    let results = [];
    array.forEach(value => {
      if (!value) {
        return;
      }
      results.push(value);
    });
    return results;
  },
  /*
   * Returns the highlighted value of the specified key in the specified object.
   * If no highlighted value is available, will return the key value directly
   * eg.
   * getHighlightedValue({
   *    _highlightResult: {
   *      text: {
   *        value: '<mark>foo</mark>'
   *      }
   *    },
   *    text: 'foo'
   * }, 'foo');
   * =>
   * '<mark>foo</mark>'
   * @param {object} object Hit object returned by the Algolia API
   * @param {string} property Object key to look for
   * @return {string}
   **/
  getHighlightedValue(object, property) {
    if (!object._highlightResult
        || !object._highlightResult[property]
        || !object._highlightResult[property].value) {
      return object[property];
    }
    return object._highlightResult[property].value;
  }


};

export default utils;
