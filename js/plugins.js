class Plugins {
  constructor() {
    this.path = paths.join(__dirname, '../../plugins.json');
    this.plugins = [];
    this.load();
  }
  
  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
  
  load() {
    this.data = JSON.parse(fs.readFileSync(this.path));
    if (!this.data) throw Error("Failed to load data for plugins");

    for (let i = 0; i < this.data.length; i++) {
      const url = this.data[i];
      this.loadPlugin(url);
    }
  }

  loadPlugin(url) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const plugin = new Function([], this.responseText);
        plugin();
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  addPlugin(url) {
    this.data.push(url);
    this.loadPlugin(url);
    this.save();
  }

  removePlugin(url) {
    this.data.splice(this.data[this.data.indexOf(url)], 1);
    this.save();
    notify(`<div onclick="deckmaster.restart()">Removed plugin. Please restart DeckMaster</div>`);
  }

  register(plugin) {
    this.plugins.push(plugin);
    this.emit('load', plugin.name);
  }

  emit(event, name) {
    if (!name) return this.plugins.forEach(plugin => this.emit(event, plugin.name));
    this.plugins.find(plugin => {if (plugin.name == name) return true})[event]();
  }
}
