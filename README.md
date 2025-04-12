# Roguetype world highlighter

<div align="center">
  <image src="https://github.com/user-attachments/assets/5f1c79d5-2253-4b65-9a97-20223806c25b" width="400px"/>
</div>

This vscode extension highlights the world types of the wonderful [Roguetype](https://github.com/Octachron/roguetype) typing adventure.

### Usage

After installing, just open the file `game.ml` of the game's code in a new editor and you should see the rows of the world types decorated as follows:

- free cells dimmed out
- obstacles, gates, doors and altar on top of colorful backgrounds
- monsters in various shades of red
- glowy pickable items

> [!TIP]
> It is highly recommended to vertically align the rows parameters with the Align by RegEx extension (`janjoerke.align-by-regex`) to get a nicely formatted grid.

### Settings

If you don't like the default colors, you can customize (most of) them under the `workbench.colorCustomization` property in your `settings.json` file, like this:

```
"workbench.colorCustomizations": {
    "roguetypeHighlight.mountain": "#6666"
},
```

Happy typing!
