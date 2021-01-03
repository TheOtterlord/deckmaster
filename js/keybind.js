class Keybinder {
  constructor() {
    this.bindings = [];
    document.addEventListener("keyup", this.handle.bind(this));
    this.updateKeybindings();
    this.displayKeybindings();
    var listens = document.querySelectorAll("[class*='key-']");
    for (let i = 0; i < listens.length; i++) {
      const key = listens[i];
      key.addEventListener("input", () => {
        var keybindings = settings.get("keybindings");
        var new_binding = binder.parse(key.value);
        if (!new_binding) {
          key.classList.add("err");
          key.title = "Incorrect Syntax";
          return;
        }
        key.classList.remove("err");
        key.title = "Valid Syntax";
        keybindings[[...key.classList].filter((val, i, arr) => {return val.startsWith("key-")})[0].split("key-")[1]] = new_binding;
        binder.updateKeybindings();
        settings.set("keybindings", keybindings);
      });
    }
  }

  displayKeybindings() {
    var to_bind = [
      'help',
      'open_deck',
      'save',
      'save_as',
      'settings'
    ];
    to_bind.forEach(bind => {
      document.querySelector(`.key-${bind}`).value = this.stringify(settings.data.keybindings?.[bind]) ?? "";
    });
  }

  parse(s) {
    var data = s.split("+");
    var binding = {};
    for (let i = 0; i < data.length; i++) {
      var sub = data[i];
      if (sub == "Ctrl") {
        binding.ctrl = true;
      } else if (sub == "Shift") {
        binding.shift = true;
      } else if (sub == "Alt") {
        binding.alt = true;
      } else {
        if (binding.key) return;
        binding.key = sub.toLowerCase();
      }
    }
    if (!binding.key) return;
    return binding;
  }

  stringify(binding) {
    return `${binding.ctrl ? "Ctrl+" : ""}${binding.shift ? "Shift+" : ""}${binding.alt ? "Alt+" : ""}${binding.key.toUpperCase()}`;
  }

  updateKeybindings() {
    this.clear();
    var binds = settings.get('keybindings');
    this.register({...binds.help, callback: deckmaster.wiki});
    this.register({...binds.open_deck, callback: deckmaster.openDeck });
    this.register({
      ...binds.save, callback: () => {
        if (main.filepath) deckmaster.saveDeck(main.filepath);
        else deckmaster.saveAs();
      }
    });
    this.register({...binds.save_as, callback: deckmaster.saveAs });
    this.register({...binds.settings, callback: open_settings });
  }

  register(binding) {
    if (!binding.ctrl) binding.ctrl = false;
    if (!binding.shift) binding.shift = false;
    if (!binding.alt) binding.alt = false;
    this.bindings.push(binding);
  }

  clear() {
    this.bindings = [];
  }
  
  handle(ev) {
    var key = ev.key.toLowerCase();
    for (let i = 0; i < this.bindings.length; i++) {
      const binding = this.bindings[i];
      if (
        binding.key == key &&
        binding.ctrl == ev.ctrlKey &&
        binding.shift == ev.shiftKey &&
        binding.alt == ev.altKey
      ) {
        ev.preventDefault();
        binding.callback();
      }
    }
  }
}
