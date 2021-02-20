class Component {
  constructor(tagname) {
    this.el = document.createElement(tagname);
    this.el.component = this;
  }

  addChild(component) {
    this.el.appendChild(component.el);
    component.parent = this;
  }

  destroy() {
    this.el.remove();
  }

  on(ev, callback) {
    this.el.addEventListener(ev, callback);
  }
}

class Dialog extends Component {
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
    this.el.querySelector("span").onclick = this.close;
    // TODO: Add contents
    document.querySelector(".dialogs").appendChild(this.el);
  }

  open() {
    this.el.classList.add("open");
  }

  close() {
    this.el.classList.remove("open");
  }
}

class Button extends Component {
  constructor({text}) {
    super("button");
    this.el.className = "ir-button";
    this.el.innerHTML = text;
  }
}
