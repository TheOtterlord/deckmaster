const { ipcRenderer } = require("electron")

ipcRenderer.on('message', function(event, text) {
  if (text == "update-downloaded") {
    notify(`
      A new update was downloaded!<br><br>
      <button style="float: left;width: 50%;" onclick="ipcRenderer.send('update')">Restart</button>
      <button style="float: left;width: 50%;" onclick="this.parentElement.remove()">Dismiss</button>
    `);
  } else if (text.startsWith("progress:")) {
    var percent = +text.split("progress:")[1];
    document.querySelector("#update-progress").innerHTML = `Downloading update: ${percent}%`;
    win.setProgressBar(percent/100);
  } else if (text == "update-available") {
    notify(`<div id='update-progress'>
      New update available!
    </div>`);
  } else {
    notify(text, 3000);
  }
})

/**
 * Checks for updates for non-windows devices
 * Windows is handled by electron-updater in index.js
 */
function checkForUpdates() {
  if (process.platform === "win32") return;
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
          message: `Do you want to update to ${json[0].tag_name}?`,
          detail: 'Updating keeps the bugs at bay'
        };
        dialog.showMessageBox(null, options).then((data) => {
          // yes == 1
          if (data.response == 1) {
            window.open("https://github.com/TheOtterlord/deckmaster/releases/latest", "_blank");
          }
        });
      } else {
        console.log("DeckMaster is up to date");
      }
    }
  };
  xhttp.open("GET", "https://api.github.com/repos/TheOtterlord/DeckMaster/releases", true);
  xhttp.send();
}

document.addEventListener("DOMContentLoaded", checkForUpdates);
