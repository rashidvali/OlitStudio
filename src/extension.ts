import * as vscode from 'vscode';
import { n } from './olitcore';
import { q } from './olitql';
import { d } from './olitdom';

export function activate(context: vscode.ExtensionContext) {
    console.log('OLIT extension activated!');
    return { n, q, d };
}

export function deactivate() {}
