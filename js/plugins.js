class Plugins {
  constructor() {
    this.path = paths.join(__dirname, '../../plugins.json');
    this.plugins = [];
  }
  
  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
  
  load() {
    try {
      this.data = JSON.parse(fs.readFileSync(this.path));
    } catch {}
    if (!this.data) this.data = {};

    for (let i = 0; i < Object.keys(this.data).length; i++) {
      const url = Object.keys(this.data)[i];
      this.loadPlugin(url);
    }
  }

  loadPlugin(url) {
    if (!this.data[url]) return console.error(`Failed to load '${url}', reason: not downloaded`);
    const plugin = new Function([], this.data[url]);
    plugin();
    // UI
    settings.component.el.querySelector("#tab-plugins").component.addChild(
      (new FlexRow()).addChildren([
        new Text({ text: url, style: {width:"50%"} }),
        (new Button({text: "Remove", style: {width:"50%"}})).on("click", () => {
          this.removePlugin(url);
          settings.component.el.querySelector("#tab-plugins").component.el.children[i].component.destroy();
        })
      ])
    );
  }

  addPlugin(url) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        this.data[url] = xhttp.responseText;
        this.save();
        this.loadPlugin(url);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  removePlugin(url) {
    delete this.data[url];
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
