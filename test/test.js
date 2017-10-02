"use strict";

const assert = require("assert");
const Trie = require("../");
const util = require("util");
// ex. console.log(util.inspect(trie, false, null));

describe("Radix Trie", () => {
  describe("Add", () => {
    it("add a value to the tree.", () => {
      const trie = new Trie().add("foo", 5);

      assert.equal(trie.get("foo"), 5);
    });

    it("add values to the tree from an array to the constructor.", () => {
      const trie = new Trie([
        ["foo", 5],
        ["foos", 9]
      ]);

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("add values to the tree from a map to the constructor.", () => {
      const map = new Map([
        ["foo", 5],
        ["foos", 9]
      ]);
      const trie = new Trie(map);

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("add values to the tree from an object to the constructor.", () => {
      const trie = new Trie({
        foo: 5,
        foos: 9
      });

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("should only overwrite value.", () => {
      const trie = new Trie().add("foo", 5).add("foos", 4);
      assert.equal(trie.get("foo"), 5);

      trie.add("foo", 6);
      assert.equal(trie.get("foo"), 6);
      assert.equal(trie.get("foos"), 4);
    });

    it("add values to the tree from an array.", () => {
      const trie = new Trie().add([
        ["foo", 5],
        ["foos", 9]
      ]);

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("add values to the tree from a map.", () => {
      const map = new Map([
        ["foo", 5],
        ["foos", 9]
      ]);
      const trie = new Trie().add(map);

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("add values to the tree from an object.", () => {
      const trie = new Trie().add({
        foo: 5,
        foos: 9
      });

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("add two values to the tree, compressed.", () => {
      const trie = new Trie().add("foo", 5).add("foos", 9);

      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foos"), 9);
    });

    it("consolidates prefixes with new entries", () => {
      const trie = new Trie().add("foo", 5);

      assert.equal(trie.store.has("foo"), true);

      trie.add("faa", 3);

      assert.equal(trie.store.has("foo"), false);
      assert.equal(trie.store.has("f"), true);
      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("faa"), 3);
    });

    it("consolidates prefixes with new entries #2", () => {
      const trie = new Trie().add("foo", 5);

      assert.equal(trie.store.has("foo"), true);

      trie.add("foobar", 3).add("foobared");

      assert.equal(trie.store.has("foo"), true);
      assert.equal(trie.store.has("foobar"), false);
      assert.equal(trie.get("foo"), 5);
      assert.equal(trie.get("foobar"), 3);
      assert.equal(trie.get("foobared"), true);
    });
  });

  describe("Delete", () => {
    it("deletes a value.", () => {
      const trie = new Trie().add("foo", 5);

      assert.equal(trie.get("foo"), 5);

      trie.delete("foo");

      assert.equal(trie.get("foo"), null);
    });

    it("deletes a value with nodes.", () => {
      const trie = new Trie().add("foo", 5).add("foobar");

      assert.equal(trie.get("foo"), 5);

      trie.delete("foo");

      assert.equal(trie.get("foo"), null);
      assert.equal(trie.get("foobar"), true);
    });

    it("deletes a value split over more than one node", () => {
      const trie = new Trie().add("dog").add("doge").add("dogs");

      assert.equal(trie.get("doge"), true);
      trie.delete("doge");

      assert.equal(trie.get("doge"), null);
      assert.equal(trie.get("dog"), true);
      assert.equal(trie.get("dogs"), true);
    });

    it("deletes a value with more than one node", () => {
      const trie = new Trie().add("dog").add("doge").add("dogs");

      assert.equal(trie.get("doge"), true);
      trie.delete("dog");

      assert.equal(trie.get("doge"), true);
      assert.equal(trie.get("dogs"), true);
      assert.equal(trie.get("dog"), null);
    });

    it("chains deletes and additions together", () => {
      const trie = new Trie().add("dog").add("doge").add("dogs");

      assert.equal(trie.get("doge"), true);
      assert.equal(trie.get("dog"), true);
      trie.delete("dog").delete("doge");

      assert.equal(trie.get("doge"), null);
      assert.equal(trie.get("dogs"), true);
      assert.equal(trie.get("dog"), null);
      assert.equal(trie.store.keys().next().value, "dogs");
    });
  });

  describe("Get", () => {
    it("gets a value when it exists", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false);

      assert.equal(trie.get("bar"), 15);
      assert.equal(trie.get("barstool"), false);
    });

    it("returns null when a value does not exist", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false);

      assert.equal(trie.get("barkeep"), null);
      assert.equal(trie.get("barstool"), false);
    });
  });

  describe("Has", () => {
    it("returns true if a key exists", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false);

      assert.equal(trie.has("barstool"), true);
    });

    it("returns false when a key does not exist", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false);

      assert.equal(trie.has("barkeep"), false);
    });
  });

  describe("FuzzyGet", () => {
    it("gets a list of all key/value pairs that at least partially match a key", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false);

      assert.deepEqual([...trie.fuzzyGet("bar")], [["bar", 15], ["barstool", false]]);
    });

    it("gets a list of all key/value pairs that at least partially match a key #2", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false).add("b", "b");

      assert.deepEqual([...trie.fuzzyGet("b")], [["b", "b"], ["bar", 15], ["barstool", false]]);
    });

    it("searches regardless of case.", () => {
      const names = require("./names");
      const results = new Trie(names).fuzzyGet("sc");
      const resultsArr = [...results];

      assert.equal(resultsArr.length, 2);
      assert.equal(resultsArr[1][0], "Scott");
    });

    it("searches regardless of case #2.", () => {
      const names = require("./names");
      const results = new Trie(names).fuzzyGet("john");
      const resultsArr = [...results];

      assert.equal(resultsArr.length, 4);
      assert.equal(resultsArr[3][0], "Johnny");
    });

    it("should return no results for a key that does not exist.", () => {
      const names = require("./names");
      const results = new Trie(names).fuzzyGet("zelda");
      const resultsArr = [...results];

      assert.equal(resultsArr.length, 0);
    });
  });

  describe("Entries", () => {
    it("returns all the entries of a trie", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false).add("b", "b");

      assert.deepEqual([...trie.entries()], [["b", "b"], ["bar", 15], ["barstool", false]]);
    });
  });

  describe("Keys", () => {
    it("returns all the keys of a trie", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false).add("b", "b");

      assert.deepEqual([...trie.keys()], ["b", "bar", "barstool"]);
    });
  });

  describe("Values", () => {
    it("returns all the values of a trie", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false).add("b", "b");

      assert.deepEqual([...trie.values()], ["b", 15, false]);
    });
  });

  describe("forEach", () => {
    it("executes a callback once for each key/value pair.", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false).add("b", "b");

      const values = ["b", 15, false];
      const keys = ["b", "bar", "barstool"];
      let returnedKeys = [];
      let returnedValues = [];
      let thisObj = {};
      const callback = function(key, value) {
        returnedValues.push(value);
        returnedKeys.push(key);
        this[key] = value;
      };

      trie.forEach(callback, thisObj);

      assert.equal(thisObj.bar, 15);
      assert.deepEqual(returnedValues, ["b", 15, false]);
      assert.deepEqual(returnedKeys, ["b", "bar", "barstool"]);
    });
  });
});
