const { remote } = require('electron');

const app = remote.app;

const win = remote.getCurrentWindow();

ipcRenderer.on("cmd", (ev, args) => {
  const arg = args[args.length - 1];
  if (arg.endsWith(".ydk")) {
    deckmaster.openDeck(args[args.length-1]);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("settings")) {
    var startscreen = document.querySelector(".start-screen");
    var welcome = document.querySelector(".intro");
    startscreen.style.display = "none";
    welcome.style.display = "block";
  }
  var recent = document.querySelector(".recent .padding .list");
  deckmaster.getRecentDocs().forEach(path => {
    recent.innerHTML = `<a onclick="deckmaster.openDeck(this.innerHTML)">${path}</a>`+recent.innerHTML;
  });

  // Keybindings
  var binder = new Keybinder();

  binder.register({key: "f1", ctrl: true, callback: deckmaster.wiki});
  binder.register({key: "o", ctrl: true, callback: deckmaster.openDeck});
  binder.register({key: ",", ctrl: true, callback: open_settings});
  binder.register({key: "s", ctrl: true, callback: () => {
    if (main.filepath) deckmaster.saveDeck(main.filepath);
    else deckmaster.saveAs();
  }});
  binder.register({key: "s", ctrl: true, shift: true, callback: deckmaster.saveAs});
});
