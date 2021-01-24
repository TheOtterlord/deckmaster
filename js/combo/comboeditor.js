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

  loadCombo(key) {
    if (!this.data.combos[+key]) return;
    this.currentCombo = +key;
    document.querySelector("#array-screen").style.display = "none";
    document.querySelector("#combo-screen").style.display = "block";
    document.querySelector("#combo-name").value = this.data.combos[+key].name;
    document.querySelector("#combo-desc").innerHTML = this.data.combos[+key].desc;
    document.querySelector("#combo-turn").value = this.data.combos[+key].turn;
    var variants = document.querySelector("#combo-variants");
    variants.innerHTML = "";
    this.data.combos[+key].variants.forEach((_, i) => {
      variants.innerHTML += `<div class="array-item" onclick="combo_editor.loadVariant(${i})" title="${i+1}">Variant: ${i+1}<span style="float: right;color:red;" onclick="combo_editor.removeVariant(this.parentElement);">&#10006;</span></div>`;
    });
    document.querySelector("#combo-screen").children[1].style.display = "none";
  }

  addTest() {
    var query = document.querySelector("#variant-query").value;
    if (!this.isValidQuery(query)) return;
    var test = {
      target: document.querySelector("#variant-target").value,
      query,
    };
    var min = document.querySelector("#variant-min");
    var max = document.querySelector("#variant-max");
    if (min.value != "") test.min = min.value;
    if (max.value != "") test.max = max.value;
    if (min.value == "" && max.value == "") return;
    this.data.combos[this.currentCombo].variants[this.currentVariant].tests.push(test);
    this.loadVariant(this.currentVariant);
  }

  removeTest(node) {
    var el = node;
    var index = 0;
    while ( (el = el.previousElementSibling) ) {
        index++;
    }
    this.data.combos[this.currentCombo].variants[this.currentVariant].tests.splice(index, 1);
    node.remove();
  }

  addVariant() {
    this.data.combos[this.currentCombo].variants.push({
      tests: []
    });
    this.loadCombo(this.currentCombo);
    this.loadVariant(this.data.combos[this.currentCombo].variants.length-1);
  }

  loadVariant(i) {
    this.currentVariant = i;
    const variant = this.data.combos[this.currentCombo].variants[i];
    const tests = document.querySelector("#variant-tests");
    tests.innerHTML = "";
    variant.tests.forEach(test => {
      tests.innerHTML += `<div class="item">'${test.query}' in '${test.target}' - ${test.min ? 'min: '+test.min : ''}${test.min && test.max ? ', ' : ''}${test.max ? 'max: '+test.max : ''} ${`<a class='ir-faded-text'>${get_preview(test.query, this.data.arrays)}</a>` ?? ""}<span style="float: right;color:red;" onclick="combo_editor.removeTest(this.parentElement);">&#10006;</span></div>`;
    });
    document.querySelector("#combo-screen").children[1].style.display = "block";
  }

  removeVariant(el) {
    var value = +el.title;
    value = value-1;
    delete this.data.combos[this.currentCombo].variants[value];
    if (value == this.currentVariant) this.currentVariant == undefined;
    document.querySelector("#combo-screen").children[1].style.display = "none";
    el.remove();
  }

  loadArray(key) {
    this.currentArray = key;
    document.querySelector("#display-array-name").innerHTML = key;
    document.querySelector("#combo-screen").style.display = "none";
    document.querySelector("#array-screen").style.display = "block";
    var array = this.data.arrays[key];
    if (!array) return;
    var list = document.querySelector("#array-list");
    list.innerHTML = "";
    array.forEach(itm => {
      list.innerHTML += `<div class="item">${itm} ${`<a class='ir-faded-text'>${get_preview(itm, this.data.arrays)}</a>` ?? ""}<span style="float: right;color:red;" onclick="combo_editor.removeArrayItem(this.parentElement);this.parentElement.remove()">&#10006;</span></div>`;
    });
  }

  isValidQuery(q) {
    if (q == "") return false;
    if (typeof(+q) == "number" && !isNaN(+q)) return true;
    if (q.startsWith("arrays.")) return true;
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

  validateTestQuery() {
    var q = document.querySelector("#variant-query");
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
    document.querySelector("#array-list").innerHTML += `<div class="item">${q.value}<span style="float: right;color:red;" onclick="combo_editor.removeArrayItem(this.parentElement);this.parentElement.remove()">&#10006;</span></div>`
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
    for (let i = 0; i < this.data.combos.length; i++) {
      const combo = this.data.combos[i];
      combo.variants = combo.variants.filter(itm => {if (itm) return true;});
    }
    this.setCombos();
    this.loadCombo(this.currentCombo);
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
