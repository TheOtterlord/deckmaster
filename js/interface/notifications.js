function notify(message, timeout) {
  var el = document.createElement("div");
  el.className = "notification";
  el.innerHTML = message;
  document.querySelector("#notifications").appendChild(el);
  function destroy() {
    el.classList.add("closing");
    setTimeout(() => el.remove(), 1000);
  }
  if (timeout) return setTimeout(destroy, timeout);
  return destroy;
}
