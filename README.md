# Radix Trie (in Javascript)

## Usage

Once I publish it, install from NPM:
```sh
npm i radix-trie-js
```

```js
const RadixTrie = require("radix-trie-js");
// create a trie with the key of foo and value of 5
const trie = new RadixTrie().add("foo", 5);
```

## Methods

### add
Inserts a node with the given value.
```js
const trie = new RadixTrie().add("bar", 4);
```

### delete
Deletes a key/value pair.
```js
const trie = new RadixTrie().add("foo", 1).add("bar", 8);
trie.get("foo"); // 1
trie.delete("foo");
trie.get("foo"); // null
```

### fuzzyGet
Returns an `iterator` for all the keys and values in the trie that match or partially match a given value.
```js
const trie = new RadixTrie();
trie.add("hi").add("hello", false);
trie.fuzzyGet("h").next();
// { value: ["hi", true], done: false }

[...trie.fuzzyGet("h")];
// [ ["hi", true], ["hello", false]]

Array.from(trie.fuzzyGet("hel"));
// [ ["hello", false] ]
```

### entries
Returns an `iterator` for all the keys and values in the trie.

`NOTE:` that order cannot be preserved as a trie is constantly being compressed or expanded with each addition/deletion. In the below example, "ten" is first, but is remove later with the addition of "three", and the prefix "t" is added to consolidate them. So, now "five" will be first.
```js
const trie = new RadixTrie();
trie.add("ten", 10).add("five", 5).add("three", 3);
trie.entries().next();
// { value: ["five", 5], done: false }

[...trie.entries()];
// [ [ "five", 5 ], [ "ten", 10 ], [ "three", 3 ] ]

Array.from(trie.entries());
// [ [ "five", 5 ], [ "ten", 10 ], [ "three", 3 ] ]
```
