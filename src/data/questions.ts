export interface Question {
  id: string
  /** Short, punchy title shown above the question. */
  title: string
  /** Optional line displayed before the code, e.g. a comparison hint. */
  note?: string
  /** The code that is actually executed (never hard-coded output). */
  code: string
  /** Clickable answer choices, shown exactly as they would print. */
  choices: string[]
  /** Index into `choices` of the real result. */
  correctAnswer: number
  /** Short, student-friendly explanation. */
  explanation: string
  /** Optional follow-up snippet revealed after the answer (also runnable). */
  bonusCode?: string
  /** Renders this round as the dramatic "Final Boss". */
  finalBoss?: boolean
  /** Triggers the banana easter-egg animation on reveal. */
  banana?: boolean
  /** Extra / optional rounds that don't count toward the main progress. */
  extra?: boolean
}

export const questions: Question[] = [
  {
    id: "floating-point",
    title: "Tiny Error, Huge Surprise",
    code: "console.log(0.1 + 0.2);",
    choices: ["0.3", "0.30000000000000004", "0.31", "Error"],
    correctAnswer: 1,
    explanation:
      "Computers store decimals in binary, and numbers like 0.1 and 0.2 can't be written exactly in binary — just like 1/3 can't be written exactly in decimal. The tiny rounding errors add up, so you get that long tail of digits.",
  },
  {
    id: "string-plus-number",
    title: "When the Operator Switches Modes",
    code: 'console.log("5" + 2);',
    choices: ["7", "52", '"52"', "NaN"],
    correctAnswer: 2,
    explanation:
      "The + operator does double duty: add numbers OR join strings. When one side is a string, JavaScript picks 'join strings', turns 2 into \"2\", and glues them together into \"52\".",
  },
  {
    id: "string-minus-number",
    title: "The Same Digits, Different Rules",
    note: 'Compare with the last one:   "5" + 2  →  "52"',
    code: 'console.log("5" - 2);',
    choices: ["3", '"3"', "52", "NaN"],
    correctAnswer: 0,
    explanation:
      "There's no 'subtract strings' operation, so - only means math. JavaScript converts \"5\" into the number 5 and does 5 - 2 = 3. Same values, different operator, completely different result.",
  },
  {
    id: "nan-not-equal",
    title: "The Number That Never Matches",
    code: "console.log(NaN === NaN);",
    choices: ["true", "false", "NaN", "undefined"],
    correctAnswer: 1,
    explanation:
      "NaN means 'Not a Number' — the result of an invalid calculation. By design, NaN is never equal to anything, not even another NaN. To actually test for it, use Number.isNaN().",
    bonusCode: "console.log(Number.isNaN(NaN));",
  },
  {
    id: "double-bang-false",
    title: "Words Can Pretend to Be Booleans",
    code: 'console.log(!!"false");',
    choices: ["true", "false", '"false"', "NaN"],
    correctAnswer: 0,
    explanation:
      "!! turns a value into its true/false version. Any non-empty string is 'truthy', and \"false\" is just a non-empty string of 5 letters — JavaScript doesn't read the word inside. So it becomes true.",
  },
  {
    id: "boolean-empty-array",
    title: "Even Empty Things Can Be Truthy",
    code: "console.log(Boolean([]));",
    choices: ["true", "false", "[]", "0"],
    correctAnswer: 0,
    explanation:
      "Every object in JavaScript is truthy — and arrays are objects, even empty ones. Emptiness doesn't matter here; existing as an object is enough to be true.",
  },
  {
    id: "array-eq-false",
    title: "Loose Comparisons Can Lie",
    code: "console.log([] == false);",
    choices: ["true", "false", "NaN", "TypeError"],
    correctAnswer: 0,
    explanation:
      "With == (loose equals), both sides get converted to numbers. false becomes 0, and [] becomes an empty string \"\" which becomes 0 too. 0 == 0 is true. (We just saw Boolean([]) is true... yet [] == false is ALSO true. Welcome.)",
  },
  {
    id: "array-eq-true",
    title: "The Same Value, Two Different Truths",
    note: "[] == false  →  true          [] == true  →  ???",
    code: "console.log([] == true);",
    choices: ["true", "false", "NaN", "TypeError"],
    correctAnswer: 1,
    explanation:
      "Same rules: true becomes 1, and [] becomes 0. 0 == 1 is false. So [] is loosely equal to false but NOT to true. This is exactly why we avoid == and use === in real code.",
  },
  {
    id: "array-eq-not-array",
    title: "The Final Boss of Sneaky Logic",
    code: "console.log([] == ![]);",
    choices: ["true", "false", "NaN", "undefined"],
    correctAnswer: 0,
    finalBoss: true,
    explanation:
      "![] flips the array to a boolean: [] is truthy, so ![] is false. Now it's [] == false — which we just learned is true. So an array equals the opposite of itself. Take a moment.",
  },
  {
    id: "banana",
    title: "A Hidden Symbol in Plain Sight",
    code: 'console.log("b" + "a" + +"a" + "a");',
    choices: ['"baaa"', '"baNaNa"', '"ba0a"', "NaN"],
    correctAnswer: 1,
    banana: true,
    explanation:
      'Look closely: there\'s a sneaky extra + in front of "a". That tries to turn "a" into a number, but "a" isn\'t a number, so you get NaN. Glue it all together: "b" + "a" + NaN + "a" → "baNaNa".',
  },
  {
    id: "comparison-chain",
    title: "A Chain That Changes Its Mind",
    code: "console.log(1 < 2 < 3);",
    choices: ["true", "false", "3", "NaN"],
    correctAnswer: 0,
    explanation:
      "JavaScript evaluates left to right. 1 < 2 becomes true, then true is coerced to 1, and 1 < 3 is true. So the chained comparison 'looks' like it should be nonsense, but it still ends up true.",
  },
  {
    id: "double-dot",
    title: "One Dot Too Many",
    code: "console.log(27..toString());",
    choices: ['"27"', "SyntaxError", "27", "undefined"],
    correctAnswer: 0,
    explanation:
      "The first dot is the decimal point and the second starts the property access. Without the second dot, JavaScript gets confused by the grammar and rejects the expression. This is one of those tiny parser quirks that look absurd but are totally valid.",
  },
  {
    id: "math-min-max",
    title: "The Smallest Number Is Bigger Than Zero",
    code: "console.log(Number.MIN_VALUE > 0);",
    choices: ["true", "false", "NaN", "undefined"],
    correctAnswer: 0,
    explanation:
      "Number.MIN_VALUE is the smallest positive floating-point value that can be represented. It is greater than zero, even though it is incredibly tiny. That makes it the 'smallest' value in the positive range, not the 'closest to zero' in a signed sense.",
  },
  {
    id: "boolean-math",
    title: "Numbers Hiding in Plain Sight",
    code: "console.log(true + true);",
    choices: ["2", "'truetrue'", "NaN", "1"],
    correctAnswer: 0,
    explanation:
      "When JavaScript sees + with booleans, it coerces them to numbers. true becomes 1, false becomes 0, so true + true becomes 1 + 1 = 2.",
  },
  {
    id: "null-vs-zero",
    title: "The Number That Refuses to Compare",
    code: "console.log(null >= 0);",
    choices: ["true", "false", "NaN", "undefined"],
    correctAnswer: 0,
    explanation:
      "This one is a classic spec quirk: null is treated as 0 in relational comparisons, but not in abstract equality checks. So null >= 0 is true, even though null == 0 is false.",
  },
  {
    id: "string-greater-than-number",
    title: "The String That Acts Like a Number",
    code: "console.log(\"2\" > 1);",
    choices: ["true", "false", "1", "NaN"],
    correctAnswer: 0,
    explanation:
      "The comparison operator converts both sides to numbers when it can. A string like \"2\" becomes 2, so the check is effectively 2 > 1, which is true.",
  },
  {
    id: "string-equals-bool",
    title: "A String Pretending to Be False",
    code: "console.log(\"0\" == false);",
    choices: ["true", "false", "0", "NaN"],
    correctAnswer: 0,
    explanation:
      "Loose equality does coercion. \"0\" becomes the number 0, false becomes 0, and 0 == 0 is true. This is exactly why using == can be so misleading.",
  },
  {
    id: "empty-string-zero",
    title: "An Empty String Is Zero",
    code: "console.log(\"\" == 0);",
    choices: ["true", "false", "\"\"", "undefined"],
    correctAnswer: 0,
    explanation:
      "With loose equality, an empty string is converted to 0. So \"\" == 0 is true because both sides become the number 0 after coercion.",
  },
  {
    id: "one-plus-null",
    title: "Math on a Missing Value",
    code: "console.log(1 + null);",
    choices: ["1", "0", "null", "NaN"],
    correctAnswer: 0,
    explanation:
      "In numeric operations, null is coerced to 0. So 1 + null becomes 1 + 0, and the result is 1.",
  },
  {
    id: "null-plus-one",
    title: "The Same Missing Value, Different Shape",
    code: "console.log(null + 1);",
    choices: ["1", "0", "null", "NaN"],
    correctAnswer: 0,
    explanation:
      "This is the same coercion rule in action: null becomes 0 in arithmetic, so null + 1 is the same as 0 + 1.",
  },
  {
    id: "big-number-bug",
    title: "The Largest Number Is Not Always Safe",
    code: "console.log(9999999999999999);",
    choices: ["10000000000000000", "9999999999999999", "NaN", "Error"],
    correctAnswer: 0,
    explanation:
      "JavaScript numbers are IEEE-754 floating-point values, so very large integers lose precision. The value cannot represent all digits exactly, and it rounds to the nearest representable number.",
  },
  {
    id: "parse-int-bad-radix",
    title: "What Is This Even Parsing?",
    code: "console.log(parseInt(\"1e3\"));",
    choices: ["1", "1000", "NaN", "Error"],
    correctAnswer: 0,
    explanation:
      "parseInt stops at the first character it doesn't recognize. It sees '1', then sees 'e' and refuses to keep going, so it returns the integer 1.",
  },
  {
    id: "unary-plus-exponential",
    title: "The Number That Became Infinity",
    code: "console.log(+\"1e309\");",
    choices: ["Infinity", "1e309", "NaN", "undefined"],
    correctAnswer: 0,
    explanation:
      "The unary + converts the string to a number. The numeric value is too large for the Number range, so JavaScript clamps it to Infinity.",
  },
  {
    id: "array-plus-null",
    title: "The Empty Array Is a String Now",
    code: "console.log([] + null);",
    choices: ['"null"', '"0"', '0', 'NaN'],
    correctAnswer: 0,
    explanation:
      "An empty array stringifies to an empty string, and + with null performs string concatenation. The result becomes the string \"null\".",
  },
  {
    id: "array-plus-undefined",
    title: "An Empty Array and a Missing Value",
    code: "console.log([] + undefined);",
    choices: ['"undefined"', '"0"', '0', 'NaN'],
    correctAnswer: 0,
    explanation:
      "[] turns into an empty string, and undefined becomes the string \"undefined\" when coerced for string concatenation. The final value is \"undefined\".",
  },
  {
    id: "typeof-null",
    title: "The Value That Lies About Its Type",
    code: "console.log(typeof null);",
    choices: ['"object"', '"null"', '"undefined"', '"number"'],
    correctAnswer: 0,
    explanation:
      "This is a famous JavaScript quirk: null is a special primitive value, but typeof null returns \"object\". It's a historical bug that still remains today.",
  },
  {
    id: "array-vs-array",
    title: "Two Arrays, Same Shape, Different Identity",
    code: "console.log([] == []);",
    choices: ["true", "false", "[]", "NaN"],
    correctAnswer: 1,
    explanation:
      "Loose equality compares object references, not contents. Two different array objects are not the same object, so [] == [] is false even though both look empty.",
  },
  {
    id: "object-vs-object",
    title: "Two Empty Objects, Same Story",
    code: "console.log({} == {});",
    choices: ["true", "false", "{}", "NaN"],
    correctAnswer: 1,
    explanation:
      "Objects are compared by reference, not value. Two separate object literals create two different objects, so they are not loosely equal even if they look identical.",
  },
  {
    id: "foo-plus-plus-bar",
    title: "The Number That Was Never There",
    code: "console.log(\"foo\" + +\"bar\");",
    choices: ['"fooNaN"', '"fooNaNbar"', '"foo+NaN"', 'NaN'],
    correctAnswer: 0,
    explanation:
      "The unary + tries to turn the string \"bar\" into a number, which fails, producing NaN. Then it concatenates with the preceding string, creating \"fooNaN\".",
  },
  {
    id: "empty-arrays-string",
    title: "The Empty Array in a Different Costume",
    code: "console.log([] + []);",
    choices: ['""', "[]", "0", "NaN"],
    correctAnswer: 0,
    explanation:
      "Both empty arrays are turned into strings before the + runs. An empty array becomes an empty string, and empty string + empty string is still just an empty string.",
  },
  {
    id: "null-equality-zero",
    title: "When Null Refuses to Behave",
    code: "console.log(null == 0);",
    choices: ["false", "true", "0", "NaN"],
    correctAnswer: 0,
    explanation:
      "The abstract equality algorithm has a special case: null and undefined only compare equal to themselves and each other, not to numeric zero. So null == 0 is false even though null is sometimes treated as 0 in numeric comparisons.",
  },
  // ---- Extra Weirdness (optional, not part of the main run) ----
  {
    id: "array-plus-array",
    title: "When Arrays Become Strings",
    code: "console.log([1, 2, 3] + [4, 5, 6]);",
    choices: ['"123456"', '"1,2,34,5,6"', "[1,2,3,4,5,6]", "21"],
    correctAnswer: 1,
    extra: true,
    explanation:
      "You can't really 'add' arrays, so JavaScript turns each into a string first. [1,2,3] becomes \"1,2,3\" and [4,5,6] becomes \"4,5,6\". Then + glues them: \"1,2,3\" + \"4,5,6\" → \"1,2,34,5,6\".",
  },
  {
    id: "array-plus-object",
    title: "Objects in String Form",
    code: "console.log([] + {});",
    choices: ['"[object Object]"', '"{}"', "0", "undefined"],
    correctAnswer: 0,
    extra: true,
    explanation:
      "Both get converted to strings. An empty array becomes \"\", and a plain object becomes the famous \"[object Object]\". Glue them together and the array adds nothing, so you're left with \"[object Object]\".",
  },
]

/** The opening title puzzle — a single expression that spells the title. */
export const titlePuzzle = {
  id: "title-puzzle",
  code: "([]+{})[+!![]+[+[]]]+(![]+[])[+!![]]+'v'+(![]+[])[+!![]]+(![]+[])[!+[]+!![]+!![]]+(![]+{})[+!![]+[+[]]]+(!![]+[])[+!![]]+(![]+[]+[][[]])[+!![]+[+[]]]+'p'+(!![]+[])[+[]]+(+{}+{})[+!![]+[+[]]]+(![]+[]+[][[]])[+!![]+[+[]]]+(![]+[])[!+[]+!![]+!![]]+(+{}+{})[+!![]+[+[]]]+'w'+([]+{})[+!![]+[+!![]]]+(![]+[]+[][[]])[+!![]+[+[]]]+(!![]+[])[+!![]]+([][[]]+[])[!+[]+!![]]",
}

export const mainQuestions = questions.filter((q) => !q.extra)
export const extraQuestions = questions.filter((q) => q.extra)
