import * as vscode from "vscode";

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
  console.log("decorator sample is activated");

  let timeout: NodeJS.Timeout | undefined = undefined;

  const decorations = new Map<
    string,
    {
      decoration: vscode.TextEditorDecorationType;
      ranges: vscode.Range[];
      hoverMessage: string;
    }
  >();

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

  decorations.set("k", {
    decoration: vscode.window.createTextEditorDecorationType({
      borderColor: "rgb(105, 85, 255)",
      borderStyle: "dashed",
      borderWidth: "1px",
      backgroundColor: "rgba(30, 0, 255, 0.4)",
    }),
    ranges: [],
    hoverMessage: "key",
  });

  decorations.set("p", {
    decoration: vscode.window.createTextEditorDecorationType({
      borderColor: "yellow",
      borderStyle: "dashed",
      borderWidth: "1px",
      backgroundColor: "rgba(255, 255, 0, 0.4)",
    }),
    ranges: [],
    hoverMessage: "potion",
  });

  decorations.set("e", {
    decoration: vscode.window.createTextEditorDecorationType({
      borderColor: "rgb(0, 255, 200)",
      borderStyle: "dashed",
      borderWidth: "1px",
      backgroundColor: "rgba(0, 255, 200, 0.4)",
    }),
    ranges: [],
    hoverMessage: "elixir",
  });

  decorations.set("al", {
    decoration: vscode.window.createTextEditorDecorationType({
      borderColor: "magenta",
      borderStyle: "solid",
      borderWidth: "1px",
      backgroundColor: "rgba(255, 0, 225, 0.4)",
    }),
    ranges: [],
    hoverMessage: "altar",
  });

  decorations.set("d", {
    decoration: vscode.window.createTextEditorDecorationType({
      borderColor: "rgb(0, 215, 0)",
      borderStyle: "solid",
      borderWidth: "1px",
      backgroundColor: "rgba(0, 215, 0, 0.4)",
    }),
    ranges: [],
    hoverMessage: "door",
  });

  decorations.set("c", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; text-shadow: rgb(0, 200, 255) 0 0 5px",
    }),
    ranges: [],
    hoverMessage: "crystal sword",
  });

  decorations.set("a", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; text-shadow: rgb(180, 180, 180) 0 0 5px",
    }),
    ranges: [],
    hoverMessage: "axe",
  });

  decorations.set("r", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; text-shadow: rgb(255, 205, 0) 0 0 5px",
    }),
    ranges: [],
    hoverMessage: "ring of annhihilation",
  });

  decorations.set("ko", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; color: rgb(255, 0, 0)",
    }),
    ranges: [],
    hoverMessage: "kobold",
  });

  decorations.set("go", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; color: rgb(225, 0, 0)",
    }),
    ranges: [],
    hoverMessage: "goblin",
  });

  decorations.set("oc", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; color: rgb(205, 0, 0)",
    }),
    ranges: [],
    hoverMessage: "orc",
  });

  decorations.set("og", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; color: rgb(185, 0, 0)",
    }),
    ranges: [],
    hoverMessage: "ogre",
  });

  decorations.set("tr", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; color: rgb(165, 0, 0)",
    }),
    ranges: [],
    hoverMessage: "troll",
  });

  decorations.set("dr", {
    decoration: vscode.window.createTextEditorDecorationType({
      textDecoration: "display: none; color: rgb(145, 0, 0)",
    }),
    ranges: [],
    hoverMessage: "dragon",
  });

  // Monsters

  // decorations.set("go", {
  //   decoration: vscode.window.createTextEditorDecorationType({
  //     borderColor: "rgb(255, 157, 0)",
  //     borderStyle: "solid",
  //     borderWidth: "1px",
  //     backgroundColor: "rgba(0, 215, 0, 0.4)",
  //   }),
  //   ranges: [],
  //   hoverMessage: "goblin",
  // });

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
