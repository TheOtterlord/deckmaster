const { remote, clipboard } = require('electron');

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

function viewLogs() {
  document.querySelector(".logs").style.display = "block";
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

window.addEventListener("error", (ev) => {
  const {message, filename, lineno, colno, error} = ev;
  notify(`<div onclick="viewLogs()">${message}</div>`, 5000);
  document.querySelector(".logs").firstElementChild.innerHTML += `\n${error}`;
  ipcRenderer.send("error", {message, filename, lineno, colno, error});
});

window.addEventListener("load", () => {
  // Load Cards & Sets
  fs.readFile(paths.join(__dirname, "../", ygoprodeck.file), (err, data) => {
    if (err) {
      ygoprodeck.fetch();
    } else {
      data = JSON.parse(data);
      ygodata = data;
      var date = new Date();
      if (data.updated < `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`) {
        ygoprodeck.fetch();
      } else {
        console.log("Loaded cards from memory");
        fs.readFile(paths.join(__dirname, "../", "sets.json"), (err, data) => {
          if (err) {
            ygoprodeck.fetch();
          } else {
            data = JSON.parse(data);
            ygodata.sets = data;
            console.log("Loaded sets from memory");
            var options = document.querySelector("#card_set");
            data.forEach(set => {
              options.innerHTML += `<option value="${set.set_code}">${set.set_name}</option>`;
            });
            ygoprodeck.trigger("load");
          }
        });
      }
    }
  });

  // Prep changelog
  document.querySelector(".version").innerHTML = deckmaster.version;
  if (localStorage.getItem("lastversion") != deckmaster.version) {
    localStorage.setItem("lastversion", deckmaster.version);
    openChangelog();
  }

  // Prep settings
  document.querySelector(".ir-flex.ygopro_connect").innerHTML = (localStorage.getItem("ygopro") ?? "No folder selected...");
  settings = new Settings();
  var recent = document.querySelector(".recent .padding .list");
  deckmaster.getRecentDocs().forEach(path => {
    recent.innerHTML = `<a onclick="deckmaster.open(this.children[0].innerHTML)">${path.split("/").pop().split("\\").pop()}<span style="display:none;">${path}</span></a>` + recent.innerHTML;
  });
  binder = new Keybinder();

  // Load deck editor
  loadDeckEditor();

  // Remove load screen
  setTimeout(() => {
    document.querySelector(".load-screen").classList.add("loaded");
    setTimeout(() => document.querySelector(".load-screen").style.display = "none", 350)
  }, 500);
});
