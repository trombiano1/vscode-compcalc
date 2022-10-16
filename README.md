# compcalc

This is a small calculator for estimating the computational complexity of a problem during programming competitions.

For example, you might need to quickly calculate $2^{20}  {}_{10}\mathrm{C}_{5}$. In that case, you can just type 

```
2^20*10C5
```
into a new line and hit calculate from command palette. The result will be 👇
```
2^20*10C5 = 264,241,152
```

## Features

It is able to execute the operations below.

| Operation      | Symbol |         Note             |
|----------------|:---:|---------------------------|
| Addition       | + |                           |
| Subtraction    | - |                           |
| Multiplication | * |                           |
| Division       | / | Rounds to the nearest integer |
| Combination       | nCr |  |
| Factorial       | n! |  |
| Parenthesis       | () |  |

## Known Issues

- Error is incosistent.

## Outlook

- Implement ${}_n\mathrm{P}_r$,  ${}_n\mathrm{H}_r$

## Release Notes

### 0.0.1

Beta version release.
