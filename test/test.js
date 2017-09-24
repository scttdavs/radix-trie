"use strict";

const assert = require("assert");
const Trie = require("../");

describe("Radix Trie", () => {
  describe("Add", () => {
    it("add a value to the tree.", () => {
      const trie = new Trie().add("foo", 5);

      assert.equal(trie.get("foo"), 5);
    });
  });
});
