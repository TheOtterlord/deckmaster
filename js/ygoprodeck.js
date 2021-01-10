const https = require('https');
const fs = require('fs');

var ygodata;

const DEFAULT_IMG = "bg.webp";
const ygoprodeck = {
  version: "v7",
  file: "cards.json",
  connect_ygopro: (path) => {
    fs.mkdir(paths.join(path, "combos"), () => {});
    localStorage.setItem("ygopro", path);
  },
  dl_image: (id, el) => {
    if (localStorage.getItem("ygopro")) {
      path = localStorage.getItem("ygopro");
      path += "\\pics\\" + id + ".jpg";
    } else {
      if (!fs.existsSync("images\\")) {
        // make folder
        fs.mkdir("images\\", (err) => {
          if (err) {
            console.log("Error: ", e);
          }
        });
      }
      path = "images\\" + id + ".jpg";
    }
    if (fs.existsSync(path)) {
      return path;
    }
    if (ygodata.cards[id]) {
      var file = fs.createWriteStream(path);
      var request = https.get(ygodata.cards[id].card_images[0].image_url, function (response) {
        response.pipe(file);
        response.on('end', () => {
          // timeout required to let download completely finish and full image to be available
          setTimeout(() => {
            // path redeclaration required to fix img duplication bug
            if (localStorage.getItem("ygopro")) {
              path = localStorage.getItem("ygopro");
              path += "\\pics\\" + id + ".jpg";
            } else {
              path = "images\\" + id + ".jpg";
            }
            el.children[0].src = path;
          }, 100);
        });
      });
    }
    return DEFAULT_IMG;
  },
  linkYGOPro: () => {
    dialog.showOpenDialog(null, {
      properties: ['openDirectory']
    }).then((result) => {
      var btns = document.querySelectorAll(".ygopro_connect")
      for (let i = 0; i < btns.length; i++) {
        const btn = btns[i];
        btn.innerHTML = result.filePaths[0];
      }
      ygoprodeck.connect_ygopro(result.filePaths[0]);
    });
  },
  fetch: () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(xhttp.responseText);
        var date = new Date();
        var cards = {
          updated: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
          cards: {}
        };
        for (let i = 0; i < json.data.length; i++) {
          cards.cards[`${json.data[i].id}`] = json.data[i];
        }
        ygodata = cards;
        console.log("Received new card data");
        fs.writeFile(paths.join("__dirname", "../", ygoprodeck.file), JSON.stringify(cards), (err) => {
          if (err) {
            console.log(`Failed to write to ${ygoprodeck.file}`);
          }
        });
      }
    };
    xhttp.open("GET", `https://db.ygoprodeck.com/api/${ygoprodeck.version}/cardinfo.php?misc=yes`, true);
    xhttp.send();
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(xhttp2.responseText);
        ygodata.sets = json;
        console.log("Received new cardset data");
        fs.writeFile(paths.join("__dirname", "../", "sets.json"), JSON.stringify(json), (err) => {
          if (err) {
            console.log(`Failed to write to ${ygoprodeck.file}`);
          }
        });
      }
    };
    xhttp2.open("GET", `https://db.ygoprodeck.com/api/${ygoprodeck.version}/cardsets.php`, true);
    xhttp2.send();
  },
  search: (search) => {
    search = search.toLowerCase();
    // exact match id
    if (ygodata.cards[search]) {
      return [search];
    }
    var results = [];
    var keys = Object.keys(ygodata.cards);
    // filter
    filters_ = filters.all();
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      var card = ygodata.cards[key];
      if (card.name.toLowerCase().includes(search) || card.desc.toLowerCase().includes(search)) {
        var ok = 1;
        for (let i2 = 0; i2 < filters_.length; i2++) {
          var filter = filters_[i2];
          if (`${card[filter[0]]}` != filter[1]) {
            ok = 0;
          }
        }
        if (filters.supertype == "Monster" && !filters.Monster.includes(card.type)) {
          ok = 0;
        }
        if (card.type == "Token") ok=0;
        if (ok != 0 && filters.card_set && !card?.card_sets?.filter(set => {return set.set_code.split("-")[0] == filters.card_set}).length) {
          ok = 0;
        }
        if (ok==1) {
          results.push(key);
        }
      }
    }
    return results.sort((a, b) => {
      a = ygodata.cards[a];
      b = ygodata.cards[b];
      var c = a;
      var d = b;
      var sort = filters.key.split(".");
      for (let i = 0; i < sort.length; i++) {
        const key = sort[i];
        a = a[key];
        b = b[key];
      }
      if (a > b) {
        return 1;
      } else if (a == b) {
        if (a == undefined) return 1;
        else if (b == undefined) return -1;
        else {
          if (c.name > d.name) return 1;
          else if (c.name == d.name) return 0;
          else return -1;
        }
        return 0;
      } else if (a < b) {
        return -1;
      } else if (a == undefined) {
        return 1;
      } else if (b == undefined) {
        return -1;
      } else {
        console.log(a, b);
      }
    });;
  }
}

const filters = {
  key: "name",
  sort(val) {
    if (val == "undefined") this.key = "id";
    else if (val == "set") this.key = "misc_info.0.tcg_date";
    else this.key = val;
  },
  all() {
    var all = [];
    filters.supertype && filters.supertype != "Monster" ? all.push(["type", filters.supertype+" Card"]) : null;
    filters.cardtype && filters.supertype == "Monster" ? all.push(["type", filters.cardtype]) : null;
    filters.cardtype && filters.supertype == "Spell" ? all.push(["race", filters.cardtype]) : null;
    filters.cardtype && filters.supertype == "Trap" ? all.push(["race", filters.cardtype]) : null;
    filters.race && filters.supertype == "Monster" ? all.push(["race", filters.race]) : null;
    filters.supertype == "Monster" && filters.atk && filters.atk != "" ? all.push(["atk", filters.atk]) : null;
    filters.supertype == "Monster" && filters.def && filters.def != "" ? all.push(["def", filters.def]) : null;
    if (filters.supertype == "Monster" && filters.cardtype && filters.level && filters.level != "") {
      ["XYZ Monster","XYZ Pendulum Effect Monster"].includes(filters.cardtype) ? all.push(["level", filters.level]) : ("Link Monster" == filters.cardtype ? all.push(["linkval", filters.level]) : all.push(["level", filters.level]));
    }
    filters.supertype == "Monster" && filters.scale ? all.push(["scale", filters.scale]) : null;
    filters.supertype == "Monster" && filters.attribute ? all.push(["attribute", filters.attribute]) : null;
    return all;
  },
  Monster: [
    "Effect Monster",
    "Flip Effect Monster",
    "Flip Tuner Effect Monster",
    "Gemini Monster",
    "Normal Monster",
    "Normal Tuner Monster",
    "Pendulum Effect Monster",
    "Pendulum Flip Effect Monster",
    "Pendulum Normal Monster",
    "Pendulum Tuner Effect Monster",
    "Ritual Effect Monster",
    "Ritual Monster",
    "Spirit Monster",
    "Toon Monster",
    "Tuner Monster",
    "Union Effect Monster",
    "Fusion Monster",
    "Link Monster",
    "Pendulum Effect Fusion Monster",
    "Synchro Monster",
    "Synchro Pendulum Effect Monster",
    "Synchro Tuner Monster",
    "XYZ Monster",
    "XYZ Pendulum Effect Monster"
  ],
  Spell: [
    "Normal",
    "Field",
    "Equip",
    "Continuous",
    "Quick-Play",
    "Ritual"
  ],
  Trap: [
    "Normal",
    "Continuous",
    "Counter"
  ],
  update(el) {
    filters[el.id] = el.value == "undefined" ? undefined : el.value;
    if (el.id == "supertype") {
      if (el.value == "Monster") {
        document.querySelector("#race").disabled = undefined;
        document.querySelector("#atk").disabled = undefined;
        document.querySelector("#def").disabled = undefined;
        document.querySelector("#level").disabled = undefined;
        document.querySelector("#scale").disabled = undefined;
        document.querySelector("#attribute").disabled = undefined;
      } else {
        document.querySelector("#race").selectedIndex = 0;
        filters.race = undefined;
        document.querySelector("#race").disabled = "true";
        document.querySelector("#atk").value = "";
        filters.atk = undefined;
        document.querySelector("#atk").disabled = "true";
        document.querySelector("#def").value = "";
        filters.def = undefined;
        document.querySelector("#def").disabled = "true";
        document.querySelector("#level").value = "";
        filters.level = undefined;
        document.querySelector("#level").disabled = "true";
        document.querySelector("#scale").value = "";
        filters.scale = undefined;
        document.querySelector("#scale").disabled = "true";
        document.querySelector("#attribute").selectedIndex = 0;
        filters.attribute = undefined;
        document.querySelector("#attribute").disabled = "true";
      }
      if (el.value == "undefined") {
        document.querySelector("#cardtype").selectedIndex = 0;
        filters.cardtype = undefined;
        document.querySelector("#cardtype").disabled = "true";
      } else {
        document.querySelector("#cardtype").disabled = undefined;
      }
      for (let i = 0; i < document.querySelector("#cardtype").children.length; i++) {
        const el2 = document.querySelector("#cardtype").children[i];
        if (filters.supertype && (filters[el.value].includes(el2.value) || el2.value == "undefined")) {
          el2.style.display = "block";
        } else {
          el2.style.display = "none";
        }
      }
    }
    search(document.querySelector(".search .padding .searchbar").value);
  }
};

document.addEventListener("DOMContentLoaded", (ev) => {
  fs.readFile(paths.join("__dirname", "../", ygoprodeck.file), (err, data) => {
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
        fs.readFile(paths.join("__dirname", "../", "sets.json"), (err, data) => {
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
          }
        });
      }
    }
  });
});
