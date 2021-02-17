'use strict';

import * as vscode from 'vscode';
const debounce = require('debounce');
const config = vscode.workspace.getConfiguration('copyOnSelect');

// =============================================================================
// EXTENSION INTERFACE
// =============================================================================
export function activate(context: vscode.ExtensionContext) {
	let text = '';

	let disposable = vscode.commands.registerCommand('extract-to-function.extract', () => {
		vscode.window.onDidChangeTextEditorSelection(debounce(async (event: vscode.TextEditorSelectionChangeEvent) => {
			if (event) {
				text = generateTextToCopy(event);
			}
		}, 300))

		vscode.window.showInformationMessage('Extract: ' + text);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }

// =============================================================================
// FUNCIONS
// =============================================================================
function generateTextToCopy(event: vscode.TextEditorSelectionChangeEvent): string {
    // generate text from selections
    const eol = event.textEditor.document.eol == vscode.EndOfLine.LF ? '\n' : '\r\n';
    let text = event.selections.map(selection => event.textEditor.document.getText(selection)).join(eol);

    // do trimming if necessary
    if (config.get('trimStart', false)) {
        text = text.replace(/^\s+/, '');
    }
    if (config.get('trimEnd', true)) {
        text = text.replace(/\s+$/, '');
    }

    return text;
}

