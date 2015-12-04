import $ from 'npm-zepto';

let utils = {
  
 /**
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
 * @param {String} key Main object key to move up
 * @return {Object}
 * @throws Error when key is not an attribute of Object or is not an object itself
 */
  mergeKeyWithParent(object, key) {
    if (object[key] === undefined) {
      throw new Error(`Object has no key ${key}`);
    }
    if (typeof object[key] !== 'object') {
      throw new Error(`Key ${key} is not an object`);
    }
    let newObject = $.extend({}, object, object[key]);
    delete newObject[key];
    return newObject;
  }
  // // Group all objects of `collection` by the key specified in `property`
  // groupBy(collection, property) {
  //   let result = {};
  //   $.each(collection, (index, item) => {
  //     let key = item[property];
  //     if (!result[key]) {
  //       result[key] = [];
  //     }
  //     result[key].push(item);
  //   });
  //   return result;
  // },
  // // Flatten all values into one array, marking the first element with
  // // `flagName`
  // flattenObject(o, flagName) {
  //   values(o).map((value) => {
  //     value[0][flagName] = true;
  //   });
  //   return flatten(values);
  // }
};

export default utils;
