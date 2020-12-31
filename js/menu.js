var MENU_OPEN = false;

function drop(elem) {
  MENU_OPEN = true;
  setTimeout(() => {
    elem.style.display = "block";
  }, 100);
}

window.onclick = function(event) {
  if (!event.target.matches('.dropdown-content')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display != "none") {
        openDropdown.style.display = "none";
      }
    }
    if (!event.target.matches('.dropbtn')) {
      MENU_OPEN = false;
    }
  }
}

window.onmousemove = ev => {
  if (MENU_OPEN && ev.target.matches('.dropbtn') && ev.target.nextElementSibling.style.display != "block") {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display != "none") {
        openDropdown.style.display = "none";
      }
    }
    ev.target.nextElementSibling.style.display = "block";
  }
};
