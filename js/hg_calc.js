/**
 * Find the factorial of a number
 * @param {number} n 
 */
function factorial(n) {
  x = parseInt(n, 10);
  if (isNaN(n))
    return 1;
  if (n <= 0)
    return 1;
  if (n > 170)
    return Infinity;
  var y = 1;
  for (var i = n; i > 0; i--) {
    y *= i;
  }
  return y;
}

/**
 * nCr as a function
 * @param {number} n 
 * @param {number} k 
 */
function choose(n, k) {
  n = parseInt(n, 10);
  if (isNaN(n))
    n = 0;
  if (n < 0)
    n = 0;

  k = parseInt(k, 10);
  if (isNaN(k))
    k = 0;
  if (k < 0)
    k = 0;
  //if (k > n) k = n;

  return (factorial(n)) / (factorial(k) * factorial(n - k));
}

function query(q, id, arrays) {
  // exact id match
  if (+q == +id) {
    return true;
  }
  // array query
  if (q.startsWith("arrays.")) {
    new_query = q.split("arrays.")[1];
    if (arrays == undefined || arrays[new_query] == undefined) {
      return false;
    }
    for (let i = 0; i < arrays[new_query].length; i++) {
      if (query(arrays[new_query][i], id, arrays)) {
        return true;
      }
    }
    return false;
  }
  if (!q.includes("=")) {return false}
  var filters = q.split(",");
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i].split("=");
    var name = filter[0];
    var val = filter[1];
    // exact val match
    if (["atk", "def", "level", "linkval"].includes(name) && ygodata.cards[id][name] == val) {
      return true;
    }
    if (ygodata.cards[id][name].toLowerCase().includes(val.toLowerCase())) {
      return true;
    }
  }
}

class Combo {
  /**
   * @param {Object} deck 
   * @param {Object} args 
   */
  constructor(deck, args, arrays) {
    this.deck_size = deck.main.length;
    if (args.turn == "first") { this.hand_size = 5 }
    else if (args.turn == "second") { this.hand_size = 6 }
    else { console.error("Argument args.turn should be first/second"); return; }

    // compute the amount of test.card in the deck for each test
    // and compute the number of unknown (misc) cards
    var misc = deck.main.length;
    // for each test
    for (var i = 0; i < args.tests.length; i++) {
      var test = args.tests[i];
      var count = 0;

      // count the number of cards that match the text query
      for (var i2 = 0; i2 < deck.main.length; i2++) {
        if (query(test.query, deck.main[i2], arrays)) {
          count++;
        }
      }

      if (test.min > count) {
        // combo is not possible with this deck
        this.impossible = true;
        continue;
      }

      if (test.max == undefined || test.max > count) {
        test.max = count;
      }

      if (test.target == "deck") {
        var max = count - test.min;
        var min = count - test.max;
        test.min = min;
        test.max = max;
        test.target = "hand";
      }

      test.min = +test.min;
      test.max = +test.max;
      test.amt = count;
      misc -= count;
    }
    this.tests = args.tests;
    this.misc = misc;
  }

  /**
   * Compute the chance of drawing into the combo
   */
  compute() {
    if (this.impossible) {
      return 0;
    }
    var recursive = this.recursiveCalculate([], 0);
    var chance = (recursive / choose(this.deck_size, this.hand_size)) * 100;
    return chance;
  }

  /**
   * 
   * @param {list} currentHand 
   * @param {number} currentHandSize 
   */
  recursiveCalculate(currentHand, currentHandSize) {
    if (this.tests.length === 0 || currentHandSize >= this.hand_size) {
      if (currentHandSize == this.hand_size) {
        var noChance = false;
        for (var i = 0; i < this.tests.length; i++) {
          if (this.tests[i].min != 0) {
            noChance = true;
            break;
          }
        }
        if (noChance) {
          return 0;
        }
      } else if (currentHandSize > this.hand_size) {
        return 0;
      }
      var newChance = 1;
      var output = "";
      for (var i = 0; i < currentHand.length; i += 2) {
        newChance *= choose(currentHand[i], currentHand[i + 1]);
      }
      if (currentHandSize < this.hand_size) {
        newChance *= choose(this.misc, this.hand_size - currentHandSize);
      }
      return newChance;
    }
    var obj = this.tests.pop();
    var chance = 0;
    for (var i = obj.min; i <= obj.max; i++) {
      currentHand.push(obj.amt);
      currentHand.push(i);
      chance += this.recursiveCalculate(currentHand, currentHandSize + i);
      currentHand.pop();
      currentHand.pop();
    }
    this.tests.push(obj);
    return chance;
  }
}

module.exports = {
  query,
  Combo
};
