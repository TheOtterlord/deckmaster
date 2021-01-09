var sort_by = [];

function sort_deck() {
  document.querySelector(".fade-bg").classList.remove("hide");
  document.querySelector(".sorter").classList.add("show");
}

function dont_sort_deck() {
  document.querySelector(".fade-bg").classList.add("hide");
  document.querySelector(".sorter").classList.remove("show");
}

function clear_sorter() {
  sort_by = [];
}

// TODO: Add code for these two functions
function add_sorter() {}
function remove_sorter() {}

function actually_sort_deck(type) {
  if (!sort_by) return /* display something to show nothing is selected? */;
}
