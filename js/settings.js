class Settings {
  constructor() {
    this.data = JSON.parse(localStorage.getItem("settings")) ?? {};
    if (!localStorage.getItem("ygopro")) {
      var startscreen = document.querySelector(".start-screen");
      var welcome = document.querySelector(".intro");
      startscreen.style.display = "none";
      welcome.style.display = "block";
    }
    this.update(this.data);

    var style = { width: "50%" };
    this.component = (new Dialog({ title: "Settings" }))
      .addChild(
        (new Tabination())
          .addTab("Settings",
            (new Component("div"))
              .addChild(
                (new FlexRow()).addChild(
                  new Text({ text: "Path to YGOPro/EDOPro:", style })
                ).addChild(
                  (new Button({ classes: "ygopro_connect", text: localStorage.getItem("ygopro") ?? "No folder selected", style })).on("click", ygoprodeck.linkYGOPro)
                )
              ).addChild(
                (new FlexRow()).addChild(
                  new Text({ text: "Theme:", style })
                ).addChild(
                  new Dropdown({ options: Object.keys(themes), selected: user_theme, change: setTheme, style })
                )
              ).addChild(
                (new FlexRow()).addChild(
                  (new TextArea({ placeholder: "Custom css...", classes: "user_css" })).on("input", function () { setCSS(this.value) })
                )
              )
          ).addTab("Keybindings",
            (new Component("div"))
              .addChildren(Object.keys(this.data.keybindings).map(key => {
                var keybind = this.data.keybindings[key];
                return (new FlexRow()).addChildren([
                  new Text({ text: `keybinds.${key}`, style }),
                  (new Input({ classes: `key-${key}`, placeholder: "Enter keybind", value: Keybinder.prototype.stringify(keybind), style })).on("input", function () {
                    var keybindings = settings.get("keybindings");
                    var new_binding = binder.parse(this.value);
                    if (!new_binding) {
                      this.classList.add("err");
                      this.title = "Incorrect Syntax";
                      return;
                    }
                    this.classList.remove("err");
                    this.title = "Valid Syntax";
                    keybindings[[...this.classList].filter((val, i, arr) => { return val.startsWith("key-") })[0].split("key-")[1]] = new_binding;
                    binder.updateKeybindings();
                    settings.set("keybindings", keybindings);
                  })
                ])
              }))
          ).addTab("About",
              (new Component("div"))
                .addChildren([
                  new Text({text: `Version: ${deckmaster.version}`}),
                  new Text({text: "Author: Reuben Tier (AKA TheOtterlord)"}),
                  new Text({text: `Website: <a href="https://theotterlord.github.io/deckmaster" target="_blank">https://theotterlord.github.io/deckmaster</a>`}),
                  new Text({text: `Bug Tracker: <a href="https://github.com/TheOtterlord/deckmaster/issues" target="_blank">GitHub</a>`}),
                  new Text({text: `Discord: <a href="https://discord.gg/5R7Zt9yqBr" target="_blank">Invite</a>`})
                ])
          )
      )
    this.component.addHeader(this.component.el.querySelector(".ir-tablinks").component);
    document.querySelector(".user_css").innerHTML = user_css;
    var index = 0;
    var selection = document.querySelector(".theme");
    for (let i = 0; i < selection.length; i++) {
      const element = selection[i];
      if (element.value == user_theme) {
        index = i;
        break;
      }
    }
    selection.selectedIndex = index;
    this.component.header.parent.setTab("Settings");
  }

  /**
   * Update settings to the latest layout.
   * Not used to update based on UI input
   * @param {object} old Previous settings
   */
  update(old) {
    var new_settings = {};
    new_settings.keybindings = {
      ...{
        help: { key: "f1", ctrl: true },
        new_deck: { key: "n", ctrl: true },
        new_ycb: { key: "n", ctrl: true, shift: true },
        open_deck: { key: "o", ctrl: true },
        open_ycb: { key: "o", ctrl: true, shift: true },
        save: { key: "s", ctrl: true },
        save_as: { key: "s", ctrl: true, shift: true },
        settings: { key: ",", ctrl: true },
        undo: { key: "z", ctrl: true },
        redo: { key: "y", ctrl: true },
        scrot: { key: "e", ctrl: true }
      }, ...old.keybindings ?? {}
    };
    new_settings.author = old.author ?? "";
    this.save();
    this.data = new_settings;
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  save() {
    localStorage.setItem("settings", JSON.stringify(this.data));
  }

  tab(el) {
    var links = el.parentElement;
    for (let i = 0; i < links.children.length; i++) {
      const link = links.children[i];
      link.classList.remove("active");
      document.querySelector(`#${link.innerHTML}`).style.display = "none";
    }
    el.classList.add("active");
    document.querySelector(`#${el.innerHTML}`).style.display = "block";
  }
}

function open_settings() {
  settings.component.open();
}

function close_settings() {
  settings.component.close();
}
