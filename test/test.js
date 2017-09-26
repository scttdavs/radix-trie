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

    it("should only overwrite value.", () => {
      const trie = new Trie().add("foo", 5).add("foos", 4);
      assert.equal(trie.get("foo"), 5);

      trie.add("foo", 6);
      assert.equal(trie.get("foo"), 6);
      assert.equal(trie.get("foos"), 4);
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

  describe("FuzzyGet", () => {
    it("gets a list of all key/value pairs that at least partially match a key", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false);

      assert.deepEqual(trie.fuzzyGet("bar"), [["bar", 15], ["barstool", false]]);
    });

    it("gets a list of all key/value pairs that at least partially match a key #2", () => {
      const trie = new Trie().add("bar", 15).add("barstool", false).add("b", "b");

      assert.deepEqual(trie.fuzzyGet("b"), [["b", "b"], ["bar", 15], ["barstool", false]]);
    });
  });
});
