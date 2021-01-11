var last_type;

function sort_deck() {
  document.querySelector(".fade-bg").classList.remove("hide");
  document.querySelector(".sorter").classList.add("show");
}

function dont_sort_deck() {
  document.querySelector(".fade-bg").classList.add("hide");
  document.querySelector(".sorter").classList.remove("show");
}

function quick_sort() {
  var type;
  if (last_type) type = last_type;
  else type = "card_type";
  actually_sort_deck(type);
}

function ygo_sorter(a, b) {
  a = ygodata.cards[a];
  b = ygodata.cards[b];
  var c = a;
  var d = b;
  var sort = last_type.split(".");
  for (let i = 0; i < sort.length; i++) {
    const key = sort[i];
    a = a?.[key];
    b = b?.[key];
  }
  if (sort == "type") {
    if (a?.includes?.("Monster")) a = "1 " + a;
    if (a?.includes?.("Spell")) a = "2 " + a;
    if (a?.includes?.("Trap")) a = "3 " + a;
    if (b?.includes?.("Monster")) b = "1 " + b;
    if (b?.includes?.("Spell")) b = "2 " + b;
    if (b?.includes?.("Trap")) b = "3 " + b;
  }
  if (a > b) {
    return 1;
  } else if (a == b) {
    if (a == undefined) return 1;
    else if (b == undefined) return -1;
    else {
      if (c.name > d.name) return 1;
      else if (c.name == d.name) return 0;
      else return -1;
    }
    return 0;
  } else if (a < b) {
    return -1;
  } else if (a == undefined) {
    return 1;
  } else if (b == undefined) {
    return -1;
  }
}

function actually_sort_deck(type) {
  last_type = type;
  var main_ids = [];
  var extra_ids = [];
  var side_ids = [];
  for (let i = 0; i < main.el.children.length; i++) main_ids.push(main.el.children[i].id);
  for (let i = 0; i < extra.el.children.length; i++) extra_ids.push(extra.el.children[i].id);
  for (let i = 0; i < side.el.children.length; i++) side_ids.push(side.el.children[i].id);
  main_ids.sort(ygo_sorter);
  extra_ids.sort(ygo_sorter);
  side_ids.sort(ygo_sorter);
  main.clear();
  main.addCards(main_ids);
  extra.clear();
  extra.addCards(extra_ids);
  side.clear();
  side.addCards(side_ids);
  dont_sort_deck();
}
