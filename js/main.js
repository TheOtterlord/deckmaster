const { remote } = require('electron');

const app = remote.app;

const win = remote.getCurrentWindow();

let binder, settings;

ipcRenderer.on("cmd", (ev, args) => {
  const arg = args[args.length - 1];
  if (arg.endsWith(".ydk")) {
    ygoprodeck.on("load", () => deckmaster.openDeck(args[args.length - 1]));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  settings = new Settings();
  var recent = document.querySelector(".recent .padding .list");
  deckmaster.getRecentDocs().forEach(path => {
    recent.innerHTML = `<a onclick="deckmaster.open(this.innerHTML)">${path}</a>` + recent.innerHTML;
  });

  binder = new Keybinder();
});
