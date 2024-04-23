/*var debug;
var isServer;
var cheatVer;
var testedOn;*/
//variables init
//main
var quicklink = document.getElementById("quick-link");
var statlink = document.getElementById("stats-link");
var misclink = document.getElementById("misc-link");
var quickcontent = document.getElementById("quick-content");
var statscontent = document.getElementById("stats-content");
var misccontent = document.getElementById("misc-content");
var toastContainer = document.getElementById('toastContainer');
var modal = document.getElementById("modal");
var modalContentContainer = document.getElementById('modal-content-container');
var cheatVerType;
var modalOpen;
var functionsInProcess;
var functionsCompleted;
//mycode
var functionbundle = {}; 
var dailyfunctionbundle = {}; 
var runitallIsRunning=0;
var prevHour=-1;
//sync
var syncinprogress=0;
var database="degrees-of-lewdity";
var whatversion="vanilla";
//listener
var cheat = document.getElementById("cheat");
var clickCounter=0;
var curDate=0;
//cheat init
var npctrait = ['trust', 'love', 'dom', 'lust', 'rage', 'trauma', 'purity', 'corruption'];
var characteristics=['beauty', 'purity', 'physique', 'willpower', 'awareness', 'promiscuity', 'exhibitionism', 'deviancy', 'grace', 'submissive', 'masochism', 'sadism'];
var npcinterest=["Robin", "Whitney", "Eden", "Kylar", "Avery", "Black Wolf", "Great Hawk", "Alex", "Sydney"];
var npcnamelist=SugarCube.setup.NPCNameList;
var bodyparts= ["nipples", "bottom", "penis", "balls", "clit", "anus", "vagina", "labia", "left_thigh", "right_thigh", "left_foot", "right_foot", "left_arm", "right_arm", "left_hand", "right_hand", "tummy", "back", "face", "mouth", "left_ear", "right_ear", "hair"];
var parasitename=["urchin", "slime", "maggot"];
var fame=["exhibitionism", "prostitution", "bestiality", "sex", "rape", "good", "business", "scrap", "pimp", "social", "model", "pregnancy", "impreg"];
var school_rep=["delinquency","cool"];
var animals=['pigs','horses','cattle','dogs'];
var orgasm_toggle=0;
var exam=["science_exam", "maths_exam", "english_exam", "history_exam"];
var talent_skill = ["danceskill", "swimmingskill", "skulduggery", "athletics", "tending", "housekeeping"];
var hentaiSkill = ["seductionskill", "oralskill", "vaginalskill", "analskill", "handskill", "feetskill", "bottomskill", "thighskill", "chestskill", "penileskill"];
var curVer=document.getElementById("gameVersionDisplay2").innerHTML;
var textBox=document.getElementById("tmpText");
var babyOptions = ["motherKnown", "fatherKnown", "name", "abandon"];
var babyOptionsText = ["mother Known", "father Known", "name", "Abandon"];

//endof variable init
function showToast(text) {
    const newToast = document.createElement('div'); 
    newToast.classList.add('toast'); 
    newToast.textContent = text;
    toastContainer.appendChild(newToast); 
    setTimeout(() => {
        newToast.classList.add('hidden');
        setTimeout(() => {
            toastContainer.removeChild(newToast); 
        }, 300);
    }, 3000);
}

function bloodEffect(){
	var effect = document.getElementById('effect-layer');
	effect.classList.remove('hidden');
	effect.style.transition="opacity 0.1s ease-in-out";
	effect.style.opacity = 0;
	setTimeout(function(){effect.style.transition="opacity 2s ease-in-out";
	effect.style.opacity = 1;}, 200);
	var bodyElement = document.body;
	bodyElement.style.animation="shake 0.3s linear infinite";
	setTimeout(function(){bodyElement.style.animation = 'none';}, 2200);
	setTimeout(function(){effect.classList.add('hidden');}, 2200);
}
 
 function openModal() {
  modal.style.display = "block";
  modalOpen = true; 
  loadall();
}

function closeModal() {
  modal.style.display = "none";
  modalOpen = false; 
}

function moveButton(direction) {
    const floatingButton = document.getElementById("floating-button");
    if (direction === "up") {
	    floatingButton.classList.toggle('moved');
        document.getElementById("cheat-up").hidden = true;
        document.getElementById("cheat-down").hidden = false;
    } else if (direction === "down") {
	    floatingButton.classList.toggle('moved');
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
	var inputcategory = document.getElementById(category);
	var modalInputs = document.createElement('div');
	modalInputs.style.paddingBottom = '5px';
	for (var i = 0; i < inputs.length; i++) {
	  if (inputs[i] === "input") {
		var input = '<input id="' + ids[i] + '" style="width: 90px;" autocomplete="off">';
	  } else if (inputs[i] === "textarea") {
		var input = '<textarea id="' + ids[i] + '" style="width: 90px;"></textarea>';
	  } else if (inputs[i] === "select") {
		var input = '<select id="' + ids[i] + '">';
		for (var j = 0; j < textInputs[i].length; j++) {
		  input += '<option value="' + textInputs[i][j] + '">' + textInputs[i][j] + '</option>';
		}
		input += '</select>';
	  } else if (inputs[i] === "button") {
		var input = '<a role="link" id="' + ids[i] + '">' + textInputs[i] + '</a>';
	  } else if (inputs[i] === "radio") {
		  var input='';
		for (var j = 0; j < textInputs[i].length; j++) {
		   input += '<input type="radio" id="' + ids[i] +j+ '" name="' + ids[i] + '" value="' + textInputs[i][j] + '"/><label for="' + ids[i] +j+ '" style="margin-right: 10px;">' + textInputs[i][j] + '</label>';
		}
	  } else if (inputs[i] === "header") {
		  input = '<span class="gold">'+textInputs[i]+'</span>';
	  } else if (inputs[i] === "newline") {
		  input = '<br>';
	  } else if (inputs[i] === "text") {
		  input = textInputs[i];
	  } else if (inputs[i]=== "range"){
		  input = '<input type="range" id="' + ids[i] + '" min="0" max="' + textInputs[i] + '" value="0">';
	  } else if (inputs[i]=== "link"){
		  input = '<a href="'+ids[i]+'" target="_blank">' + textInputs[i] + '</a>';
	  } else if (inputs[i]==="tooltip") {
		  input = '<mouse class="tooltip-small linkBlue" id="'+ids[i]+'">(?)<span>' + textInputs[i] + '</span></mouse>';
	  } else if (inputs[i]==="checkbox") {
		  input = '<input id="'+ids[i]+'" type="checkbox" style="color: var(--500);">'+ textInputs[i];
	  }
	  
	  if (inputs.length > 1 &&  i < inputs.length-1) input += " | ";
	  modalInputs.innerHTML += input;
	}
	inputcategory.appendChild(modalInputs);
}

function hideAllContent() {
	quicklink.classList.remove("gold");
	statlink.classList.remove("gold");
	misclink.classList.remove("gold");
	quickcontent.classList.remove("active");
	statscontent.classList.remove("active");
	misccontent.classList.remove("active");
}