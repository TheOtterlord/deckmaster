/**
 * Display am in-app notification to the user
 * @param {string} message The message to give to the user
 * @param {number} timeout milliseconds to show message for
 */
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
