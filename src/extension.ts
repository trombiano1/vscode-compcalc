import { stringify } from 'querystring';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    function gcd(n1: bigint, n2: bigint):bigint { 
        let gcd: bigint = 1n;
    
        for (let i = 1; i <= n1 && i <= n2; ++i) {
            if (n1 % BigInt(i) === BigInt(0) && n2 % BigInt(i) === BigInt(0)) {
                gcd = BigInt(i);
            }
        }
        return gcd;
    }

    function ncr(n: bigint, r: bigint): bigint {
        if (n < r) {
            throw new Error("r cannot be larger than n.");
        }
        let p: bigint = 1n, k: bigint = 1n;
        if (n - r < r) {
            r = n - r;
        } 
        if (r !== 0n) {
            while (r) {
                p *= n;
                k *= r;
                let m: bigint = gcd(p, k);
                p /= m;
                k /= m;
                n--;
                r--;
            }
        } else {
            p = 1n;
        }
        return p;
    }

    function factorial(num: bigint): bigint {
        if (num === 0n) {
            return 1n;
        } else {
            return num * factorial(num - 1n); 
        }
    }

    function arit(n1: bigint, n2: bigint, op: string): bigint {
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

    function parse(equation: string) {
        const opsList = ["+", "-", "*", "/", "^", "(", ")"];
        equation = equation.replace(/\s/g, "");
        equation = equation.replace("=", "");
        let eq = equation.split(/(\+|\*|-|\/|\^|\(|\))/g).filter(n => n);

        // shunting yard algorithm
        let n = new Array(), ops = new Array();
        for (const el of eq) {
            if (!opsList.includes(el)) {
                // el is number
                if (el.includes("C")) {
                    // nCr
                    let arr = el.split("C");
                    if (arr.length !== 2) {
                        throw new Error("Error parsing nCr expression.");
                    }
                    n.push(ncr(BigInt(arr[0]), BigInt(arr[1])));
                } else if (el.includes("!")) {
                    // N!
                    let arr = el.split("!");
                    if (arr.length !== 1) {
                        throw new Error("Error parsing N! expression.");
                    }
                    n.push(factorial(BigInt(arr[0])));
                } else {
                    // Other
                    n.push(BigInt(el));
                }
            } else {
                // el is op
                if (el === ")") {
                    // until (
                    while (ops[ops.length - 1] !== "(") {
                        let n2 = n.pop();
                        let n1 = n.pop();
                        let op = ops.pop();
                        n.push(arit(n1, n2, op));
                    }
                    ops.pop();
                } else if (el === "(") {
                    ops.push(el);
                } else {
                    while (ops.length > 0 && precedence(el) <= precedence(ops[ops.length - 1])) {
                        let n2 = n.pop();
                        let n1 = n.pop();
                        let op = ops.pop();
                        n.push(arit(n1, n2, op));
                    }
                    ops.push(el);
                }
            }
        }
        while (ops.length > 0) {
            let n2 = n.pop();
            let n1 = n.pop();
            let op = ops.pop();
            n.push(arit(n1, n2, op));
        }
        if (n.length === 1 && ops.length === 0) {
            return n[0];
        } else {
            throw new Error("Error parsing the expression.");
        }
    }

    let calc = vscode.commands.registerTextEditorCommand('vscode-compcalc.calc', (editor, edit) => {
        var equation = editor.document.lineAt(editor.selection.active.line).text;
        edit.replace(editor.document.lineAt(editor.selection.active.line).range, equation + " = " + parse(equation).toLocaleString());
    });

    context.subscriptions.push(calc);
}

// This method is called when your extension is deactivated
export function deactivate() {}
