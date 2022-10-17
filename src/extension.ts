import { stringify } from 'querystring';
import * as vscode from 'vscode';

function gcd(n1: bigint, n2: bigint):bigint { 
    let gcd: bigint = 1n;

    for (let i = 1; i <= n1 && i <= n2; ++i) {
        if (n1 % BigInt(i) === BigInt(0) && n2 % BigInt(i) === BigInt(0)) {
            gcd = BigInt(i);
        }
    }
    return gcd;
}

// function ncr(n: bigint, r: bigint): bigint {
//     if (n < r) {
//         throw new Error("r cannot be larger than n.");
//     }
//     let p: bigint = 1n, k: bigint = 1n;
//     if (n - r < r) {
//         r = n - r;
//     } 
//     if (r !== 0n) {
//         while (r) {
//             p *= n;
//             k *= r;
//             let m: bigint = gcd(p, k);
//             p /= m;
//             k /= m;
//             n--;
//             r--;
//         }
//     } else {
//         p = 1n;
//     }
//     return p;
// }
function ncr(n: bigint, r: bigint): bigint {
    return factorial(n) / factorial(r) / factorial(n - r);
}

function factorial(num: bigint): bigint {
    if (num === 0n) {
        return 1n;
    } else {
        return num * factorial(num - 1n); 
    }
}

function log2(n: bigint) {
    if (n < 0){
        throw new Error("Error parsing.");
    }
    const s = n.toString(2);
    return BigInt(s.length - 1);
}

function opsCalc(n1: bigint, n2: bigint, op: string): bigint {
    if (op === "^") {
        if (n2 < 0n) {
            throw new Error("Exponent cannot be negative.");
            process.exit(1);
        }
        return n1 ** n2;
    } else if (op === "+") {
        return n1 + n2;
    } else if (op === "-") {
        return n1 - n2;
    } else if (op === "*") {
        return n1 * n2;
    } else if (op === "/") {
        return n1 / n2;
    } else {
        return 0n;
    }
}

function funcCalc(n: bigint, op: string): bigint {
    if (op === "log") {
        if (n < 0n) {
            throw new Error("Log argument cannot be below or equal to 0.");
        }
        return log2(n);
    } else {
        return 0n;
    }
}

function precedence(op: string) {
    if (op === "^") {
        return 4;
    } else if (op === "*") {
        return 3;
    } else if (op === "/") {
        return 3;
    } else if (op === "+") {
        return 2;
    } else if (op === "-") {
        return 2;
    } else {
        return 0;
    }
}

function associativity(op: string) {
    if (op === "^") {
        return "right";
    } else if (op === "*") {
        return "left";
    } else if (op === "/") {
        return "left";
    } else if (op === "+") {
        return "left";
    } else if (op === "-") {
        return "left";
    } else {
        return 0;
    }
}

function parse(equation: string) {
    const opsList = ["+", "-", "*", "/", "^"];
    const funcsList = ["log"];
    equation = equation.replace(/\s/g, "");
    equation = equation.split("=")[0];
    let eq = equation.split(/(\+|\*|-|\/|\^|\(|\))|(log)/g).filter(n => n);

    // shunting yard algorithm
    // convert to Reverse Polish Notation
    // https://en.wikipedia.org/wiki/Shunting_yard_algorithm#The_algorithm_in_detail
    let ops = new Array();
    let out = new Array();
    for (const token of eq) {
        if (!opsList.includes(token) && 
          !funcsList.includes(token) &&
          token !== "(" &&
          token !== ")") { // token is number
            if (token.includes("c")) { // nCr
                let arr = token.split("c").filter(n => n);;
                if (arr.length !== 2) {
                    throw new Error("Error parsing nCr expression.");
                }
                out.push(ncr(BigInt(arr[0]), BigInt(arr[1])));
            } else if (token.includes("!")) { // N!
                let arr = token.split("!").filter(n => n);
                if (arr.length !== 1) {
                    throw new Error("Error parsing N! expression.");
                }
                out.push(factorial(BigInt(arr[0])));
            } else { // just number
                out.push(BigInt(token));
            }
        } else if (funcsList.includes(token)) { // token is function
            ops.push(token);
        } else if (opsList.includes(token)) { // token is operator
            let op1 = token;
            while (ops.length > 0 &&
              ops[ops.length - 1] !== "(" &&
              (precedence(op1) < precedence(ops[ops.length - 1]) || 
              (precedence(op1) === precedence(ops[ops.length - 1]) && 
               associativity(op1) === "left"))) {
                let op2 = ops.pop();
                out.push(op2);
            }
            ops.push(op1);
        } else if (token === "(") { // token is (
            ops.push(token);
        } else if (token === ")") { // token is )
            while (ops.length > 0 && ops[ops.length - 1] !== "(") {
                if (ops.length === 0) { // assert ops is not empty
                    throw new Error("Mismatched parenthesis.");
                }
                let op = ops.pop();
                out.push(op);
            }
            if (ops[ops.length - 1] !== "(") {
                throw new Error("Mismatched parenthesis.");
            }
            ops.pop(); // pop "("
            if (funcsList.includes(ops[ops.length - 1])) {
                let op = ops.pop();
                out.push(op);
            }
        } else {
            throw new Error("Error parsing.");
        }
    }
    
    while (ops.length > 0) {
        let op = ops.pop();
        if (op === "(" || op === ")") {
            throw new Error("Mismatched parenthesis.");
        }
        out.push(op);
    }

    // parse Reverse Polish Notation
    let stack = new Array();
    for (const o of out) {
        if (!funcsList.includes(o) && !opsList.includes(o)) { // is number
            stack.push(o);
        } else if (funcsList.includes(o)) {
            if (stack.length < 1) {
                throw new Error("Error calculating.");
            }
            let n = stack.pop();
            let acc = funcCalc(n, o);
            stack.push(acc);
        } else if (opsList.includes(o)) {
            if (stack.length < 2) {
                throw new Error("Error calculating.");
            }
            let n2 = stack.pop();
            let n1 = stack.pop();
            let acc = opsCalc(BigInt(n1), BigInt(n2), o);
            stack.push(acc);
        }
    }
    if (stack.length !== 1) {
        throw new Error("Error calculating.");
    }
    return stack[0];
}

export function activate(context: vscode.ExtensionContext) {

    let calc = vscode.commands.registerTextEditorCommand('vscode-compcalc.calc', (editor, edit) => {
        var equation = editor.document.lineAt(editor.selection.active.line).text.toLowerCase();
        edit.replace(editor.document.lineAt(editor.selection.active.line).range, equation.split(" =")[0] + " = " + parse(equation).toLocaleString());
    });

    context.subscriptions.push(calc);
}

// This method is called when your extension is deactivated
export function deactivate() {}
