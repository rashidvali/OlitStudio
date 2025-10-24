import * as vscode from 'vscode';
export declare function activate(context: vscode.ExtensionContext): {
    n: (strings: TemplateStringsArray, ...values: any[]) => import("./olit/OlitNota").ObjectLiteral;
    q: (strings: TemplateStringsArray, ...values: any[]) => import("./olit/OlitNota").ObjectLiteral;
    d: (strings: TemplateStringsArray, ...values: any[]) => {};
};
export declare function deactivate(): void;
