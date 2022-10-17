# Competitive Calculator

[日本版はこちら](https://qiita.com/trombiano1/items/aacee3c576e0fd19d417)

This is a small calculator designed for estimating the computational complexity of a problem during programming competitions.

For example, you might need to quickly calculate 2²⁰₁₀C₅. 

Just create a new line and type:
```
2^20*10C5
```
Now hit `Cmd+Alt+c` on macOS or `Ctrl+Alt+c` on Windows and bang! The result will immediately be shown like this 👇
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
| Division       | / | Rounds down to the nearest integer. |
| Combination       | nCr | Accepts both uppercase and lowercase. |
| Factorial       | n! |  |
| Logarithm       | log(n) | Parenthesis required. Rounds down to the nearest integer.   |
| Parenthesis       | () |  |

All spaces will be ignored.

## Outlook

- Implement nPr, nHr

## Release Notes

### 0.1.0
Beta version release.
### 0.2.0
Added log support.