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

  setArrays() {
    var arrays = document.querySelector("#arrays");
    arrays.innerHTML = "";
    var keys = Object.keys(this.data.arrays);
    keys.forEach(key => {
      arrays.innerHTML += `<div class="array-item" onclick="combo_editor.loadArray('${key}')">${key}<span style="float: right;color:red;" onclick="combo_editor.removeArray(this.parentElement)">&#10006;</span></div>`;
    });
  }

  setCombos() {
    var combos = document.querySelector("#all-combos");
    combos.innerHTML = "";
    var keys = this.data.combos.length;
    for (let i = 0; i < keys; i++) {
      if (!this.data.combos[i]) continue;
      combos.innerHTML += `<div class="array-item" title="${i}" onclick="combo_editor.loadCombo('${i}')">${this.data.combos[i].name}<span style="float: right;color:red;" onclick="combo_editor.removeCombo(this.parentElement)">&#10006;</span></div>`;
    }
  }

  setup() {
    this.filepath = undefined;
    this.data = {
      name: "",
      version: "",
      author: "",
      arrays: {},
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
        this.setArrays();
        this.setCombos();
      }
    });
  }

  // TODO
  loadCombo(key) {
    if (!this.data.combos[+key]) return;
    this.currentCombo = +key;
    document.querySelector("#array-screen").style.display = "none";
    document.querySelector("#combo-screen").style.display = "block";
    document.querySelector("#combo-name").value = this.data.combos[+key].name;
    document.querySelector("#combo-desc").innerHTML = this.data.combos[+key].desc;
    document.querySelector("#combo-turn").innerHTML = this.data.combos[+key].turn;
  }

  loadArray(key) {
    this.currentArray = key;
    document.querySelector("#display-array-name").innerHTML = key;
    document.querySelector("#combo-screen").style.display = "none";
    document.querySelector("#array-screen").style.display = "block";
    var array = this.data.arrays[key];
    if (!array) return;
    var list = document.querySelector(".array-list");
    list.innerHTML = "";
    array.forEach(itm => {
      list.innerHTML += `<div class="item">${itm}<span style="float: right;color:red;" onclick="combo_editor.removeArrayItem(this.parentElement);this.parentElement.remove()">&#10006;</span></div>`;
    });
  }

  isValidQuery(q) {
    if (q == "") return false;
    if (typeof(+q) == "number" && !isNaN(+q)) return true;
    var names = [
      "name",
      "type",
      "desc",
      "atk",
      "def",
      "level",
      "race",
      "attribute",
      "scale",
      "archetype",
      "linkval"
    ];
    try {
      var objects = q.split(",");
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        var split = obj.split("=");
        if (split[1] == "") return false;
        if (!names.includes(split[0]) || !(split.length == 2)) return false;
      }
    } catch {}
    return true;
  }

  validateArrayItem() {
    var q = document.querySelector("#array-itemname");
    if (this.isValidQuery(q.value)) {
      q.classList.remove("err");
    } else {
      q.classList.add("err");
    }
  }

  addArrayItem() {
    var q = document.querySelector("#array-itemname");
    console.log(this.isValidQuery(q.value));
    if (!this.isValidQuery(q.value)) {
      q.classList.add("err");
      return;
    }
    q.classList.remove("err");
    this.data.arrays[this.currentArray].push(q.value);
    document.querySelector(".array-list").innerHTML += `<div class="item">${q.value}<span style="float: right;color:red;" onclick="combo_editor.removeArrayItem(this.parentElement);this.parentElement.remove()">&#10006;</span></div>`
    q.value = "";
  }

  removeArrayItem(value) {
    value = value.innerHTML.split("<span")[0];
    var index = this.data.arrays[this.currentArray].indexOf(value);
    if (index > -1) {
      this.data.arrays[this.currentArray].splice(index, 1);
    }
  }

  removeArray(el) {
    var value = el.innerHTML.split("<span")[0];
    delete this.data.arrays[value];
    el.remove();
  }

  removeCombo(el) {
    var value = el.title;
    value = +value;
    delete this.data.combos[value];
    if (value == this.currentCombo) this.currentCombo == undefined;
    el.remove();
  }

  addArray() {
    var array_name = document.querySelector("#array-name");
    if (this.data.arrays[array_name.value]) {
      this.alert(`Array '${array_name.value}' already exists`);
      array_name.classList.add("err");
      setTimeout(() => {
        array_name.classList.remove("err");
      }, 200);
    } else {
      this.data.arrays[array_name.value] = [];
      const arrays = document.querySelector("#arrays");
      arrays.innerHTML += `<div class="array-item" onclick="combo_editor.loadArray('${array_name.value}')">${array_name.value}<span style="float: right;color:red;" onclick="combo_editor.removeArray(this.parentElement)">&#10006;</span></div>`;
      arrays.parentElement.style.maxHeight = arrays.parentElement.scrollHeight+"px";
    }
  }

  addCombo() {
    var combos = document.querySelector("#all-combos");
    this.data.combos[this.data.combos.length] = {
      name: "New combo",
      desc: "",
      turn: "first",
      variants: []
    };
    this.setCombos();
    combos.parentElement.style.maxHeight = combos.parentElement.scrollHeight+"px";
  }

  alert(msg) {
    notify(`<div id='ycb'>${msg}</div>`, 'ycb', 3000);
  }

  save() {
    if (!this.filepath) return this.saveAs();
    this.data.combos = this.data.combos.filter((itm) => {if (itm) return true;});
    this.setCombos();
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
