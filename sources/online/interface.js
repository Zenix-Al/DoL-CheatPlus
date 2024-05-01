//main div
var cheatDiv = document.createElement("div");
cheatDiv.id = "cheat";
document.body.appendChild(cheatDiv);
//2nd layer div
//float button
var floatButton=document.createElement("div");
floatButton.id = "floating-button";
cheatDiv.appendChild(floatButton);
//toast
var buttons=document.createElement("button");
var toast = document.createElement("div");
toast.id = "toastContainer";
cheatDiv.appendChild(toast);
var effect = document.createElement("div");
effect.id = "effect-layer";
effect.className = "hidden";
cheatDiv.appendChild(effect);
//moadal
var modal = document.createElement("div");
modal.id = "modal";
modal.className = "modal";
cheatDiv.appendChild(modal);
//floatbutton content
buttons.id="cheat-history-backwards"
buttons.innerHTML="&#8592;";
buttons.hidden=true;
floatButton.appendChild(buttons);
buttons=document.createElement("button");
buttons.id="cheat-history-forwards"
buttons.innerHTML="&#8594;";
buttons.hidden=true;
floatButton.appendChild(buttons);
buttons=document.createElement("button");
buttons.id="cheat-sidebar"
buttons.innerHTML="&#x2630;";
buttons.hidden=true;
floatButton.appendChild(buttons);
buttons=document.createElement("button");
buttons.id="cheat-open"
buttons.textContent="Cheat";
floatButton.appendChild(buttons);
buttons=document.createElement("button");
buttons.id="cheat-up"
buttons.hidden=true;
buttons.innerHTML="&#9650;";
floatButton.appendChild(buttons);
buttons=document.createElement("button");
buttons.id="cheat-down"
buttons.innerHTML="&#9660;";
floatButton.appendChild(buttons);


//moadal content
var modalContent = document.createElement("div");
modalContent.className = "modal-content";
modal.appendChild(modalContent);

var navbar = document.createElement("div");
navbar.className = "navbar";
modalContent.appendChild(navbar);

var navbar_content = document.createElement("div");
navbar_content.id = "quick-link";
navbar_content.className = "nav-link gold";
navbar_content.textContent = "Quick";
navbar.appendChild(navbar_content);

navbar_content = document.createElement("div");
navbar_content.id = "stats-link";
navbar_content.textContent = "Stat";
navbar_content.className = "nav-link";
navbar.appendChild(navbar_content);

navbar_content = document.createElement("div");
navbar_content.id = "misc-link";
navbar_content.textContent = "Misc";
navbar_content.className = "nav-link";
navbar.appendChild(navbar_content);

navbar_content = document.createElement("div");
navbar_content.id = "closeButton";
navbar_content.innerHTML = "&times;";
navbar_content.className = "close nav-link";
navbar.appendChild(navbar_content);

var modalContentContainer = document.createElement("div");
modalContentContainer.id = "modal-content-container";
modalContent.appendChild(modalContentContainer);

var modalContentContainer_content = document.createElement("div");
modalContentContainer_content.id = "quick-content";
modalContentContainer_content.className = "content active";
modalContentContainer.appendChild(modalContentContainer_content);

modalContentContainer_content = document.createElement("div");
modalContentContainer_content.id = "stats-content";
modalContentContainer_content.className = "content";
modalContentContainer.appendChild(modalContentContainer_content);

modalContentContainer_content = document.createElement("div");
modalContentContainer_content.id = "misc-content";
modalContentContainer_content.className = "content";
modalContentContainer.appendChild(modalContentContainer_content);

navbar = document.createElement("div");
navbar.className = "navbar";
modalContent.appendChild(navbar);

navbar_content = document.createElement("div");
navbar_content.id = "closeButton";
navbar_content.textContent = "×";
navbar_content.className = "close nav-link";
navbar.appendChild(navbar_content);

var customcss = document.createElement("style");
