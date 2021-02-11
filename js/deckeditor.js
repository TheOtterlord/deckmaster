const editor = {
  ydk_to_json: (text) => {
    var json = {
      main: [],
      extra: [],
      side: [],
      author: "unknown"
    };
    var lines = text.split("\n");
    var target = "main";
    lines.forEach(line => {
      if (line.startsWith("#")) {
        if (line.startsWith("#main")) {
          target = "main";
        } else if (line.startsWith("#extra")) {
          target = "extra";
        } else if (line.startsWith("#created by ")) {
          json.author = line.split("#created by ")[1];
        }
      } else if (line.startsWith("!side")) {
        target = "side";
      } else if (line != "") {
        line = parseInt(line);
        json[target].push(line);
      }
    });
    return json;
  },
  json_to_ydk: (json) => {
    var ydk = "#created by " + json.author + "\n";
    ydk += "#main\n";
    for (let i = 0; i < json.main.length; i++) {
      ydk += json.main[i] + "\n";
    }
    ydk += "#extra\n";
    for (let i = 0; i < json.extra.length; i++) {
      ydk += json.extra[i] + "\n";
    }
    ydk += "!side\n";
    for (let i = 0; i < json.side.length; i++) {
      ydk += json.side[i] + "\n";
    }
    return ydk;
  },
  delete: () => {
    fs.unlink(main.filepath, (err) => {
      if (err) {
        throw err;
      }
      notify(`The deck at ${main.filepath} has been deleted!`, 3000);
      deckmaster.removeRecentDocs(main.filepath);
      main.filepath = undefined;
      deckmaster.toHome();
    });
  },
  getDeck: () => {
    var json = {
      main: [],
      extra: [],
      side: [],
      author: document.querySelector(".cell.info .author").value
    };
    for (let i = 0; i < main.el.children.length; i++) {
      const card = main.el.children[i].id;
      json.main.push(card);
    }
    for (let i = 0; i < extra.el.children.length; i++) {
      const card = extra.el.children[i].id;
      json.extra.push(card);
    }
    for (let i = 0; i < side.el.children.length; i++) {
      const card = side.el.children[i].id;
      json.side.push(card);
    }
    return json;
  },
  exportImage: async () => {
    if (document.querySelector(".editor").style.display != "block") return;

    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display != "none") {
        openDropdown.style.display = "none";
      }
    }
    
    const { left, top, width, height } = document.querySelector('#deck').getBoundingClientRect();
    win.webContents.capturePage({x: Math.round(left), y: Math.round(top), width: Math.round(width), height: Math.round(height)})
    .then(image => {
      const buff = image.toPNG();
      dialog.showSaveDialog(win, 
        {
          filters: [
            { name: 'PNG', extensions: ['png'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        }
      ).then(save => {
        if (save.filePath) {
          fs.open(save.filePath, 'w', function(err, fd) {
            if (err) console.error(err);
            fs.write(fd, buff, 0, buff.length, null, function(err) {
                if (err) console.error(err);
            });
          });
        }
      });
    });
  },
  linkCombo: (path) => {
    var deck = document.querySelector(".cell.info .deckname").value;
    var combos = JSON.parse(localStorage.getItem(deck));
    if (combos) {
      combos.push(path);
    } else {
      combos = [path];
    }
    localStorage.setItem(deck, JSON.stringify(combos));
  },
  unlinkCombo: (i) => {
    var deck = document.querySelector(".cell.info .deckname").value;
    var combos = JSON.parse(localStorage.getItem(deck));
    if (combos) {
      combos.splice(i, 1);
    } else {
      combos = [];
    }
    localStorage.setItem(deck, JSON.stringify(combos));
  },
  loadCombos: () => {
    var deck = document.querySelector(".cell.info .deckname").value;
    var all_paths = JSON.parse(localStorage.getItem(deck));
    if (!all_paths) {return}
    for (let i = 0; i < all_paths.length; i++) {
      const path = all_paths[i];
      if (!path) { return }
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log("Failed to open file");
        } else {
          data = JSON.parse(data.toString());
          addCombos(data);
        }
      });
    }
  },
  setDeckname: (name) => {
    document.querySelector(".cell.info .deckname").value = name;
  },
  setAuthor: (author) => {
    document.querySelector(".cell.info .author").value = author;
  }
};



function clear() {
  document.querySelector(".search .padding .searchbar").value = "";
  document.querySelector("#supertype").selectedIndex = 0;
  filters.update(document.querySelector("#supertype"));
}

function toggleFilter(force) {
  var filter = document.querySelector(".filter-panel");
  if (force == "open") {
    filter.classList.add("active");
  } else if (force == "close") {
    filter.classList.remove("active");
  }
}

function display(id) {
  var img = document.querySelector(".preview img");
  img.src = ygoprodeck.dl_image(id);
  var card = ygodata.cards[id];
  var text = document.querySelector(".preview .cardtext");
  text.innerHTML = "";
  text.innerHTML += `${card.id}<br>`;
  text.innerHTML += card.desc;
  text.innerHTML += `<br>ATK/ ${card.atk} DEF/ ${card.def}`;
}

function fade(el) {
  el.classList.add("fade");
  setTimeout(() => {
    el.classList.remove("fade");
  }, 400);
}

function search(text) {
  var results = document.querySelector(".search .padding .results");
  var search_results = ygoprodeck.search(text);
  var pages = search_results.reduce((all, one, i) => {
    const ch = Math.floor(i / 20);
    all[ch] = [].concat((all[ch] || []), one);
    return all;
  }, []);
  results.pages = pages;
  results.page = 1;
  set_page();
}
function forward() {
  var el = document.querySelector(".search .padding .results");
  el.page++;
  if (el.page > el.pages.length) {
    el.page--;
    return;
  }
  set_page();
}
function backward() {
  var el = document.querySelector(".search .padding .results");
  el.page--;
  if (el.page < 1) {
    el.page++;
    return;
  }
  set_page();
}
function page(num) {
  var el = document.querySelector(".search .padding .results");
  if (!(el.pages.length >= num)) {
    return;
  }
  el.page = parseInt(num);
  set_page();
}
function set_page() {
  var el = document.querySelector(".search .padding .results");
  el.innerHTML = "";
  if (el.pages.length == 0) {
    el.pages = [[]];
  }
  el.pages[el.page - 1].forEach(card => {
    var child = document.createElement("div");
    child.classList.add("card");
    child.draggable = false;
    var url = ygoprodeck.dl_image(card, child);
    child.innerHTML = `<img src='${url}' alt='${card}'>`;
    child.oncontextmenu = (ev) => {
      ev.preventDefault();
      var main = document.querySelector(".deckbox.main");
      var extra = document.querySelector(".deckbox.extra");
      var side = document.querySelector(".deckbox.side");
      var c = ygodata.cards[card];
      var extras = [
        "Fusion Monster",
        "Link Monster",
        "Pendulum Effect Fusion Monster",
        "Synchro Monster",
        "Synchro Pendulum Effect Monster",
        "Synchro Tuner Monster",
        "XYZ Monster",
        "XYZ Pendulum Effect Monster"
      ];
      if (extras.includes(c.type) && extra.children.length < 15) {
        extra.deck.addCard(c.id);
      } else if (!(extras.includes(c.type)) && main.children.length < 60) {
        main.deck.addCard(c.id);
      } else if (side.children.length < 15) {
        side.addCard(c.id);
      } else {
        console.log(card);
      }
      deckchanges.push(editor.getDeck());
      return true;
    };
    child.onmouseover = (ev) => {
      display(child.children[0].alt);
    };
    child.ondragstart = (ev) => {
      card = child.cloneNode(true);
      ev.preventDefault();
      card.style.maxWidth = "5vw";
      card.style.maxHeight = "12.5vh";
      pos1 = ev.clientX;
      pos2 = ev.clientY;
      // set the element's new position:
      card.style.top = (pos2 + 2) + "px";
      card.style.left = (pos1 + 2) + "px";
      card.classList.add("drag");
      child.parentElement.appendChild(card);
      document.onmousemove = (ev) => {
        ev = ev || window.event;
        ev.preventDefault();
        pos1 = ev.clientX;
        pos2 = ev.clientY;
        // set the element's new position:
        card.style.top = (pos2 + 2) + "px";
        card.style.left = (pos1 + 2) + "px";
      };
      document.onmouseup = (ev) => {
        card.classList.remove("drag");
        card.style.maxWidth = null;
        card.style.maxHeight = null;
        document.onmouseup = null;
        document.onmousemove = null;
        // check the deckbox, cards and card images
        if (ev.target.classList.contains("deckbox")) {
          // add to the deckbox
          card.parentElement.removeChild(card);
          ev.target.deck.addCard(card.children[0].alt);
          deckchanges.push(editor.getDeck());
        } else if (
          ev.target.parentElement.classList.contains("deckbox")
          || ev.target.parentElement.parentElement.classList.contains("deckbox")
        ) {
          // add to deckbox before the target card
          card.parentElement.removeChild(card);
          var target = ev.target;
          if (!target.classList.contains("card")) {
            target = target.parentElement;
          }
          target.parentElement.deck.addCard(card.children[0].alt, target);
          deckchanges.push(editor.getDeck());
        } else {
          card.remove();
        }
      };
    };
    el.appendChild(child);
  });
  var num1, num2, num3;
  if (el.page == 1) {
    num1 = 1;
    num2 = 2;
    num3 = 3;
    active = ".num1";
  } else if (el.page == el.pages.length && el.page > 2) {
    num1 = el.page - 2;
    num2 = el.page - 1;
    num3 = el.page;
    active = ".num3";
  } else {
    num1 = el.page - 1;
    num2 = el.page;
    num3 = el.page + 1;
    active = ".num2";
  }
  document.querySelector(".num1").innerHTML = num1;
  document.querySelector(".num2").innerHTML = num2;
  document.querySelector(".num3").innerHTML = num3;
  document.querySelector(".num1").classList.remove("active");
  document.querySelector(".num2").classList.remove("active");
  document.querySelector(".num3").classList.remove("active");
  document.querySelector(active).classList.add("active");
  fade(el);
}

class Deck {
  // options uses a tier system for display
  // once a 41st card is added, the system will bump up the display to support 60, otherwise it fits 40
  // {
  //   min: 40,
  //   max: 60,
  //   display: [
  //     {max: 40},
  //     {max: 60}
  //   ]
  // }
  constructor(element, options) {
    this.el = element;
    this.el.deck = this;
    this.display = options.display;
    this.min = options.min;
    this.max = options.max;
    this.el.classList.add(`max-${this.display[0].max}`);
    this.preview = new CardPreview(document.querySelector(".preview"));
  }
  oncardadded(card) {
    if (this.el.childElementCount < this.max) {
      var count = 0;
      for (let i = 0; i < this.el.children.length; i++) {
        if (this.el.children[i].id == card.id) {
          count++;
        }
      }
      if (count >= 3) {
        return false;
      }
      if (this.min == 40 && [
        "Fusion Monster",
        "Link Monster",
        "Pendulum Effect Fusion Monster",
        "Synchro Monster",
        "Synchro Pendulum Effect Monster",
        "Synchro Tuner Monster",
        "XYZ Monster",
        "XYZ Pendulum Effect Monster"
      ].includes(ygodata.cards[card.id].type)) return false;
      if (this.isExtra && ![
        "Fusion Monster",
        "Link Monster",
        "Pendulum Effect Fusion Monster",
        "Synchro Monster",
        "Synchro Pendulum Effect Monster",
        "Synchro Tuner Monster",
        "XYZ Monster",
        "XYZ Pendulum Effect Monster"
      ].includes(ygodata.cards[card.id].type)) return false;
      if (this.el.childElementCount < this.display[0].max) {
        this.el.classList.remove(`max-${this.display[1].max}`);
        this.el.classList.add(`max-${this.display[0].max}`);
      } else {
        this.el.classList.remove(`max-${this.display[0].max}`);
        this.el.classList.add(`max-${this.display[1].max}`);
      }
      return card;
    } else {
      return false;
    }
  }
  oncardremoved() {
    if (this.el.childElementCount - 1 > this.display[0].max) {
      this.el.classList.remove(`max-${this.display[0].max}`);
      this.el.classList.add(`max-${this.display[1].max}`);
    } else {
      this.el.classList.remove(`max-${this.display[1].max}`);
      this.el.classList.add(`max-${this.display[0].max}`);
    }
  }
  clear() {
    this.el.innerHTML = "";
  }
  addCards(cards) {
    for (let i = 0; i < cards.length; i++) {
      const id = cards[i];
      this.addCard(parseInt(id));
    }
  }
  addCard(id, insert_before_el) {
    // some ygopro versions have extra card data for alt arts
    // this code attempts to find the original as DeckMaster cannot support alt arts
    while (!ygodata.cards[id]) {
      id -= 1;
    }
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var card = document.createElement("div");
    card.classList.add("card");
    card.id = id;
    card.draggable = false;
    card.onmouseover = (ev) => {
      this.preview.setCard(card.children[0].alt);
    };
    card.ondragstart = (ev) => {
      ev = ev || window.event;
      ev.preventDefault();
      card.style.maxWidth = "5vw";
      card.style.maxHeight = "12.5vh";
      pos1 = ev.clientX;
      pos2 = ev.clientY;
      // set the element's new position:
      card.style.top = (pos2 + 2) + "px";
      card.style.left = (pos1 + 2) + "px";
      card.classList.add("drag");
      document.onmousemove = (ev) => {
        ev = ev || window.event;
        ev.preventDefault();
        pos1 = ev.clientX;
        pos2 = ev.clientY;
        // set the element's new position:
        card.style.top = (pos2 + 2) + "px";
        card.style.left = (pos1 + 2) + "px";
      };
      document.onmouseup = (ev) => {
        card.classList.remove("drag");
        card.style.maxWidth = null;
        card.style.maxHeight = null;
        document.onmouseup = null;
        document.onmousemove = null;
        // check the deckbox, cards and card images
        if (ev.target.classList.contains("deckbox")) {
          // add to the deckbox
          card.parentElement.deck.oncardremoved();
          card.parentElement.removeChild(card);
          var add_card = ev.target.deck.oncardadded(card);
          if (add_card) {
            ev.target.appendChild(card);
          }
          updateCombos();
        } else if (
          ev.target.parentElement.classList.contains("deckbox")
          || ev.target.parentElement.parentElement.classList.contains("deckbox")
          ) {
            // add to deckbox before the target card
            card.parentElement.deck.oncardremoved();
            card.parentElement.removeChild(card);
            var target = ev.target;
            if (!target.classList.contains("card")) {
              target = target.parentElement;
            }
            var add_card = target.parentElement.deck.oncardadded(card);
            if (add_card) {
              target.parentElement.insertBefore(add_card, target);
            }
            updateCombos();
          } else {
            card.parentElement.deck.oncardremoved();
            card.remove();
            updateCombos();
          }
          deckchanges.push(editor.getDeck());
      };
    };
    card.oncontextmenu = (ev) => {
      ev.preventDefault();
      card.parentElement.deck.oncardremoved();
      card.parentElement.removeChild(card);
      updateCombos();
      deckchanges.push(editor.getDeck());
      return true;
    }
    var img = ygoprodeck.dl_image(id, card);
    card.innerHTML = `<img src="${img}", alt="${id}">`;
    card.children[0].onerror = () => {
      card.children[0].src = DEFAULT_IMG;
      card.children[0].onerror = () => {
        card.children[0].src = DEFAULT_IMG;
      };
      setTimeout(() => {
        card.children[0].src = ygoprodeck.dl_image(id, card);
      }, 3000);
    };
    var add_card = this.oncardadded(card);
    if (add_card) {
      if (insert_before_el) {
        this.el.insertBefore(add_card, insert_before_el);
      } else {
        this.el.appendChild(add_card);
      }
    }
    updateCombos();
  }
}

let main, extra, side, deckchanges;

document.addEventListener("DOMContentLoaded", function () {
  main = new Deck(document.querySelector(".deckbox.main"), {
    min: 40, max: 60,
    display: [
      { max: 40, width: "10%", height: "25%" },
      { max: 60, width: "12%", height: "20%" }
    ]
  });
  extra = new Deck(document.querySelector(".deckbox.extra"), {
    min: 0, max: 15,
    display: [
      { max: 10, width: "10%", height: "100%" },
      { max: 15, width: "6.66%", height: "100%" }
    ]
  });
  extra.isExtra = true;
  side = new Deck(document.querySelector(".deckbox.side"), {
    min: 0, max: 15,
    display: [
      { max: 10, width: "10%", height: "100%" },
      { max: 15, width: "6.66%", height: "100%" }
    ]
  });

  deckchanges = new Change();

  deckchanges.on('undo', item => {
    if (deckchanges.index == -1) item = deckchanges.default;
    main.clear();
    main.addCards(item.main);
    extra.clear();
    extra.addCards(item.extra);
    side.clear();
    side.addCards(item.side);
  });
  deckchanges.on('redo', item => {
    if (deckchanges.index == -1) item = deckchanges.default;
    main.clear();
    main.addCards(item.main);
    extra.clear();
    extra.addCards(item.extra);
    side.clear();
    side.addCards(item.side);
  });

  document.querySelector(".undo").addEventListener("click", () => deckchanges.undo());
  document.querySelector(".redo").addEventListener("click", () => deckchanges.redo());
  ["push","undo","redo"].forEach(ev => {
    deckchanges.on(ev, () => {
      if (deckchanges.canUndo) document.querySelector(".undo").classList.remove("disabled");
      else document.querySelector(".undo").classList.add("disabled")
      if (deckchanges.canRedo) document.querySelector(".redo").classList.remove("disabled");
      else document.querySelector(".redo").classList.add("disabled")
    });
  });

  // control search
  var timeout = null;
  document.querySelector(".search .padding .searchbar").addEventListener("keyup", (ev) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      var text = ev.target.value;
      search(text);
    }, 1000);
  });
  document.querySelector(".clear").onclick = clear;
});
