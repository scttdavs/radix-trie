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
  constructor(value = null) {
    this.value = value;
    this.store = {};
  }

  add(key, value, root = this) {
    let keyArray;
    let keyString;
    if (Array.isArray(key)) {
      keyArray = key;
      keyString = key.join("");
    } else {
      keyArray = key.split("");
      keyString = key;
    }
    // if the key exists already, overwrite it
    if (this.store[keyString]) {
      this.store[keyString] = new Trie(value);
      return root;
    }

    console.log("KEY", key, value)
    let newKeyIndex;
    const addKey = customReduce(keyArray, (newKey, letter, currentIndex, array) => {
      // if this iteration of the key exists, add the value to that
      // node with the remaining key value
      if (this.store[newKey]) {
        newKeyIndex = currentIndex;
        return EXIT_REDUCE;
      }

      return newKey + letter;
    }, "");

    if (addKey === keyString) {
      // no other leafs matched or partially matched, so save it here
      this.store[keyString] = new Trie(value);
    } else {
      // partial hit, add to that node
      this.store[addKey].add(keyArray.slice(newKeyIndex), value, root);
    }

    return root;
  }

  get(key) {
    // if the key exists already, return it
    if (this.store[key]) {
      return this.store[key].value;
    }

    let getKey;
    let getIndex;
    getKey = customReduce(key.split(""), (newKey, letter, currentIndex, array) => {
      // if this iteration of the key exists, add the value to that
      // node with the remaining key value
      if (this.store[newKey]) {
        getIndex = currentIndex;
        return EXIT_REDUCE;
      }

      return newKey + letter;
    }, "");

    return this.store[getKey].get(key.slice(getIndex));
  }
};

module.exports = Trie;
