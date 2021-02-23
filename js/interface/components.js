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
      <div class="ir-primary" style="height:30px;">
        <div class="ir-padding">${title}</div>
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
  constructor({text, style}) {
    super("button", {style});
    this.el.className = "ir-button ir-margin";
    this.el.innerHTML = text;
  }
}

class Input extends Component {
  constructor({placeholder, style}) {
    super("input", {style});
    this.el.className = "ir-input ir-margin";
    this.el.placeholder = placeholder ?? "";
  }
}

class TextArea extends Component {
  constructor({placeholder, style}) {
    super("textarea", {style});
    this.el.className = "ir-input ir-margin";
    this.el.placeholder = placeholder ?? "";
  }

  get text() {
    return this.el.value;
  }

  set text(value) {
    this.el.value = value;
  }
}
