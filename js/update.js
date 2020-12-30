const originalFs = require('original-fs');
const paths = require('path');

function checkForUpdates() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var json = JSON.parse(xhttp.responseText);
      if (json[0].tag_name > deckmaster.version) {
        const options = {
          type: 'question',
          buttons: ['Cancel', 'Yes', 'No'],
          defaultId: 2,
          title: 'Update Available!',
          message: 'Do you want to update?',
          detail: 'Updating keeps the bugs at bay'
        };
        dialog.showMessageBox(null, options).then((data) => {
          // if yes: update
          if (data.response == 1) {
            // temporary solution to updating; sorry :(
            window.open("https://github.com/TheOtterlord/deckmaster/releases/latest", "_blank");
            // installUpdate(json[0].tag_name);
          }
        });
      } else {
        console.log("Up to date");
      }
    }
  };
  xhttp.open("GET", "https://api.github.com/repos/TheOtterlord/DeckMaster/releases", true);
  xhttp.send();
}

function installUpdate(version) {
  try {
    var received_bytes = 0;
    var total_bytes = 0;
    var asar_path = __dirname;
    if (!asar_path.includes('.asar')) {
      asar_path = paths.join(asar_path, "resources", 'app.asar');
    }
    var file = originalFs.createWriteStream(asar_path);
    https.get("https://github.com/TheOtterlord/deckmaster/releases/download/" + version + "/resources.asar", function (response) {
      response.pipe(file);
      total_bytes = parseInt(response.headers['content-length']);
      response.on('end', deckmaster.restart);
      response.on('data', function (chunk) {
        received_bytes += chunk.length;
        console.log(received_bytes / total_bytes * 100 + "%");
      });
    });
  } catch (e) {
    console.log("Manual update required", e);
    deckmaster.notification("Task Failed", "Failed to update DeckMaster, please download a new installer from https://github.com/TheOtterlord/deckmaster/downloads/latest");
  }
}

document.addEventListener("DOMContentLoaded", checkForUpdates);
