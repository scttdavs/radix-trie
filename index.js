"use strict";

const EXIT_REDUCE = "EXIT_REDUCE";

const customReduce = (array, callback, result) => {
  for (let i = 0; i < array.length; i++) {
    let val = callback(result, array[i], i, array);
    if (val === EXIT_REDUCE) break;
    result = val;
  }
  return result;
};

class Trie {
  constructor() {
    this.store = {};
  }

  add(key, value) {
    // if the key exists already, overwrite it
    if (this.store[key]) {
      this.store[key] = value;
      return this;
    }

    customReduce(key.split(""), (newKey, letter, currentIndex, array) => {
      const ret = newKey + letter;
      // if this iteration of the key exists, add the value to that
      // node with the remaining key value
      if (this.store[ret]) {
        this.store[ret].add(array.slice(currentIndex + 1), value);
        return EXIT_REDUCE;
      }

      return ret;
    }, "");

    // no other leafs matched or partially matched, so save it here
    this.store[key] = value;

    return this;
  }

  get(key) {
    // if the key exists already, return it
    if (this.store[key]) {
      return this.store[key];
    }

    let getKey;
    let getIndex;
    customReduce(key.split(""), (newKey, letter, currentIndex, array) => {
      const ret = newKey + letter;
      // if this iteration of the key exists, add the value to that
      // node with the remaining key value
      if (this.store[ret]) {
        getIndex = currentIndex;
        getKey = ret
        return EXIT_REDUCE;
      }

      return ret;
    }, "");

    return this.store[getKey].get(array.slice(getIndex + 1));
  }
};

module.exports = Trie;
