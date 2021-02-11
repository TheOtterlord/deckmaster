class CardPreview {
  constructor(el, id=-1) {
    this.el = el;
    this.active = id;
  }

  setCard(id) {
    this.id = id;
    this.update();
  }

  update() {
    var card = ygodata.cards[this.id];
    this.el.children[0].src = ygoprodeck.dl_image(this.id);

    // display information about selected card
    // NOTE: we use card.linkmarkers.length because some values for linkval are incorrect (e.g. underworld goddess)
    this.el.children[1].innerHTML = `
      <h4 class="ir-text-center" style="margin:2px;">${card.name}</h4>
      <div>${card.id} (${card.misc_info[0].formats.filter(item => item != "Duel Links").filter(item => !item.includes("GOAT")).join("/")})</div>
      <div>${card.type} | ${card.race} ${card.attribute ? `| ${card.attribute}` : ''}</div>
      <div>${
        card.atk!=undefined ? `<b>Atk:</b> ${card.atk} / 
        ${card.def!=undefined ? `<b>Def:</b> ${card.def}` : (card.linkval ? `<b>Link:</b> ${card.linkmarkers.length}` : '')}
        ${card.level ? `/ <b>${card.type.includes("XYZ") ? 'Rank' : 'Level' }:</b> ${card.level}` : ''}` : ''}</div>
      <div>${card.desc}</div>
    `;
  }
}
