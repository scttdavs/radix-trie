# Radix Trie (in Javascript)

[![NPM](https://img.shields.io/npm/v/radix-trie-js.svg)](https://www.npmjs.com/package/radix-trie-js)
![build](https://github.com/scttdavs/radix-trie/actions/workflows/<WORKFLOW_FILE>/badge.svg?branch=master)


## Usage

Install from NPM:

```sh
npm i radix-trie-js
```

```js
const RadixTrie = require("radix-trie-js");
// create a trie with the key of foo and value of 5
const trie = new RadixTrie().add("foo", 5);
```

or create the tree from an object, array or map:

```js
const trie = new Trie([
  ["foo", 5],
  ["foobar", 9],
]);

const trie = new Trie({
  foo: 5,
  foobar: 9,
});

const map = new Map([
  ["foo", 5],
  ["foobar", 9],
]);
const trie = new Trie(map);
```

## Methods

### add

Inserts a key with the given value.

```js
const trie = new RadixTrie().add("bar", 4);
```

or insert many at once:

```js
const trie = new Trie().add([
  ["foo", 5],
  ["foobar", 9],
]);

const map = new Map([
  ["foo", 5],
  ["foobar", 9],
]);
const trie = new Trie().add(map);

const trie = new Trie().add({
  foo: 5,
  foobar: 9,
});
```

### delete

Deletes a key/value pair.

```js
const trie = new RadixTrie().add("foo", 1).add("bar", 8);
trie.get("foo"); // 1

trie.delete("foo");

trie.get("foo"); // null
```

### get

Gets the value for a given key.

```js
const trie = new RadixTrie().add("bar", 4);

trie.get("bar");
// 4
```

### fuzzyGet

Returns an `iterator` for all the keys and values in the trie that match or partially match a given value regardless of case (upper or lowercase). This is similar to an autocomplete feature, which many tries are used for.

```js
const trie = new RadixTrie();
trie.add("hi").add("Hello", false);

trie.fuzzyGet("h").next();
// { value: ["hi", true], done: false }

[...trie.fuzzyGet("h")];
// [ ["hi", true], ["Hello", false]]

Array.from(trie.fuzzyGet("hel"));
// [ ["Hello", false] ]
```

### has

Returns true if the given value exists.

```js
const trie = new RadixTrie().add("bar", 4);

trie.has("bar");
// true
```

### entries

Returns an `iterator` for all the keys and values in the trie.

`NOTE:` that order cannot be preserved as a trie is constantly being compressed or expanded with each addition/deletion. In the below example, "ten" is first, but is removed later with the addition of "three", and the prefix "t" is added to consolidate them. So, now "five" will be first.

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

### keys

Returns an `iterator` for all the keys in the trie.

`NOTE:` that order cannot be preserved as a trie is constantly being compressed or expanded with each addition/deletion. In the below example, "ten" is first, but is removed later with the addition of "three", and the prefix "t" is added to consolidate them. So, now "five" will be first.

```js
const trie = new RadixTrie();
trie.add("ten", 10).add("five", 5).add("three", 3);

trie.keys().next();
// { value: "five", done: false }

[...trie.keys()];
// [ "five", "ten", "three" ]

Array.from(trie.keys());
// [ "five", "ten", "three" ]
```

### values

Returns an `iterator` for all the values in the trie.

`NOTE:` that order cannot be preserved as a trie is constantly being compressed or expanded with each addition/deletion. In the below example, "ten" is first, but is removed later with the addition of "three", and the prefix "t" is added to consolidate them. So, now "five" will be first.

```js
const trie = new RadixTrie();
trie.add("ten", 10).add("five", 5).add("three", 3);

trie.values().next();
// { value: 5, done: false }

[...trie.values()];
// [ 5, 10, 3 ]

Array.from(trie.values());
// [ 5, 10, 3 ]
```

### forEach

Executes a callback once for each key/value pair. It takes an optional second argument for a `this` value that the callback will be called with.

```js
const trie = new RadixTrie().add("bar", 15).add("barstool", false);

let thisObj = {};
const callback = function (key, value) {
  this[key] = value;
};

trie.forEach(callback, thisObj);

thisObj.bar;
// 15
thisObj.barstool;
// false
```
