var user_css = localStorage.getItem("css") ?? "";
var user_theme = localStorage.getItem("theme") ?? "default";

function updateCSS() {
  document.body.parentElement.firstChild.lastChild.innerHTML = themes[user_theme]+user_css;
}

function setTheme(theme) {
  if (themes[theme]) {
    user_theme = theme;
    updateCSS();
    localStorage.setItem("theme", theme);
  }
}

function setCSS(css) {
  user_css = css;
  updateCSS();
  localStorage.setItem("css", css);
}

var themes = {
  "default": "/* defined in iridium.css */",

  "classic": `
    :root {
      --background: #202020;
      --color: #fefefe;
      --elevated: #242424;
      --primary: #9200d6;
      --on-primary: #fff;
      --secondary: #03DAC6;
      --hover-shade: rgba(255,255,255,0.1);
    }
  `,

  "nightfall": `
    :root {
      --background: #06090F;
      --color: #fefefe;
      --elevated: #0D1117;
      --primary: #192b2e;
      --on-primary: #fff;
      --secondary: #b44;
      --hover-shade: rgba(255,255,255,0.1);
    }
  `,

  "light": `
    :root {
      --background: #fff;
      --color: #000;
      --elevated: #e0e0e0;
      --primary: #fa4040;
      --on-primary: #fff;
      --secondary: #ffae02;
      --hover-shade: rgba(255,255,255,0.2);
    }
    .ir-faded-text {
      color: #444;
    }
  `
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.parentElement.firstChild.innerHTML += `<style>${user_css}</style>`;
  updateCSS();
});
