import * as vscode from "vscode";

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("decorator sample is activated");

  let timeout: NodeJS.Timeout | undefined = undefined;

  const decorations: Map<
    string,
    {
      decoration: vscode.TextEditorDecorationType;
      ranges: vscode.Range[];
      hoverMessage: string;
    }
  > = new Map();

  decorations.set("m", {
    decoration: vscode.window.createTextEditorDecorationType({
      backgroundColor: "rgba(102, 102, 102, 0.75)",
    }),
    ranges: [],
    hoverMessage: "mountain",
  });

  decorations.set("t", {
    decoration: vscode.window.createTextEditorDecorationType({
      backgroundColor: "rgba(0, 199, 36, 0.75)",
    }),
    ranges: [],
    hoverMessage: "forest",
  });

  decorations.set("f", {
    decoration: vscode.window.createTextEditorDecorationType({
      opacity: "0.3",
      // textDecoration: "display: none; opacity: 0.5",
      backgroundColor: "rgba(255, 255, 255, 0)",
    }),
    ranges: [],
    hoverMessage: "floor",
  });

  decorations.set("g", {
    decoration: vscode.window.createTextEditorDecorationType({
      borderColor: "red",
      borderStyle: "solid",
      borderWidth: "1px",
      backgroundColor: "rgba(255, 0, 0, 0.4)",
    }),
    ranges: [],
    hoverMessage: "gate",
  });

  let activeEditor = vscode.window.activeTextEditor;

  function updateDecorations() {
    if (!activeEditor) {
      return;
    }

    // empty the ranges
    decorations.forEach((v) => (v.ranges = []));

    const regEx = /([a-z]+)(?=.*row)/g;
    const text = activeEditor.document.getText();

    let match;
    while ((match = regEx.exec(text))) {
      console.log(match[0]);
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );
      const range = new vscode.Range(startPos, endPos);
      decorations.get(match[0])?.ranges.push(range);
    }

    for (const [k, v] of decorations.entries()) {
      console.log(`Setting decorations for ${k}:${v.hoverMessage}`);
      activeEditor.setDecorations(
        v.decoration,
        v.ranges.map((range) => ({ range, hoverMessage: v.hoverMessage }))
      );
    }
  }

  function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (throttle) {
      timeout = setTimeout(updateDecorations, 500);
    } else {
      updateDecorations();
    }
  }

  if (activeEditor) {
    triggerUpdateDecorations();
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations(true);
      }
    },
    null,
    context.subscriptions
  );
}
