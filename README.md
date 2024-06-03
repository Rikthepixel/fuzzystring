# fuzzystring

Simple fuzzy search library written in TypeScript.

Alows partial matching of requested string. Useful for searching large sets of data without requesting acureate and full user input.

## Demo

![screen recording 2018-12-05 at 21 35 33](https://user-images.githubusercontent.com/7311462/49559878-ed6f0a80-f8d5-11e8-8cf6-fd5734512f9f.gif)

## Install

- Using npm: `npm i @rikthepixel/fuzzystring`
- Using yarn: `yarn add @rikthepixel/fuzzystring`

```ts
import { fuzzyMatch } from '@rikthepixel/fuzzystring';
```

## Api

```ts
fuzzyMatch('liolor', 'lorem ipsum dolor sit');
// Outputs: 0.87
```

## Performance

```ts
console.time('measure');
for (let i = 0; i < 100000; i++) {
  fuzzyMatch(`ive ${i} lles`, `i have ${i} apples`);
}
console.timeEnd('measure');
// measure: 271.169921875ms
```

~200k ops/s [jsperf](https://jsperf.com/fuzzystring2)

## Development

Build

`npm run build`
