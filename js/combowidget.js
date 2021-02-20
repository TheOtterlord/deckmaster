const combos = [];
var selected = -1;

function selectMod(i) {
  var widget = document.querySelector(".combo-widget").children[0];
  for (let i = 0; i < widget.children.length; i++) {
    if (widget.children[i].children.length != 0) {continue}
    widget.children[i].classList.remove("active");
  }
  widget.children[i].classList.add("active");
  selected = i;
}

function selectCombo() {}

function displayComboMod(i) {
  // TODO
}

function displayCombo(i, i2) {
  // var combo = combos[i].combos[i2];
  // var img = document.querySelector(".preview .img img");
  // img.src = DEFAULT_IMG;
  // var text = document.querySelector(".preview .cardtext");
  // text.innerHTML = "";
  // text.innerHTML += `<h4>${combo.name}</h4>`;
  // text.innerHTML += `<p>${combo.desc}</p>`;
  // text.innerHTML += "<b>Raw Values</b>";
  // text.innerHTML += "<ul>";
  // for (let i = 0; i < combo.variants.length; i++) {
  //   var variant = combo.variants[i];
  //   text.innerHTML += `<li>Test ${i + 1}: ${variant.exact.toFixed(3)}%</li>`;
  // }
  // text.innerHTML += "</ul>";
  // text.innerHTML += `<p>Total Chance: ${combo.exact.toFixed(3)}%</p>`;
}

function addComboMod() {
  path = localStorage.getItem("ygopro");
  dialog.showOpenDialog(
    {
      defaultPath: path && fs.existsSync(paths.join(path, "combos")) ? paths.join(path, 'combos') : '~',
      filters: [
        { name: 'Yu-Gi-Oh! combo module', extensions: ['ycb'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }
  ).then((path) => {
    path = path.filePaths[0];
    if (!path) { return }
    fs.readFile(path, (err, data) => {
      if (err) {
        console.log("Failed to open file");
      } else {
        data = JSON.parse(data.toString());
        addCombos(data);
      }
    });
    editor.linkCombo(path);
  });
}

function addCombos(data) {
  combos.push(data);
  updateCombos();
}

function removeCombo() {
  if (selected != -1) {
    combos.splice(Math.round(selected/2), 1);
    console.log(combos);
    editor.unlinkCombo();
    updateCombos();
  }
}

function toggleMod(i) {
  var widget = document.querySelector(".combo-widget").children[0];
  widget.children[i+1].classList.toggle("active");
}

function updateCombos() {
  // update values
  updateVals();
  // update widget
  var widget = document.querySelector(".combo-widget").children[0];
  var open = [];
  for (let i = 0; i < widget.children.length; i++) {
    const el = widget.children[i];
    if (el.classList.contains("active") && el.children.length != 0) {
      open.push(i);
    }
  }
  widget.innerHTML = "";

  combos.forEach((comboMod, i) => {
    // sort combos by value (high to low)
    comboMod.combos.sort((a, b) => b.val - a.val);
    text = `<h4 onmouseover="displayComboMod(${i})" onclick="toggleMod(${i*2});selectMod(${i*2})" title="By ${comboMod.author}">${comboMod.name}</h4><ul>`;
    comboMod.combos.forEach((combo, i2) => {
      text += `<li onmouseover="displayCombo(${i},${i2})" onclick="selectCombo(this)">${combo.name} | <a>${combo.val}%</a></li>`;
    });
    text += "</ul>";
    widget.innerHTML += text;
    for (let i = 0; i < widget.children.length; i++) {
      if (open.includes(i)) {
        widget.children[i].classList.add("active");
      }
    }
  });
}

function updateVals() {
  var deck = editor.getDeck();
  combos.forEach(comboMod => {
    comboMod.combos.forEach(combo => {
      combo.exact = 0;
      for (let i = 0; i < combo.variants.length; i++) {
        const variant = combo.variants[i];
        variant.turn = combo.turn;
        var cmb = new Combo(deck, variant, comboMod.arrays);
        var exact = cmb.compute();
        variant.exact = exact;
        combo.exact += exact;
      }
      combo.val = Math.round(combo.exact);
      if (combo.val == 0 && combo.exact != 0) {
        combo.val = ">1";
      }
    });
  });
}
