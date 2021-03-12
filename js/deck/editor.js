class DeckEditor {
  /**
   * Create a new instance of a deck editor
   * @param {HTMLElement} el The element of the editor
   * @param {Deck} main The main deck
   * @param {Deck} extra The extra deck
   * @param {Deck} side The side deck
   */
  constructor(el, main, extra, side) {
    this.el = el;
    this.main = main;
    this.extra = extra;
    this.side = side;
  }

  /**
   * Convert `ydk` to a json object
   * @param {string} text The raw `ydk` text
   */
  ydk_to_json(text) {
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
        if (line.startsWith("#main")) target = "main";
        else if (line.startsWith("#extra")) target = "extra";
        else if (line.startsWith("#created by ")) json.author = line.split("#created by ")[1];
      } else if (line.startsWith("!side")) target = "side";
      else if (line != "") {
        line = parseInt(line);
        json[target].push(line);
      }
    });
    return json;
  }

  /**
   * Convert `JSON` to `ydk` format
   * @param {string} json The JSON deck
   */
  json_to_ydk(json) {
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
  }

  /**
   * Delete the currently loaded deck
   */
  delete() {
    fs.unlink(this.filepath, (err) => {
      if (err) {
        throw err;
      }
      notify(`The deck at ${this.filepath} has been deleted!`, 3000);
      deckmaster.removeRecentDocs(this.filepath);
      this.filepath = undefined;
      deckmaster.toHome();
    });
  }

  /**
   * Get the deck as a JSON object
   * @returns {Object}
   */
  getDeck() {
    var json = {
      main: [],
      extra: [],
      side: [],
      author: this.el.querySelector(".cell.info .author").value
    };
    for (let i = 0; i < this.main.el.children.length; i++) {
      const card = this.main.el.children[i].id;
      json.main.push(card);
    }
    for (let i = 0; i < this.extra.el.children.length; i++) {
      const card = this.extra.el.children[i].id;
      json.extra.push(card);
    }
    for (let i = 0; i < this.side.el.children.length; i++) {
      const card = this.side.el.children[i].id;
      json.side.push(card);
    }
    return json;
  }

  /**
   * Capture an image of the deck, cropping out the editor
   * @returns {Promise} A promise that resolves when the file has been saved/ignored
   */
  async exportImage() {
    if (this.el.style.display != "block") return;

    // close all menus that could be in the way
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display != "none") {
        openDropdown.style.display = "none";
      }
    }

    const { left, top, width, height } = this.el.querySelector('#deck').getBoundingClientRect();
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
  }

  /**
   * Link a combo file to the deck
   * @param {string} path The path of the combo to link
   */
  linkCombo(path) {
    var deck = this.el.querySelector(".cell.info .deckname").value;
    var combos = JSON.parse(localStorage.getItem(deck));
    if (combos) {
      combos.push(path);
    } else {
      combos = [path];
    }
    localStorage.setItem(deck, JSON.stringify(combos));
  }

  /**
   * Unlink a combi file from the deck
   * @param {Number} i The index of the combo file to remove
   */
  unlinkCombo(i) {
    var deck = this.el.querySelector(".cell.info .deckname").value;
    var combos = JSON.parse(localStorage.getItem(deck));
    if (combos) {
      combos.splice(i, 1);
    } else {
      combos = [];
    }
    localStorage.setItem(deck, JSON.stringify(combos));
  }

  /**
   * Load the combos linked to the deck
   */
  loadCombos() {
    var deck = this.el.querySelector(".cell.info .deckname").value;
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
  }

  /**
   * Set the name of the deck
   * @param {string} name The name of the deck
   */
  setDeckname(name) {
    this.el.querySelector(".cell.info .deckname").value = name;
  }

  /**
   * Set the author of the deck
   * @param {string} author The author's name
   */
  setAuthor(author) {
    this.el.querySelector(".cell.info .author").value = author;
  }
}
