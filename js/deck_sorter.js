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
  if (last_type) type=last_type;
  else type="card_type";
  actually_sort_deck(type, true);
}

function actually_sort_deck(type, quick=undefined) {
  if (!quick) last_type = type;
  // TODO: sort
}
