const { dialog } = require('electron').remote;
const paths = require('path');

const deckmaster = {
  version: "v0.6.0",
  notification: (title, text, onclick) => {
    const notification = new Notification(title, {
      body: text
    });
    notification.onclick = onclick;
  },
  reset_all: () => {
    localStorage.clear();
    deckmaster.restart();
  },
  setup: () => {
    localStorage.setItem("settings", JSON.stringify({
      "settingsVersion": "0.1.0"
    }));
    document.querySelector(".intro").style.display = "none";
    document.querySelector(".start-screen").style.display = "block";
  },
  link: (url) => {
    window.open(url, "_blank");
  },
  wiki: () => {
    deckmaster.link("https://theotterlord.github.io/deckmaster");
  },
  toHome: () => {
    var startscreen = document.querySelector(".start-screen");
    var el_editor = document.querySelector(".editor");
    el_editor.style.display = "none";
    startscreen.style.display = "block";
    var recent = document.querySelector(".recent .padding .list");
    deckmaster.getRecentDocs().forEach(path => {
      recent.innerHTML = `<a onclick="deckmaster.open(this.innerHTML)">${path}</a>` + recent.innerHTML;
    });
  },
  open(path) {
    if (path.endsWith(".ydk")) this.openDeck(path);
    else if (path.endsWith(".ycb")) this.openCombo(path);
    else alert(`Failed to find action for '${path}'`);
  },
  restart: () => {
    app.relaunch();
    app.exit();
  },
  close: () => {
    app.exit();
  },
  openLink: (url) => {
    window.open(url);
  },
  getRecentDocs: () => {
    var docs = localStorage.getItem('recent_docs');
    if (docs == undefined) {
      return [];
    } else {
      try {
        return JSON.parse(docs);
      } catch {
        return [];
      };
    }
  },
  removeRecentDocs: (path) => {
    var docs = localStorage.getItem('recent_docs');
    if (docs == undefined) {
      docs = "[]";
    }
    docs = JSON.parse(docs);
    if (docs.includes(path)) {
      var index = docs.indexOf(path);
      var new_docs = [];
      for (let i = 0; i < docs.length; i++) {
        if (i != index) {
          new_docs.push(docs[i]);
        }
      }
      docs = new_docs;
    }
    if (docs.length > 10) {
      docs = docs.splice(docs.length - 10, docs.length);
    }
    localStorage.setItem("recent_docs", JSON.stringify(docs));
    return docs;
  },
  addRecentDocs: (path) => {
    var docs = localStorage.getItem('recent_docs');
    if (docs == undefined) {
      docs = "[]";
    }
    docs = JSON.parse(docs);
    if (docs.includes(path)) {
      var index = docs.indexOf(path);
      var new_docs = [];
      for (let i = 0; i < docs.length; i++) {
        if (i != index) {
          new_docs.push(docs[i]);
        }
      }
      docs = new_docs;
    }
    docs.push(path);
    if (docs.length > 10) {
      docs = docs.splice(docs.length - 10, docs.length);
    }
    localStorage.setItem("recent_docs", JSON.stringify(docs));
    return docs;
  },
  saveDeck(path) {
    var save_deck = editor.getDeck();
    editor.setDeckname(path.split("\\").reverse()[0]);
    main.filepath = path;
    fs.writeFile(path, editor.json_to_ydk(save_deck), (err) => {
      if (err) {
        console.log(`Failed to write to ${path}`);
      } else {
        notify(`<div id='saved'>
          Your deck has been saved
        </div>`, 'saved', 3000);
      }
    });
  },
  saveAs() {
    if (document.querySelector(".combo-editor").style.display == "block") return combo_editor.saveAs();
    var path = localStorage.getItem('ygopro');
    dialog.showSaveDialog(
      { 
        defaultPath: path ? paths.join(path, 'deck') : '~', 
        filters: [
          { name: 'Yu-Gi-Oh! deck file', extensions: ['ydk'] },
          { name: 'All Files', extensions: ['*'] }
        ] 
      }
    ).then((path) => {
      if (path.filePath) deckmaster.saveDeck(path.filePath)
    });
  },
  newDeck() {
    var startscreen = document.querySelector(".start-screen");
    var el_editor = document.querySelector(".editor");
    startscreen.style.display = "none";
    el_editor.style.display = "block";
    fade(el_editor);
    editor.setDeckname("");
    main.filepath = undefined;
    main.clear();
    extra.clear();
    side.clear();
    deckchanges.clear();
    deckchanges.default = {main: [], extra: [], side: []};
    combos.splice(0, combos.length);
    updateCombos();
  },
  openDeck(path) {
    if (path) {
      this.addRecentDocs(path);
      var startscreen = document.querySelector(".start-screen");
      var el_editor = document.querySelector(".editor");
      startscreen.style.display = "none";
      el_editor.style.display = "block";
      fade(el_editor);
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log("File does not exist (" + path + ")");
        } else {
          main.clear();
          extra.clear();
          side.clear();
          deck = editor.ydk_to_json(data.toString());
          main.filepath = path;
          main.addCards(deck.main);
          extra.addCards(deck.extra);
          side.addCards(deck.side);
          deckchanges.clear();
          deckchanges.default = deck;
          editor.setDeckname(path.split("\\").reverse()[0]);
          editor.setAuthor(deck.author);
          combos.splice(0, combos.length);
          updateCombos();
          editor.loadCombos();
        }
      });
    } else {
      var path = localStorage.getItem("ygopro");
      dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: path ? paths.join(path, "deck") : "~",
        filters: [
          { name: "Yu-Gi-Oh! deck file", extensions: ["ydk"] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then((data) => {
        var file = data.filePaths[0];
        if (file == undefined) {
          return;
        }
        deckmaster.openDeck(file);
      });
    }
  },
  openCombo(path) {
    if (path) {
      this.addRecentDocs(path);
      var startscreen = document.querySelector(".start-screen");
      var el_editor = document.querySelector(".combo-editor");
      startscreen.style.display = "none";
      el_editor.style.display = "block";
      fade(el_editor);
      combo_editor.load(path);
    } else {
      var path = localStorage.getItem("ygopro");
      dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: path ? paths.join(path, "combos") : "~",
        filters: [
          { name: "Yu-Gi-Oh! combo file", extensions: ["ycb"] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then((data) => {
        var file = data.filePaths[0];
        if (file == undefined) {
          return;
        }
        deckmaster.openCombo(file);
      });
    }
  },
  newCombo() {
    var startscreen = document.querySelector(".start-screen");
    var el_editor = document.querySelector(".combo-editor");
    startscreen.style.display = "none";
    el_editor.style.display = "block";
    fade(el_editor);
    combo_editor.setup();
  }
};
