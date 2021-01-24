var monster_types = [
  "Normal Monster",
  "Normal Tuner Monster",
  "Effect Monster",
  "Tuner Monster",
  "Flip Tuner Effect Monster",
  "Flip Effect Monster",
  "Spirit Monster",
  "Gemini Monster",
  "Toon Monster",
  "Ritual Monster",
  "Ritual Effect Monster",
  "Pendulum Normal Monster",
  "Pendulum Effect Monster",
  "Pendulum Tuner Effect Monster",
  "Pendulum Flip Effect Monster",
  "Union Effect Monster",
  "Fusion Monster",
  "Pendulum Effect Fusion Monster",
  "Synchro Monster",
  "Synchro Tuner Monster",
  "Synchro Pendulum Effect Monster",
  "XYZ Monster",
  "XYZ Pendulum Effect Monster",
  "Link Monster"
];

var spell_types = [
  "Field",
  "Normal",
  "Quick-Play",
  "Ritual",
  "Continuous",
  "Equip"
];

var trap_types = [
  "Normal",
  "Continuous",
  "Counter"
];

function sort_deck() {
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
}

function type_of(c) {
  c = c.toLowerCase();
  if (c.includes("monster")) return 0;
  if (c.includes("spell")) return 1;
  if (c.includes("trap")) return 2;
}

function ygo_sorter(a, b) {
  a = ygodata.cards[a];
  b = ygodata.cards[b];
  let type_a = type_of(a.type);
  let type_b = type_of(b.type);
  if (type_a != type_b) return type_a - type_b;
  var val;
  if (type_a == 0) val = monster_types.indexOf(a.type) - monster_types.indexOf(b.type);
  if (type_a == 1) val = spell_types.indexOf(a.race) - spell_types.indexOf(b.race);
  if (type_a == 2) val = trap_types.indexOf(a.race) - trap_types.indexOf(b.race);
  if (val != 0) return val;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}
