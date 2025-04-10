/*var debug;
var isServer;
var cheatVer;
var testedOn;*/
//variables init
//main
var isLoad = false;
var isDelete = false;
var vars = SugarCube.State.variables;
var isCheatPressed = false;
var curVer = document.getElementById("gameVersionDisplay2").innerHTML;
var quicklink = document.getElementById("quick-link");
var statlink = document.getElementById("stats-link");
var misclink = document.getElementById("misc-link");
var quickcontent = document.getElementById("quick-content");
var statscontent = document.getElementById("stats-content");
var misccontent = document.getElementById("misc-content");
var toastContainer = document.getElementById("toastContainer");
var modal = document.getElementById("modal");
var modalContentContainer = document.getElementById("modal-content-container");
var cheatVerType;
var modalOpen;
var functionsInProcess;
var functionsCompleted;
var downloadSite = "https://www.mediafire.com/folder/d6uiwpcm3y0gu/degrees_of_lewdity";
var sourceCode = "https://github.com/Zenix-Al/DoL-CheatPlus.git";
//mycode
var functionbundle = {};
var dailyfunctionbundle = {};
var errorFunctions;
var progressFunctions = 0;
var totalFunctions = 0;
var prevHour = -1;
var extra_notif = false;
//sync
var syncinprogress = 0;
var database = "degrees-of-lewdity";
var whatversion = "vanilla";
//listener
var cheat = document.getElementById("cheat");
var clickCounter = 0;
var curDate = 0;
var buttonId;
//cheat init
var npctrait = ["trust", "love", "dom", "lust", "rage", "trauma", "purity", "corruption"];
var characteristics = [
  "beauty",
  "purity",
  "physique",
  "willpower",
  "awareness",
  "promiscuity",
  "exhibitionism",
  "deviancy",
  "grace",
  "submissive",
  "masochism",
  "sadism",
];
var npcinterest = [
  "Robin",
  "Whitney",
  "Eden",
  "Kylar",
  "Avery",
  "Black Wolf",
  "Great Hawk",
  "Alex",
  "Sydney",
];
var npcnamelist = SugarCube.setup.NPCNameList;
var bodyparts = [
  "nipples",
  "bottom",
  "penis",
  "balls",
  "clit",
  "anus",
  "vagina",
  "labia",
  "left_thigh",
  "right_thigh",
  "left_foot",
  "right_foot",
  "left_arm",
  "right_arm",
  "left_hand",
  "right_hand",
  "tummy",
  "back",
  "face",
  "mouth",
  "left_ear",
  "right_ear",
  "hair",
];
var parasitename = ["urchin", "slime", "maggot"];
var fame = [
  "exhibitionism",
  "prostitution",
  "bestiality",
  "sex",
  "rape",
  "good",
  "business",
  "scrap",
  "pimp",
  "social",
  "model",
  "pregnancy",
  "impreg",
];
var school_rep = ["delinquency", "cool"];
var animals = ["pigs", "horses", "cattle", "dogs"];
var orgasm_toggle = 0;
var exam = ["science_exam", "maths_exam", "english_exam", "history_exam"];
var talent_skill = [
  "danceskill",
  "swimmingskill",
  "skulduggery",
  "athletics",
  "tending",
  "housekeeping",
];
var hentaiSkill = [
  "seductionskill",
  "oralskill",
  "vaginalskill",
  "analskill",
  "handskill",
  "feetskill",
  "bottomskill",
  "thighskill",
  "chestskill",
  "penileskill",
];
var textBox = document.getElementById("tmpText");
var babyOptions = ["motherKnown", "fatherKnown", "name", "abandon"];
var babyOptionsText = ["mother Known", "father Known", "name", "Abandon"];
//fetcher
var isFetching = false;
var totalFetchFunction;
var currentFetch;
//storage
if (!SugarCube.State.variables.cheatPlus) SugarCube.State.variables.cheatPlus = {};
var reactivatingToggles;
if (curVer.startsWith(".")) curVer = "0" + curVer;
//debug
let isTestingAllFunction = false;
//endof variable init
if (curVer == testedOn) {
  var isCheatWork = "compatible";
  var isCheatWorkSymbol = "☑";
} else {
  var isCheatWork = "version is different, proceed with caution!";
  var isCheatWorkSymbol = "⚠";
}
if (isServer == 1) {
  cheatVerType = "CheatP Server";
} else {
  cheatVerType = "CheatP";
}
convertStringIndexArrayToObject = (arr) => {
  const obj = {};
  for (const key in arr) {
    if (typeof key === "string") {
      obj[key] = arr[key];
    }
  }
  return obj;
};
function showToast(text) {
  const newToast = document.createElement("div");
  newToast.classList.add("toast");
  newToast.textContent = text;
  toastContainer.appendChild(newToast);
  setTimeout(() => {
    newToast.classList.add("hidden");
    setTimeout(() => {
      toastContainer.removeChild(newToast);
    }, 300);
  }, 3000);
}

const timedToast = (text, time) => setTimeout(() => showToast(text), time);

function bloodEffect() {
  const effect = document.getElementById("effect-layer");
  const bodyElement = document.body;

  effect.classList.remove("hidden");
  effect.style.transition = "opacity 0.1s ease-in-out";
  effect.style.opacity = 0;

  setTimeout(() => {
    effect.style.transition = "opacity 2s ease-in-out";
    effect.style.opacity = 1;
    bodyElement.classList.add("shake");
  }, 200);

  setTimeout(() => {
    bodyElement.classList.remove("shake");
    effect.classList.add("hidden");
  }, 2200);
}

function openModal() {
  if (modalOpen || (isDelete && isCheatPressed)) return;

  if (isDelete) {
    isCheatPressed = true;
    showToast("Loading cheat, please slow down.");
    return setTimeout(openModal, 100); // Recursively retry instead of calling twice
  }

  modal.style.display = "block";
  modalOpen = true;
  init_interface();
  loadall();
}

function closeModal() {
  if (!modalOpen) return;
  modal.style.display = "none";
  modalOpen = false;
  deleteText();
}

function moveButton(direction) {
  const floatingButton = document.getElementById("floating-button");
  if (direction === "up") {
    floatingButton.classList.toggle("moved");
    document.getElementById("cheat-up").hidden = true;
    document.getElementById("cheat-down").hidden = false;
  } else if (direction === "down") {
    floatingButton.classList.toggle("moved");
    document.getElementById("cheat-up").hidden = false;
    document.getElementById("cheat-down").hidden = true;
  }
}

function showContent(nav, contentElement) {
  hideAllContent();
  nav.classList.add("gold");
  contentElement.classList.add("active");
}

function generatetext(ids, inputs, textInputs, category) {
  const inputcategory = document.getElementById(category);
  const modalInputs = document.createElement("div");
  modalInputs.className = "modal-content-padding";

  for (let i = 0; i < inputs.length; i++) {
    let element;

    switch (inputs[i]) {
      case "input":
        element = document.createElement("input");
        element.id = ids[i];
        element.className = "modal-content-width";
        element.autocomplete = "off";
        break;

      case "textarea":
        element = document.createElement("textarea");
        element.id = ids[i];
        element.className = "modal-content-width";
        element.style = "height: 100px; line-height: 1.5; width: 100%; min-width: 0;";
        element.autocomplete = "off";
        element.spellcheck = false;
        break;

      case "select":
        element = document.createElement("select");
        element.id = ids[i];
        textInputs[i].forEach((optionText) => {
          const option = document.createElement("option");
          option.value = optionText;
          option.textContent = optionText;
          element.appendChild(option);
        });
        break;

      case "button":
        element = document.createElement("a");
        element.id = ids[i];
        element.role = "link";
        element.textContent = textInputs[i];
        break;

      case "radio":
        element = document.createDocumentFragment(); // To group multiple radio buttons
        textInputs[i].forEach((radioText, j) => {
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.id = `${ids[i]}${j}`;
          radio.name = ids[i];
          radio.value = radioText;

          const label = document.createElement("label");
          label.htmlFor = `${ids[i]}${j}`;
          label.className = "modal-content-right";
          label.textContent = radioText;

          element.appendChild(radio);
          element.appendChild(label);
        });
        break;

      case "header":
        element = document.createElement("span");
        element.className = "gold";
        element.textContent = textInputs[i];
        break;

      case "newline":
        element = document.createElement("br");
        break;

      case "text":
        element = document.createTextNode(textInputs[i]);
        break;

      case "range":
        element = document.createElement("input");
        element.type = "range";
        element.id = ids[i];
        element.min = "0";
        element.max = textInputs[i];
        element.value = "0";
        break;

      case "link":
        element = document.createElement("a");
        element.href = ids[i];
        element.target = "_blank";
        element.textContent = textInputs[i];
        break;

      case "tooltip":
        element = document.createElement("mouse");
        element.className = "tooltip-small linkBlue";
        element.id = ids[i];
        element.innerHTML = `(?)<span>${textInputs[i]}</span>`;
        break;

      case "checkbox":
        element = document.createElement("input");
        element.id = ids[i];
        element.type = "checkbox";
        element.className = "modal-content-color";

        const label = document.createTextNode(textInputs[i]);
        modalInputs.appendChild(element);
        modalInputs.appendChild(label);
        continue; // Skip appending `element` separately
    }

    if (element) modalInputs.appendChild(element);
    if (inputs.length > 1 && i < inputs.length - 1)
      modalInputs.appendChild(document.createTextNode(" | "));
  }

  inputcategory.appendChild(modalInputs);
}

function deleteText() {
  // Check if fetching is in progress
  if (currentFetch === totalFetchFunction) isFetching = false;
  if (isFetching) {
    requestAnimationFrame(deleteText);
    return;
  }
  isDelete = true;

  // Target all cheat UI sections and clear them efficiently
  ["quick-content", "stats-content", "misc-content"].forEach((id) => {
    const content = document.getElementById(id);
    while (content.firstChild) {
      content.firstChild.remove();
    }
  });

  isDelete = false;
}

function hideAllContent() {
  [quicklink, statlink, misclink].forEach((link) => link.classList.remove("gold"));
  [quickcontent, statscontent, misccontent].forEach((content) =>
    content.classList.remove("active")
  );
}

function Enable_cheat_history() {
  var button_back = document.getElementById("cheat-history-backwards");
  var button_forward = document.getElementById("cheat-history-forwards");
  var button_set = document.getElementById("Enable_cheat_history");
  if (button_back.hidden == true) {
    button_back.hidden = false;
    button_forward.hidden = false;
    button_set.innerHTML = "Disable";
    mycode.update_history();
  } else {
    button_back.hidden = true;
    button_forward.hidden = true;
    button_set.innerHTML = "Enable";
  }
}

function Enable_sidebar_button() {
  var button = document.getElementById("cheat-sidebar");
  var sidebar_button = document.getElementById("Enable_sidebar_button");
  if (button.hidden == true) {
    button.hidden = false;
    sidebar_button.innerHTML = "Disable";
  } else {
    button.hidden = true;
    sidebar_button.innerHTML = "Enable";
  }
}

function simple_cheat_button() {
  const cheatButton = document.getElementById("cheat-open");
  const simpleCheatButton = document.getElementById("simple_cheat_button");

  const isDisabled = simpleCheatButton.innerHTML === "Disable";
  simpleCheatButton.innerHTML = isDisabled ? "Enable" : "Disable";
  cheatButton.innerHTML = isDisabled ? "Cheat" : "⚙";
  cheatButton.style.fontSize = isDisabled ? "" : "89%";
}

function executeSearch(action = buttonId) {
  const searchTypeMap = ["startsWith", "includes", "endsWith"];
  const searchType = searchTypeMap[document.getElementById("search_type").value] || "startsWith";
  const searchTerm = document.getElementById("search_value").value.trim().toLowerCase();
  const searchResult = document.getElementById("search_result");

  searchResult.value = "Result :\n";

  if (!searchTerm) {
    showToast("failed, Search key is blank!");
    return;
  }

  function processValue(value, newPath) {
    if (Array.isArray(value)) {
      value.length ? logArrayValues(value, newPath) : logObjectValues(value, newPath);
    } else if (typeof value === "object" && value !== null) {
      logObjectValues(value, newPath);
    } else if (String(value).toLowerCase()[searchType](searchTerm) && value !== "") {
      searchResult.value += `${newPath}=${value}\n`;
    }
  }

  function checkObject(key, value, newPath) {
    if (key.toLowerCase()[searchType](searchTerm) && value !== "") {
      searchResult.value += `${newPath}=${value}\n`;
    }
  }

  function logObjectValues(obj, curPath) {
    for (const key in obj) {
      const value = obj[key];
      const newPath = `${curPath}.${key}`;
      processValue(value, newPath);
      checkObject(key, value, newPath);
    }
  }

  function logArrayValues(arr, curPath) {
    arr.forEach((value, i) => processValue(value, `${curPath}[${i}]`));
  }

  if (action === "search123") {
    showToast("Searching... might take a while");
    logObjectValues(SugarCube.State.variables, "SugarCube.State.variables");
  } else if (action === "search456") {
    showToast("Searching...");
    for (const prop in SugarCube.State.variables) {
      if (prop.toLowerCase()[searchType](searchTerm)) {
        searchResult.value += `SugarCube.State.variables.${prop}=${SugarCube.State.variables[prop]}\n`;
      }
    }
  }
}

//restore any variable that might causing problem
function restoreVariables() {
  var triggered = false;
  if (SugarCube.State.variables.alluremod === 0) {
    SugarCube.State.variables.alluremod = 1;
    showToast("Encounter rate enabled!");
  }
  if (typeof functionbundle["allNPCInstaPregnant"] === "function") {
    buttonActions["allNPCInstaPregnant"]();
    showToast("NPC instant pregnant is disabled!");
    triggered = true;
  }
  if (triggered) {
    showToast("This ensure the game settings isnt break.");
    showToast("You can re-enable it after youre done.");
  }
}
function executeFunctionsInObject(obj) {
  if (isTestingAllFunction) return;
  isTestingAllFunction = true;
  let total = 0;
  for (const key in obj) {
    if (typeof obj[key] === "function") {
      console.log(`Executing function at key: ${key}`);
      obj[key](); // Call the function
      total++;
    }
  }
  timedToast("testing complete", 5000);
  timedToast(`Total function tested ${total}`, 5000);
  isTestingAllFunction = false;
}
