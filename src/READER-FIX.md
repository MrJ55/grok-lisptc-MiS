# Reader tryToParse fix (P3)

In `src/lisp.ts` around the `readToken` method, change:

```ts
const n = tryToParse(t);
if (n !== null) this.token = n;
```

to:

```ts
const n = tryToParse(t);
if (n !== undefined && n !== null) this.token = n;
```

`arith.ts` `tryToParse` returns `undefined` on failure; the original check treated that as a successful parse and set `this.token = undefined`, breaking all list evaluation.

Bootstrap already prefers a present `src/lisp.ts`. If you fetch a fresh upstream copy, re-apply this one-line fix (or keep the vendored fixed copy).
