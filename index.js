"use strict";

const BREAK = "TRIE_BREAK_REDUCE";
const EMPTY_STRING = "";

const customReduce = (array, callback, result) => {
  for (let i = 0; i < array.length; i++) {
    let val = callback(result, array[i], i, array);
    if (val === BREAK) break;
    result = val;
  }
  return result;
};

class Trie {
  constructor(value = null) {
    this.value = value;
    this.store = new Map();
  }

  add(key, value = true, root = this) {
    let keyArray, keyString;

    if (Array.isArray(key)) {
      keyArray = key;
      keyString = key.join("");
    } else {
      keyArray = key.split("");
      keyString = key;
    }
    // if the key exists already, overwrite it
    if (this.store.has(keyString)) {
      this.store.set(keyString, new Trie(value));
      return root;
    }

    let newKeyIndex;
    const addKey = customReduce(keyArray, (newKey, letter, currentIndex, array) => {
      // if this iteration of the key exists, add the value to that
      // node passing the remaining key's letters
      if (this.store.has(newKey)) {
        newKeyIndex = currentIndex; // save the current index so we know where to split the key
        return BREAK;
      }

      return newKey + letter; // accumulates the key letter by letter
    }, EMPTY_STRING);

    if (addKey === keyString) {
      // no other leafs matched or partially matched, so save it here
      this.store.set(keyString, new Trie(value));
    } else {
      // partial hit, add to the already existing node
      this.store.get(addKey).add(keyArray.slice(newKeyIndex), value, root);
    }

    return root;
  }

  get(key) {
    // if the key exists already, return it
    if (this.store.has(key)) {
      return this.store.get(key).value;
    }

    let getIndex;
    const getKey = customReduce(key.split(""), (newKey, letter, currentIndex, array) => {
      // if this iteration of the key exists, get the value from that
      // node with the remaining key's letters
      if (this.store.has(newKey)) {
        getIndex = currentIndex; // save the current index so we know where to split the key
        return BREAK;
      }

      return newKey + letter;
    }, EMPTY_STRING);

    if (this.store.has(getKey)) {
      return this.store.get(getKey).get(key.slice(getIndex));
    } else {
      // no matches
      return null;
    }
  }
};

module.exports = Trie;
