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
customcss.textContent = "#floating-button{position:fixed;top:2%;right:20px;z-index:899;transition:top 0.5s ease-in-out}#floating-button.moved{top:90%}#effect-layer{z-index:999;background-color:red;opacity:0;position:fixed;top:0;left:0;width:100%;height:100%}.hidden{display:none}#toastContainer{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:999}@media(prefers-reduced-motion:reduce){.fade{transition:none}}.fade:not(.show){opacity:0}.collapse:not(.show){display:none}.collapsing{height:0;overflow:hidden;transition:height .35s ease}@media(prefers-reduced-motion:reduce){.collapsing{transition:none}}.collapsing.collapse-horizontal{width:0;height:auto;transition:width .35s ease}@media(prefers-reduced-motion:reduce){.collapsing.collapse-horizontal{transition:none}}.toast{background-color:#333;color:#fff;padding:10px 20px;border-radius:5px;margin-bottom:10px;opacity:1;transition:opacity .3s ease-in-out}.modal{display:none;position:fixed;z-index:900;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.5)}.modal-content{background-color:#fefefe;margin:10px auto;border:1px solid #888;width:90%}.close{cursor:pointer;font-weight:bold}.close:hover,.close:focus{color:black;cursor:pointer}.modal-content-container{display:flex;flex-direction:column}.modal-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.modal-label{flex:1}.modal-inputs{flex:2}.modal-content{background-color:#222}.modal-content-container{max-height:400px;overflow-y:auto}.navbar{display:flex;justify-content:space-between;align-items:center;background-color:#333;color:#fff}.nav-link{width:100%;cursor:pointer;text-align:center;cursor:pointer;position:relative;border-right:1px solid #fff;padding:10px}.nav-link.active{text-decoration:underline}.content{display:none;padding:20px}.content.active{display:block}@keyframes shake{0%{transform:translateX(0)}25%{transform:translateX(-5px)}50%{transform:translateX(5px)}75%{transform:translateX(-3px)}100%{transform:translateX(3px)}}";
document.head.appendChild(customcss);
