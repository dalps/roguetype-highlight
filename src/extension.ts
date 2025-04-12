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

  function setDecoration(
    key: string,
    decoration: vscode.DecorationRenderOptions,
    hoverMessage: string
  ) {
    decorations.set(key, {
      decoration: vscode.window.createTextEditorDecorationType(decoration),
      ranges: [],
      hoverMessage,
    });
  }

  setDecoration(
    "m",
    {
      backgroundColor: { id: "roguetypeHighlight.mountain" },
    },
    "mountain"
  );

  setDecoration(
    "t",
    {
      backgroundColor: { id: "roguetypeHighlight.forest" },
    },
    "forest"
  );

  setDecoration(
    "f",
    {
      opacity: "0.3",
    },
    "free"
  );

  setDecoration(
    "g",
    {
      borderColor: { id: "roguetypeHighlight.gateBorder" },
      borderStyle: "dashed",
      borderWidth: "1px",
      backgroundColor: { id: "roguetypeHighlight.gateBg" },
    },
    "gate"
  );

  setDecoration(
    "d",
    {
      borderColor: { id: "roguetypeHighlight.doorBorder" },
      borderStyle: "dashed",
      borderWidth: "1px",
      backgroundColor: { id: "roguetypeHighlight.doorBg" },
    },
    "door"
  );

  setDecoration(
    "al",
    {
      borderColor: { id: "roguetypeHighlight.altarBorder" },
      borderStyle: "dashed",
      borderWidth: "1px",
      backgroundColor: { id: "roguetypeHighlight.altarBg" },
    },
    "altar"
  );

  setDecoration(
    "a",
    {
      textDecoration: "display: none; text-shadow: rgb(180, 180, 180) 0 0 5px",
    },
    "axe"
  );

  setDecoration(
    "k",
    {
      textDecoration: "display: none; text-shadow: rgb(85, 161, 255) 0 0 5px",
    },
    "key"
  );

  setDecoration(
    "p",
    {
      textDecoration: "display: none; text-shadow: rgb(0, 255, 26) 0 0 5px",
    },
    "potion"
  );

  setDecoration(
    "e",
    {
      textDecoration: "display: none; text-shadow: rgb(0, 255, 170) 0 0 5px",
    },
    "elixir"
  );

  setDecoration(
    "s",
    {
      textDecoration: "display: none; text-shadow: rgb(255, 0, 251) 0 0 5px",
    },
    "mithril sword"
  );

  setDecoration(
    "c",
    {
      textDecoration: "display: none; text-shadow: rgb(0, 200, 255) 0 0 5px",
    },
    "cristal sword"
  );

  setDecoration(
    "r",
    {
      // before: {
      //   contentText: "💍",
      // },
      // textDecoration: "display: none",
      textDecoration: "display: none; text-shadow: rgb(255, 191, 0) 0 0 5px",
    },
    "ring of annhihilation"
  );

  setDecoration(
    "ko",
    {
      color: { id: "roguetypeHighlight.kobold" },
    },
    "kobold (1 health)"
  );

  setDecoration(
    "go",
    {
      color: { id: "roguetypeHighlight.goblin" },
    },
    "goblin (2 health)"
  );

  setDecoration(
    "oc",
    {
      color: { id: "roguetypeHighlight.orc" },
    },
    "orc (4 health)"
  );

  setDecoration(
    "og",
    {
      color: { id: "roguetypeHighlight.ogre" },
    },
    "ogre (6 health)"
  );

  setDecoration(
    "tr",
    {
      color: { id: "roguetypeHighlight.troll" },
    },

    "troll (8 health)"
  );

  setDecoration(
    "dr",
    {
      color: { id: "roguetypeHighlight.dragon" },
    },
    "dragon (256 health)"
  );

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
