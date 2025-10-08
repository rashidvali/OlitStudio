const line = "Name1: _ LIKE 'J%'";

const re1 = /^\s*([^:\n\r]+)(\s*:\s*)(\b_\b)(\s*)(\b(LIKE|IN|=|!=|<>|<=|>=|<|>)\b)(\s*)([^\n;]+)/;
const re2 = /^\s*([^:\n\r]+)(\s*:\s*)(?:("[^"]*")|('[^']*')|(\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?(?:Z|[+\-]\d{2}:\d{2})?)?)|(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2}(?:\.\d{3})?)?)|([+-]?\d+(?:\.\d+)?)|(\b_\b)|(true|false)\b|([^\n;]+)))/;

console.log('line:', line);
console.log('re1 test:', re1.test(line));
console.log('re1 match:', line.match(re1));
console.log('re2 test:', re2.test(line));
console.log('re2 match:', line.match(re2));
