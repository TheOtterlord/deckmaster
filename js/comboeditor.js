let combo_editor;

function toggleCollapse(btn) {
  var el = btn.nextElementSibling;
  btn.classList.toggle("active");
  if (el.style.maxHeight) {
    el.style.maxHeight = null;
  } else {
    el.style.maxHeight = el.scrollHeight + "px";
  }
}

class ComboEditor {
  constructor() {
    this.setup();
  }

  setup() {
    this.filepath = undefined;
    this.data = {
      name: "",
      version: "",
      author: "",
      arrays: [],
      combos: []
    };
  }

  load(filepath) {
    this.setup();
    this.filepath = filepath;
    fs.readFile(filepath, (err, data) => {
      if (err) console.error(err);
      else {
        data = JSON.parse(data);
        this.data = data;
        document.querySelector("#meta-name").value = data.name;
        document.querySelector("#meta-version").value = data.version;
        document.querySelector("#meta-author").value = data.author;
        // TODO: Add load arrays and combos
      }
    });
  }

  alert(msg) {
    notify(`<div id='ycb'>${msg}</div>`, 'ycb', 3000);
  }

  save() {
    if (!this.filepath) return this.saveAs();
    fs.writeFile(this.filepath, JSON.stringify(this.data), (err) => {
      if (err) console.error(err);
      else {
        deckmaster.addRecentDocs(this.filepath);
        combo_editor.alert("Saved combo module");
      }
    });
  }

  saveAs() {
    var path = localStorage.getItem("ygopro");
    dialog.showSaveDialog(
      {
        defaultPath: path ? paths.join(path, 'combos') : '~',
        filters: [
          { name: 'Yu-Gi-Oh! combo file', extensions: ['ycb'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }
    ).then((path) => {
      if (path.filePath) {
        combo_editor.filepath = path.filePath;
        combo_editor.save();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  combo_editor = new ComboEditor();
});
