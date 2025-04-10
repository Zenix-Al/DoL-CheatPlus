const layoutTemplate = {
  tag: "div",
  id: "cheat",
  children: [
    {
      tag: "div",
      id: "floating-button",
      children: [
        { tag: "button", id: "cheat-open", text: "Cheat" },
        { tag: "button", id: "cheat-up", text: "▲", hidden: true },
        { tag: "button", id: "cheat-down", text: "▼" },
      ],
    },
    { tag: "div", id: "toastContainer" },
    { tag: "div", id: "effect-layer", class: "hidden" },
    {
      tag: "div",
      id: "modal",
      class: "modal",
      children: [
        {
          tag: "div",
          class: "modal-content",
          children: [
            {
              tag: "div",
              class: "navbar",
              children: [
                { tag: "div", id: "quick-link", class: "nav-link gold", text: "Quick" },
                { tag: "div", id: "stats-link", class: "nav-link", text: "Stat" },
                { tag: "div", id: "misc-link", class: "nav-link", text: "Misc" },
                { tag: "div", id: "closeButton", class: "close nav-link", text: "×" },
              ],
            },
            {
              tag: "div",
              id: "modal-content-container",
              children: [
                { tag: "div", id: "quick-content", class: "content active" },
                { tag: "div", id: "stats-content", class: "content" },
                { tag: "div", id: "misc-content", class: "content" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

function renderTemplate(template) {
  const el = document.createElement(template.tag);
  if (template.id) el.id = template.id;
  if (template.class) el.className = template.class;
  if (template.text) el.textContent = template.text;
  if (template.hidden) el.hidden = true;
  if (template.children) {
    template.children.forEach((child) => el.appendChild(renderTemplate(child)));
  }
  return el;
}

function injectCSS(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

document.body.appendChild(renderTemplate(layoutTemplate));
