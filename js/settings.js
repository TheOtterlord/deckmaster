class Settings {
  constructor() {
    this.data = JSON.parse(localStorage.getItem("settings")) ?? {};
    this.data = this.update();
  }

  /**
   * Update settings to the latest layout.
   * Not used to update based on UI input
   * @param {object} old Previous settings
   */
  update(old) {
    var new_settings = {};
    new_settings.keybindings = {...{
      help: {key: "f1", ctrl: true},
      open_deck: {key: "o", ctrl: true},
      save: {key: "s", ctrl: true},
      save_as: {key: "s", ctrl: true, shift: true},
      settings: {key: ",", ctrl: true}
    }, ...old.keybindings ?? {}};
    new_settings.author = old.author ?? "";
    this.save();
    return new_settings;
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  save() {
    localStorage.setItem("settings", JSON.stringify(new_settings));
  }
}

function open_settings() {
  document.querySelector(".fade-bg").classList.remove("hide");
  document.querySelector(".settings").classList.add("show");
}

function close_settings() {
  document.querySelector(".fade-bg").classList.add("hide");
  document.querySelector(".settings").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".ir-flex.ygopro_connect").innerHTML = (localStorage.getItem("ygopro") ?? "No folder selected...");
});
