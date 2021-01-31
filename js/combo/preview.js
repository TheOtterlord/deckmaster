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
  el.nextElementSibling.innerHTML = `<a class='ir-faded-text'>${get_preview(el.value) ?? ""}</a>`;
}
