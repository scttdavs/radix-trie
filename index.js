"use strict";

const BREAK = "TRIE_BREAK_REDUCE";
const EMPTY_STRING = "";
// const util = require("util");
// ex. console.log(util.inspect(trie, false, null));

// a reduce implementation you can "break" out of
const reduce = (accumulator, callback, result) => {
  for (let i = 0; i < accumulator.length; i++) {
    let val = callback(result, accumulator[i], i, accumulator);
    if (val === BREAK) break;
    result = val;
  }
  return result;
};

// funky function to loop backwards over a key, so
// foo, then fo, then f
const reduceReverse = (result, callback) => {
  const end = result;
  let current;
  for (let i = end.length; i > 0; i--) {
    current = end.slice(0, i);
    let val = callback(current, result, i);
    if (val === BREAK) break;
    // if this is reached, it didn't break so return the original
    // if the loop ends here since no match was found
    current = result;

  }
  return current;
};

const set = function(key, value) {
  if (value instanceof Trie) {
    this.store.set(key, value);
  } else {
    this.store.set(key, new Trie(value));
  }
}

const entries = function*(prefix = EMPTY_STRING,
                          useKey = true,
                          useValue = true) {
  for (let [key, trie] of this.store) {
    const entireKey = prefix + key;

    // already end of a word, so let's add it
    if (trie.value !== null) {
      if (useKey && useValue) {
        yield [entireKey, trie.value];
      } else if (useKey) {
        yield entireKey;
      } else if (useValue) {
        yield trie.value;
      }
    }

    // get all possible results of child nodes
    yield* entries.call(trie, entireKey, useKey, useValue);
  }
};

class Trie {
  constructor(value = null) {
    this.value = value;
    this.store = new Map();
  }

  add(key, value = true, root = this) {
    // if the key exists already, overwrite it
    if (this.store.has(key)) {
      this.store.get(key).value = value; // only overwrite value
      return root;
    }

    let didNotloop = true;
    const addKey = reduceReverse(key, (reducedKey, originalAddKey, currentIndex) => {
      // check for partial collisions over all existing keys
      for (let [originalKey, trie] of this.store) {
        if (originalKey.indexOf(reducedKey) === 0) {
          // partial match of an existing prefix

          didNotloop = false;
          if (originalKey === reducedKey) {
            // exact match found
            this.store.get(originalKey).add(key.slice(currentIndex), value);
          } else {
            // partial collision found
            if (reducedKey == key) {
              // the reducedKey is the full key we are inserting, so add the value
              set.call(this, reducedKey, value);
            } else {
              set.call(this, reducedKey);
            }
            // set the exiting collided-with key/value
            set.call(this.store.get(reducedKey), originalKey.slice(reducedKey.length), trie);
            this.store.delete(originalKey); // clean up and delete the old one

            // save current one too if there are more letters in the key
            // that still need to be added
            if (reducedKey !== key) this.store.get(reducedKey).add(key.slice(currentIndex), value);
          }
          // no need to keep iterating, found the largest common prefix
          return BREAK;
        }
      }
    });

    if (addKey === key && didNotloop) {
      // no other leafs matched or partially matched, so save it here
      set.call(this, key, value);
    }

    return root;
  }

  delete(key, root = this) {
    // if the key exists already, delete it
    if (this.store.has(key)) {
      const trie = this.store.get(key);

      if (trie.store.size) {
        // has other nodes branching off, so just remove value
        trie.value = null;
        return root === this ? root : this.store.size === 1; // if it equals 1, it is a redundant edge

      } else {
        // no other nodes, remove the whole entry
        this.store.delete(key);
        return root === this ? root : this.store.size === 1 && this.value === null; // if it equals 1, it is a redundant edge
      }
    } else {
      // check for partial hits
      let result;
      const delKey = reduceReverse(key, (reducedKey, originalDeleteKey, currentIndex) => {
        // check for partial collisions over all existing keys
        for (let [originalKey, trie] of this.store) {
          if (originalKey === reducedKey) {
            const trie = this.store.get(originalKey);
            result = this.store.get(reducedKey).delete(originalDeleteKey.slice(reducedKey.length), root);

            return BREAK;
          }
        }
      });
      if (result === true) {
        // an edge was left redundant after deletion, so compact it
        const redundantEdge = this.store.get(delKey).store.entries().next().value;
        set.call(this,
                 delKey + redundantEdge[0], // key
                 redundantEdge[1]); // value
        this.store.delete(delKey);
      }
    }

    return root;
  }

  has(key) {
    return this.get(key) !== null;
  }

  get(key) {
    // if the key exists already, return it
    if (this.store.has(key)) {
      return this.store.get(key).value;
    }

    let getIndex;
    const getKey = reduce(key.split(""), (newKey, letter, currentIndex, array) => {
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

  *fuzzyGet(getKey,
            prefix = EMPTY_STRING) {
    for (let [key, trie] of this.store) {
      if (key.indexOf(getKey) === 0 || getKey === null) {
        // when getKey is null, we want all the possible results
        // partial or complete match of the prefix

        const entireKey = prefix + key;

        // already end of a word, so let's add it
        if (trie.value !== null) yield [entireKey, trie.value];

        yield* trie.fuzzyGet(null, entireKey); // get all possible results of child nodes
      }
    }
  }

  forEach(callback, thisArg = null) {
    for (let [key, value] of this.entries()) {
      callback.call(thisArg, key, value);
    }
  }

  *entries(prefix = EMPTY_STRING) {
    yield* entries.call(this, prefix);
  }

  *keys(prefix = EMPTY_STRING) {
    yield* entries.call(this, prefix, true, false);
  }

  *values(prefix = EMPTY_STRING) {
    yield* entries.call(this, prefix, false, true);
  }
};

module.exports = Trie;
