/**
 * The `Change` class is used to keep track of changes, and allow those changes to be undone/redone.
 */
class Change {
  
  /**
   * Creates an instace of `Change`, initializing the stack array, index and event arrays
   */
  constructor() {
    this.clear();
    this.pushEvents = [];
    this.undoEvents = [];
    this.redoEvents = [];
  }

  /**
   * Push a new change to the stack.
   * This overrides any undone changes.
   * @param {*} item The change to append
   */
  push(item) {
    this.stack.splice(this.index+1);
    this.stack.push(item);
    this.index++;
    for (let i = 0; i < this.pushEvents.length; i++) {
      this.pushEvents[i](item);
    }
  }

  /**
   * Clear the undo/redo stack and reset the index
   */
  clear() {
    this.stack = [];
    this.index = -1;
  }

  /**
   * Undo the last change in the stack.
   * @returns {*} The item to be reverted to if possible to undo, otherwise returns undefined
   */
  undo() {
    if (this.canUndo) {
      this.index--;
      let item = this.stack[this.index];
      for (let i = 0; i < this.undoEvents.length; i++) {
        this.undoEvents[i](item);
      }
      return item;
    }
  }

  /**
   * Redo the last undo in the stack.
   * @returns {*} The item to be redone if possible to redo, otherwise returns undefined
   */
  redo() {
    // if the index is less than the max index
    if (this.canRedo) {
      this.index++;
      let item = this.stack[this.index];
      for (let i = 0; i < this.redoEvents.length; i++) {
        this.redoEvents[i](item);
      }
      return item;
    }
  }

  /**
   * Undo `i` times.
   * @param {number} i Number of times to undo
   * @returns {*[]} An array of all items to be undone
   */
  massUndo(i=1) {
    let undo_stack = [];
    for (let stop = 0; stop < i; i--) {
      let item = this.undo();
      if (item) undo_stack.push(item);
      else break;
    }
    return undo_stack;
  }

  /**
   * Redo `i` times.
   * @param {number} i Number of times to Redo
   * @returns {*[]} An array of all items to be redone
   */
  massRedo(i=1) {
    let redo_stack = [];
    for (let stop = 0; stop < i; i--) {
      let item = this.redo();
      if (item) redo_stack.push(item);
      else break;
    }
    return redo_stack;
  }

  on(event, callback) {
    if      (event == "push") this.pushEvents.push(callback);
    else if (event == "undo") this.undoEvents.push(callback);
    else if (event == "redo") this.redoEvents.push(callback);
    else return Error(`No event called '${event}';`);
  }

  /**
   * @returns {boolean} If you can undo a change
   */
  get canUndo() {
    return this.index >= 0;
  }

  /**
   * @returns {boolean} If you can redo a change
   */
  get canRedo() {
    return this.index < this.stack.length-1;
  }

  /**
   * @returns {*} Gets the last change to happen (or be reverted to), or `undefined` if no changes have been made
   */
  get current() {
    return this.stack[this.index];
  }
}
