import values from 'lodash/object/values';
import flatten from 'lodash/array/flatten';

let utils = {
  // Flatten all values into one array, marking the first element with
  // `flagName`
  flattenObject(o, flagName) {
    values(o).map((value) => {
      value[0][flagName] = true;
    });
    return flatten(values);
  }
};

export default utils;
