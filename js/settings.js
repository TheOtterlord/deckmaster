function open_settings() {
  document.querySelector(".fade-bg").classList.remove("hide");
  document.querySelector(".settings").classList.add("show");
}

function close_settings() {
  document.querySelector(".fade-bg").classList.add("hide");
  document.querySelector(".settings").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".ir-flex.ygopro_connect").innerHTML = (localStorage.getItem("ygopro") ?? "No folder selected...");
});
