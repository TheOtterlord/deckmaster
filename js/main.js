const { remote } = require('electron');

const app = remote.app;

const win = remote.getCurrentWindow();

function openChangelog() {
  document.querySelector(".fade-bg").classList.remove("hide");
  document.querySelector(".changelog").classList.add("show");
}

function closeChangelog() {
  document.querySelector(".fade-bg").classList.add("hide");
  document.querySelector(".changelog").classList.remove("show");
}

let binder, settings;

ipcRenderer.on("cmd", (ev, args) => {
  const arg = args[args.length - 1];
  if (arg.endsWith(".ydk")) {
    ygoprodeck.on("load", () => deckmaster.openDeck(args[args.length - 1]));
  }
});

ipcRenderer.on("discord", (ev, connected) => {
  if (connected) notify("Connected to Discord", 3000);
  else notify("Disconnected from Discord", 3000);
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("lastversion") != deckmaster.version) {
    document.querySelector(".version").innerHTML = deckmaster.version;
    localStorage.setItem("lastversion", deckmaster.version);
    openChangelog();
  }
  settings = new Settings();
  var recent = document.querySelector(".recent .padding .list");
  deckmaster.getRecentDocs().forEach(path => {
    recent.innerHTML = `<a onclick="deckmaster.open(this.children[0].innerHTML)">${path.split("/").pop().split("\\").pop()}<span style="display:none;">${path}</span></a>` + recent.innerHTML;
  });

  binder = new Keybinder();
});
