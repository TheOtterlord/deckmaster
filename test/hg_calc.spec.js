const assert = require('assert');
const { query, Combo } = require('../js/hg_calc');

describe("YCB Query", () => {
  it("matches id", () => {
    return assert.strictEqual(query("10000", "10000", []), true);
  });

  // TODO: import `ygodata`

  it("matches name");
});

describe("Hypergeometric Calculations", () => {
  it("simple 1 card combo with id", () => {
    var deck = ["10000", "10000", "10000"];
    for (let i = 0; i < 37; i++) deck.push("14878871");
    var combo = new Combo({main: deck, extra:[], side:[]}, {
      "turn": "first",
      "tests": [
        {
          "target": "hand",
          "query": "10000",
          "min": 1
        }
      ]
    }, []);
    assert.strictEqual(+combo.compute().toFixed(3), 33.755);
  });
});
