var cheatDiv = document.createElement("div");
cheatDiv.id = "cheat";
document.body.appendChild(cheatDiv);

var floatButton = document.createElement("div");
floatButton.id = "floating-button";
cheatDiv.appendChild(floatButton);

var toast = document.createElement("div");
toast.id = "toastContainer";
cheatDiv.appendChild(toast);

var effect = document.createElement("div");
effect.id = "effect-layer";
effect.className = "hidden";
cheatDiv.appendChild(effect);

var modal = document.createElement("div");
modal.id = "modal";
modal.className = "modal";
cheatDiv.appendChild(modal);

function createButton(id, content, hidden = false) {
  var button = document.createElement("button");
  button.id = id;
  button.innerHTML = content;
  button.hidden = hidden;
  return button;
}

const floatButtons = [
  { id: "cheat-history-backwards", content: "&#8592;", hidden: true },
  { id: "cheat-history-forwards", content: "&#8594;", hidden: true },
  { id: "cheat-sidebar", content: "&#x2630;", hidden: true },
  { id: "cheat-open", content: "Cheat" },
  { id: "cheat-up", content: "&#9650;", hidden: true },
  { id: "cheat-down", content: "&#9660;" },
];

floatButtons.forEach((btn) =>
  floatButton.appendChild(createButton(btn.id, btn.content, btn.hidden))
);

var modalContent = document.createElement("div");
modalContent.className = "modal-content";
modal.appendChild(modalContent);

var navbar = document.createElement("div");
navbar.className = "navbar";
modalContent.appendChild(navbar);

function createNavLink(id, text, className = "nav-link") {
  var link = document.createElement("div");
  link.id = id;
  link.textContent = text;
  link.className = className;
  return link;
}

const navLinks = [
  { id: "quick-link", text: "Quick", className: "nav-link gold" },
  { id: "stats-link", text: "Stat" },
  { id: "misc-link", text: "Misc" },
  { id: "closeButton", text: "×", className: "close nav-link" },
];

navLinks.forEach((nav) => navbar.appendChild(createNavLink(nav.id, nav.text, nav.className)));

var modalContentContainer = document.createElement("div");
modalContentContainer.id = "modal-content-container";
modalContent.appendChild(modalContentContainer);

function createContentSection(id, active = false) {
  var section = document.createElement("div");
  section.id = id;
  section.className = "content" + (active ? " active" : "");
  return section;
}

const contentSections = [
  { id: "quick-content", active: true },
  { id: "stats-content" },
  { id: "misc-content" },
];

contentSections.forEach((sec) =>
  modalContentContainer.appendChild(createContentSection(sec.id, sec.active))
);

var customcss = document.createElement("style");
