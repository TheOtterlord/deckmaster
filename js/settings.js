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
      new_deck: {key: "n", ctrl: true},
      new_ycb: {key: "n", ctrl: true, shift: true},
      open_deck: {key: "o", ctrl: true},
      open_ycb: {key: "o", ctrl: true, shift: true},
      save: {key: "s", ctrl: true},
      save_as: {key: "s", ctrl: true, shift: true},
      settings: {key: ",", ctrl: true},
      undo: {key: "z", ctrl: true},
      redo: {key: "y", ctrl: true},
      scrot: {key: "e", ctrl: true}
    }, ...old.keybindings ?? {}};
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
