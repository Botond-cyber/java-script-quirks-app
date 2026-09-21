# JavaScript Is Weird
## Presentation Cheat Sheet

> Live presenter notes for the JavaScript quirk presentation.

## Before You Start

### Opening filler

"Today we are going to look at JavaScript expressions that seem simple, but produce surprising results. The important thing is not memorizing every oddity. The goal is to build an instinct for the rules JavaScript is applying behind the scenes: coercion, truthiness, equality, floating-point numbers, and object identity."

"For each round, first predict the output. Do not worry about being wrong. A wrong prediction is useful because it tells us which assumption JavaScript is about to challenge."

### Quick audience prompts

- "What do you expect this to print?"
- "Would this be a number or a string?"
- "What conversion is JavaScript doing here?"
- "Would this behave the same with `===`?"
- "Does the value look empty, or is it actually falsy?"
- "Is JavaScript comparing the contents or the object identity?"

### General message

JavaScript is not random. These results are usually consistent with a small set of rules, but the rules can interact in surprising ways. In production code, prefer explicit conversions and `===` so readers do not have to reconstruct the coercion algorithm in their heads.

---

# Main Presentation

## 1. Tiny Error, Huge Surprise

```js
console.log(0.1 + 0.2);
```

**Answer:** `0.30000000000000004`

**Explanation:** JavaScript stores numbers using binary floating point. Values such as `0.1` and `0.2` cannot be represented exactly, so their tiny rounding errors combine.

**Filler:** "This is not JavaScript doing bad arithmetic. It is the normal tradeoff of representing a huge range of numbers in a fixed number of bits."

## 2. When the Operator Switches Modes

```js
console.log("5" + 2);
```

**Answer:** `"52"`

**Explanation:** `+` can mean numeric addition or string concatenation. When one operand is a string, JavaScript converts the other operand to a string and joins them.

## 3. The Same Digits, Different Rules

```js
console.log("5" - 2);
```

**Answer:** `3`

**Explanation:** There is no string subtraction operation. The `-` operator converts `"5"` to the number `5`, then calculates `5 - 2`.

**Transition:** "The value did not change. Only the operator changed, and that was enough to change the coercion rule."

## 4. The Number That Never Matches

```js
console.log(NaN === NaN);
```

**Answer:** `false`

**Explanation:** `NaN` means an invalid numeric result. By design, it is not equal to anything, including itself. Use `Number.isNaN(value)` to test for it.

**Bonus:**

```js
console.log(Number.isNaN(NaN)); // true
```

## 5. Words Can Pretend to Be Booleans

```js
console.log(!!"false");
```

**Answer:** `true`

**Explanation:** `!!` converts a value to a boolean. Every non-empty string is truthy; JavaScript does not interpret the word `"false"` as the boolean `false`.

## 6. Even Empty Things Can Be Truthy

```js
console.log(Boolean([]));
```

**Answer:** `true`

**Explanation:** Arrays are objects, and objects are truthy even when they contain no elements. Empty does not automatically mean falsy.

## 7. Loose Comparisons Can Lie

```js
console.log([] == false);
```

**Answer:** `true`

**Explanation:** With loose equality, `false` becomes `0`. The empty array becomes `""`, which becomes `0`, so the comparison becomes `0 == 0`.

**Filler:** "This is the point where `==` starts charging interest. It looks convenient, but every comparison can hide several conversions."

## 8. The Same Value, Two Different Truths

```js
console.log([] == true);
```

**Answer:** `false`

**Explanation:** `true` becomes `1`, while the empty array becomes `0`. The comparison becomes `0 == 1`, which is false.

**Transition:** "The same empty array was loosely equal to false but not to true. This is why real-world code usually uses `===`."

## 9. Final Boss of Sneaky Logic

```js
console.log([] == ![]);
```

**Answer:** `true`

**Explanation:** An empty array is truthy, so `![]` is `false`. The expression then becomes `[] == false`, which we just saw is true.

**Presenter beat:** Pause after revealing the answer. Ask: "Does this expression make you more or less interested in using loose equality?"

## 10. A Hidden Symbol in Plain Sight

```js
console.log("b" + "a" + +"a" + "a");
```

**Answer:** `"baNaNa"`

**Explanation:** The extra unary `+` tries to convert `"a"` to a number. That fails and produces `NaN`. String concatenation then produces `"baNaNa"`.

**Presenter beat:** "There is a banana hidden in the output. The extra plus is the entire trick."

## 11. A Chain That Changes Its Mind

```js
console.log(1 < 2 < 3);
```

**Answer:** `true`

**Explanation:** JavaScript evaluates left to right. `1 < 2` becomes `true`; then `true` is converted to `1`, and `1 < 3` is true.

**Optional follow-up:** Mention that `3 > 2 > 1` is false because `3 > 2` becomes `true`, then `true > 1` becomes `1 > 1`.

## 12. One Dot Too Many

```js
console.log(27..toString());
```

**Answer:** `"27"`

**Explanation:** The first dot belongs to the numeric literal and the second dot starts property access. The second dot lets the parser distinguish the number from `.toString()`.

## 13. The Smallest Number Is Bigger Than Zero

```js
console.log(Number.MIN_VALUE > 0);
```

**Answer:** `true`

**Explanation:** `Number.MIN_VALUE` is the smallest positive representable number, not the most negative number. It is tiny, but still greater than zero.

## 14. Numbers Hiding in Plain Sight

```js
console.log(true + true);
```

**Answer:** `2`

**Explanation:** In numeric addition, `true` becomes `1` and `false` becomes `0`. Therefore `true + true` becomes `1 + 1`.

## 15. The Number That Refuses to Compare

```js
console.log(null >= 0);
```

**Answer:** `true`

**Explanation:** Relational comparison converts `null` to `0`, so this becomes `0 >= 0`. This differs from `null == 0`, which is false.

## 16. The String That Acts Like a Number

```js
console.log("2" > 1);
```

**Answer:** `true`

**Explanation:** The relational comparison converts the numeric-looking string `"2"` to the number `2`, so the comparison is effectively `2 > 1`.

## 17. A String Pretending to Be False

```js
console.log("0" == false);
```

**Answer:** `true`

**Explanation:** Loose equality converts `"0"` to `0` and `false` to `0`. The comparison becomes `0 == 0`.

## 18. An Empty String Is Zero

```js
console.log("" == 0);
```

**Answer:** `true`

**Explanation:** Loose equality converts an empty string to numeric zero. Both sides become `0`.

## 19. Math on a Missing Value

```js
console.log(1 + null);
```

**Answer:** `1`

**Explanation:** In arithmetic, `null` is converted to `0`, so the expression becomes `1 + 0`.

## 20. The Same Missing Value, Different Shape

```js
console.log(null + 1);
```

**Answer:** `1`

**Explanation:** This is the same numeric coercion as the previous round: `null` becomes `0`, giving `0 + 1`.

**Transition:** "The order changed, but the coercion rule did not. Now let us move from coercion to precision limits."

## 21. The Largest Number Is Not Always Safe

```js
console.log(9999999999999999);
```

**Answer:** `10000000000000000`

**Explanation:** JavaScript's ordinary `Number` type uses IEEE-754 floating point. Large integers eventually lose exact precision and are rounded to a nearby representable value.

**Useful note:** For exact large integers, use `BigInt`, for example `9999999999999999n`.

## 22. What Is This Even Parsing?

```js
console.log(parseInt("1e3"));
```

**Answer:** `1`

**Explanation:** `parseInt` reads the integer prefix and stops when it reaches `e`, which is not part of the integer. It does not parse the string as exponential notation.

**Useful note:** `Number("1e3")` would return `1000`.

## 23. The Number That Became Infinity

```js
console.log(+"1e309");
```

**Answer:** `Infinity`

**Explanation:** Unary `+` converts the string to a number. The value is larger than the maximum finite `Number`, so the result is `Infinity`.

## 24. The Empty Array Is a String Now

```js
console.log([] + null);
```

**Answer:** `"null"`

**Explanation:** The empty array converts to an empty string. Because `+` is now string concatenation, `null` becomes the string `"null"`.

## 25. An Empty Array and a Missing Value

```js
console.log([] + undefined);
```

**Answer:** `"undefined"`

**Explanation:** `[]` becomes `""`, and string concatenation converts `undefined` to `"undefined"`.

## 26. The Value That Lies About Its Type

```js
console.log(typeof null);
```

**Answer:** `"object"`

**Explanation:** `null` is a primitive, but `typeof null` returns `"object"` because of a historical JavaScript bug that remains for compatibility.

## 27. Two Arrays, Same Shape, Different Identity

```js
console.log([] == []);
```

**Answer:** `false`

**Explanation:** Objects and arrays are compared by reference, not by contents. These array literals create two different objects.

## 28. Two Empty Objects, Same Story

```js
console.log({} == {});
```

**Answer:** `false`

**Explanation:** Each object literal creates a separate object. Identical shape does not mean identical reference.

## 29. The Number That Was Never There

```js
console.log("foo" + +"bar");
```

**Answer:** `"fooNaN"`

**Explanation:** Unary `+` cannot convert `"bar"` to a number, so it produces `NaN`. The preceding string makes the final operation concatenation.

## 30. The Empty Array in a Different Costume

```js
console.log([] + []);
```

**Answer:** `""`

**Explanation:** Both arrays convert to empty strings. Concatenating two empty strings still produces an empty string.

## 31. When Null Refuses to Behave

```js
console.log(null == 0);
```

**Answer:** `false`

**Explanation:** Loose equality has a special rule for `null`: it is equal to `undefined`, but not to numeric zero. This differs from numeric and relational coercion.

**Main-run closing transition:** "We have now seen numbers, strings, booleans, arrays, objects, and null all change behavior depending on the operator. The common theme is not randomness: it is implicit conversion and identity."

---

# Optional Extra Weirdness

Use these if there is time or the audience wants a few more examples.

## Extra 1. When Arrays Become Strings

```js
console.log([1, 2, 3] + [4, 5, 6]);
```

**Answer:** `"1,2,34,5,6"`

**Explanation:** Each array is converted to its comma-joined string form: `"1,2,3"` and `"4,5,6"`. String concatenation joins them without adding another comma.

## Extra 2. Objects in String Form

```js
console.log([] + {});
```

**Answer:** `"[object Object]"`

**Explanation:** The empty array becomes `""`, while the plain object becomes `"[object Object]"`. Concatenating them leaves the object string.

---

# Opening Title Puzzle

The opening expression evaluates to:

```text
javascript is weird
```

### How to introduce it

"Before we start, here is a deliberately ridiculous expression. It is not meant to be practical code. It is a warm-up: can JavaScript construct a readable sentence out of empty arrays, booleans, objects, and coercion?"

### How to explain it afterward

"The expression repeatedly turns values into strings and indexes into words such as `false`, `true`, `object`, and `undefined`. It is a compressed demonstration of the same coercion rules we will unpack during the presentation."

---

# Closing Notes

### Final summary

"The lesson is not that JavaScript is unusable. The lesson is that JavaScript has implicit rules, and those rules become surprising when several conversions happen in one expression."

"The practical habits are simple: use `===` instead of `==`, make conversions explicit, avoid relying on floating-point equality, use `Number.isNaN`, and use `BigInt` when integer precision matters."

### Final audience question

"Which result surprised you most, and which rule would you now be able to explain to someone else?"

### One-line takeaway

> JavaScript is weird, but it is usually weird for a reason: follow the coercion, identity, and representation rules.

---

# Presenter Reminders

- Let the audience guess before revealing the answer.
- Ask for the type as well as the value: number, string, boolean, or object.
- Pause after the Final Boss and Banana rounds.
- Use the notes only as prompts; keep explanations conversational.
- If time is short, stop after the Final Boss, then use the remaining rounds as backup.
