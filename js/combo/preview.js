function get_preview(q, arrays) {
  if (combo_editor.isValidQuery(q)) {
    let match, isMultiple;
    var cards = Object.keys(ygodata.cards);
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let isMatch = query(q, card, arrays);
      if (isMatch && !match) match = card;
      else if (isMatch && match) {
        isMultiple = true;
        break;
      }
    }
    if (!match) return "";
    return isMultiple ? `(e.g. ${ygodata.cards[match].name})` : `${ygodata.cards[match].name}`;
  }
}

function inputPreview(el) {
  el.parentElement.nextElementSibling.innerHTML = `<a class='ir-faded-text'>${get_preview(el.value) ?? ""}</a>`;
}

async function suggest(el) {
  var q = el.value.toLowerCase();
  var max = 5;
  el.dataset.selected = -1;
  var suggestions = el.previousElementSibling;
  suggestions.innerHTML = "";
  if (q == "") return;
  var cards = Object.keys(ygodata.cards);
  for (let i = 0; i < cards.length; i++) {
    const card = ygodata.cards[cards[i]];
    if (card.name.toLowerCase().includes(q)) {
      suggestions.innerHTML += `<div onclick="this.parentElement.nextElementSibling.value = this.dataset.id;combo_editor.validateArrayItem();combo_editor.validateTestQuery()" data-id="${card.id}">${card.id} <span class="ir-faded-text">- ${card.name.toLowerCase().startsWith(q) ? `<b>${card.name.substr(0, q.length)}</b>${card.name.substr(q.length)}` : card.name}</span></div>`;
      max--;
    }
    if (max == 0) break;
  }
}

function selectSuggestion(ev) {
  var lists = document.querySelectorAll(".suggestions");
  function setActive(list, el) {
    if (list.children.length == el.dataset.selected) el.dataset.selected = 0;
    if (el.dataset.selected == -1) el.dataset.selected = list.children.length-1;
    for (let i = 0; i < list.children.length; i++) {
      const child = list.children[i];
      if (i != el.dataset.selected) child.classList.remove("active");
      else child.classList.add("active");
    }
  }
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    var el = list.nextElementSibling;
    if (list.innerHTML == "") continue;
    if (ev.keyCode == 40) {
      // set to -1 by something?
      el.dataset.selected++;
      setActive(list, el);
    } else if (ev.keyCode == 38) {
      el.dataset.selected--;
      setActive(list, el);
    } else if (ev.keyCode == 13) {
      ev.preventDefault();
      if (el.dataset.selected > -1) {
        list.children[el.dataset.selected].click();
       }
    }
  }
}

function closeLists(ev) {
  var lists = document.querySelectorAll(".suggestions");
  for (let i = 0; i < lists.length; i++) {
    const list = lists[i];
    list.innerHTML = "";
  }
}

document.addEventListener("click", (ev) => {
  closeLists(ev);
});

document.addEventListener("keyup", selectSuggestion);
