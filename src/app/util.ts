import _ from 'lodash';

/**
 * Count the number of values in the list that pass the predicate.
 */
export function count<T>(list: T[], predicate: (value: T) => boolean): number {
  return _.sumBy(list, (item) => {
    return predicate(item) ? 1 : 0;
  });
}

/** A shallow copy (just top level properties) of an object, preserving its prototype. */
export function shallowCopy<T>(o: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(o)), o);
}

export function preventNaN(testValue, defaultValue) {
  return !isNaN(testValue) ? testValue : defaultValue;
}
