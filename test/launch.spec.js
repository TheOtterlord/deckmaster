const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, "..")]
});

describe('Application Launch', function() {
  this.timeout(10000);

  before(() => {
    return app.start();
  })

  after(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  })

  it('shows an initial window', (done) => {
    app.client.getWindowCount().then(function (count) {
      assert.strictEqual(count, 1);
      done();
    });
  });

  it('displays intro screen', (done) => {
    var isVisible = app.client.execute(() => {return document.querySelector(".intro").style.display}) != "none";
    assert(isVisible);
    done();
  });
});
