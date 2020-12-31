function open_settings() {
  document.querySelector(".settings").style.display = "block";
}

function close_settings() {
  document.querySelector(".settings").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".ir-flex.ygopro_connect").innerHTML = (localStorage.getItem("ygopro") ?? "No folder selected...");
});
