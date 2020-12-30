class Keybinder {
  constructor() {
    this.bindings = [];
    document.addEventListener("keyup", this.handle.bind(this));
  }

  register(binding) {
    if (!binding.ctrl) binding.ctrl = false;
    if (!binding.shift) binding.shift = false;
    if (!binding.alt) binding.alt = false;
    this.bindings.push(binding);
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
