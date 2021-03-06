"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Fetcher } from "./server";

var reference: any;



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(status);
  let fetcher = new Fetcher({
    onLoading: (p: number) => {
      status.text = "Loading (" + p + "%)";
    },
    onDone: (usd: string, turky: string, gre: string, tofel: string) => {
      status.text =
        "  USD: " +
        usd +
        "   TRY:" +
        turky +
        "   TOFEL:" +
        tofel +
        "   GRE:" +
        gre;
    }
  });

  try {
    fetcher.refresh();
  } catch (e) {}
  reference = setInterval(() => {
    try {
      fetcher.refresh();
    } catch (e) {}
  }, 60000);
  status.show();

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  //   let disposable = vscode.commands.registerCommand("extension.stopBahoosh", () => {
  //   });

  //   let disableCommand = vscode.commands.registerCommand(
  //     "extension.stopBahoosh",
  //     () => {
  //       // The code you place here will be executed every time your command is executed
  //       status.hide();
  //     }
  //   );

  //   //

  //   context.subscriptions.push(disposable);
  //   context.subscriptions.push(disableCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (reference) {
    clearInterval(reference);
  }
}
