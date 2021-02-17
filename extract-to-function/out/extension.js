'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const debounce = require('debounce');
const config = vscode.workspace.getConfiguration('copyOnSelect');
// =============================================================================
// EXTENSION INTERFACE
// =============================================================================
function activate(context) {
    let text = '';
    let disposable = vscode.commands.registerCommand('extract-to-function.extract', () => {
        vscode.window.onDidChangeTextEditorSelection(debounce((event) => __awaiter(this, void 0, void 0, function* () {
            if (event) {
                text = generateTextToCopy(event);
            }
        }), 300));
        vscode.window.showInformationMessage('Extract: ' + text);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
// =============================================================================
// FUNCIONS
// =============================================================================
function generateTextToCopy(event) {
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
//# sourceMappingURL=extension.js.map