/**
 * The component class is the basic structure that the deckmaster interface API is based around.
 * It uses the `iridium.css` stylesheet found in `css/iridium.css`. 
 */
class Component {
  /**
   * Create a component instance
   * @param {string} tagname The tagname of the element
   * @param {object} options An object containing all options you wish to pass
   */
  constructor(tagname, options) {
    this.el = document.createElement(tagname);
    this.el.component = this;
    this.style(options?.styles ?? {});
  }

  /**
   * Add a child component
   * @param {Component} component The component to append
   */
  addChild(component) {
    this.el.appendChild(component.el);
    component.parent = this;
    return this;
  }

  addChildren(componentList) {
    componentList.forEach(component => this.addChild(component));
    return this;
  }

  /**
   * Destroy this
   */
  destroy() {
    this.el.remove();
  }

  /**
   * Add an event listener to the DOM element
   * @param {string} ev The event you wish to watch
   * @param {Function} callback The function to call
   */
  on(ev, callback) {
    this.el.addEventListener(ev, callback);
    return this;
  }

  /**
   * Apply styling to an element
   * @param {object} options The styles to apply
   */
  style(options) {
    var keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.el.style[key] = options[i];
    }
    return this;
  }
}

/**
 * A dialog component
 */
class Dialog extends Component {
  /**
   * Create a dialog
   * @param {object} options
   */
  constructor({title}) {
    super("div");
    this.el.className = "ir-dialog";
    this.el.innerHTML = `
      <div class="ir-sticky ir-top">
        <div class="ir-primary ir-padding">${title}</div>
        <span
          style="padding:4px;width:30px;height:30px;"
          class="ir-hover-error ir-text-center ir-absolute ir-top ir-right"
          onclick="this.parentElement.parentElement.component.close()">&#10006;</span>
      </div>
    `;

    // Following line fixes some weird event/render bug
    this.el.innerHTML += ``;

    document.querySelector(".dialogs").appendChild(this.el);
  }

  /**
   * Add a header
   * @param {Component} component The component to add as a header
   */
  addHeader(component) {
    component.el.parentElement.removeChild(component.el);
    this.el.firstElementChild.appendChild(component.el);
    this.header = component;
  }

  /**
   * Open the dialog
   */
  open() {
    this.el.classList.add("open");
    return this;
  }

  /**
   * Close the dialog
   */
  close() {
    this.el.classList.remove("open");
    return this;
  }
}

/**
 * A flex-row component
 * All components added as children will become flex (not recursively)
 */
class FlexRow extends Component {
  /**
   * Create a flex-row
   */
  constructor() {
    super("div");
    this.el.className = "ir-flex-row";
  }

  /**
   * Add a child component
   * @param {Component} component The component to append
   */
  addChild(component) {
    component.el.classList.add("ir-flex");
    return super.addChild(component);
  }
}

class Text extends Component {
  constructor({text, style}) {
    super("p", style);
    this.el.className = "ir-margin";
    this.el.innerHTML = text;
  }
}

class Button extends Component {
  constructor({classes, text, style}) {
    super("button", {style});
    this.el.className = "ir-button ir-margin "+classes;
    this.el.innerHTML = text;
  }
}

class TextArea extends Component {
  constructor({placeholder, style, classes}) {
    super("textarea", {style});
    this.el.className = "ir-input ir-margin "+classes;
    this.el.placeholder = placeholder ?? "";
  }

  get text() {
    return this.el.value;
  }

  set text(value) {
    this.el.value = value;
  }
}

class Input extends Component {
  constructor({placeholder, value, style, classes}) {
    super("input", {style});
    if (value) this.el.value = value;
    this.el.className = "ir-input ir-margin "+classes;
    this.el.placeholder = placeholder ?? "";
  }

  get text() {
    return this.el.value;
  }

  set text(value) {
    this.el.value = value;
  }
}

class Dropdown extends Component {
  constructor({options, selected, style, change}) {
    super("select");
    this.el.className = "ir-select ir-margin theme";
    this.el.onchange = () => change(this.el.value);
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      this.addChild(
        new Option({text: option})
      )
    }
    this.el.value = selected;
  }
}

class Option extends Component {
  constructor({text, style}) {
    super("option");
    this.el.innerHTML = text;
    this.el.value = text;
  }
}

class Tabination extends Component {
  constructor() {
    super("div");
    this.tablinks = new Component("div");
    this.tablinks.el.className = "ir-tablinks ir-maxwidth ir-elevated";
    this.addChild(this.tablinks);
    this.tabs = new Component("div");
    this.addChild(this.tabs);
  }

  addTab(name, component) {
    component.el.id = `tab-${name.toLowerCase().replaceAll(" ", "-")}`;
    component.el.classList.add("ir-tab");
    const link = new Component("a");
    link.el.classList.add("ir-tablink");
    link.el.innerHTML = name;
    link.el.onclick = () => this.setTab(name);
    this.tablinks.addChild(link);
    this.tabs.addChild(component);
    return this;
  }

  setTab(name) {
    [...this.tablinks.el.children].forEach(link => {
      if (name != link.innerHTML) link.classList.remove("active");
      else link.classList.add("active");
    });
    [...this.tabs.el.children].forEach(tab => tab.classList.remove("active"));
    this.tabs.el.querySelector(`#tab-${name.toLowerCase().replaceAll(" ", "-")}`).classList.add("active");
  }
}

class Header extends Component {
  constructor(level, {text}) {
    super(`h${level}`);
    this.el.innerHTML = text;
  }
}
