function drop(elem) {
  setTimeout(() => {
    elem.style.display = "block";
  }, 100);
}

window.onclick = function(event) {
  if (!event.target.matches('.dropdown-content')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display != "none") {
        openDropdown.style.display = "none";
      }
    }
  }
}
