/*var debug;
var isServer;
var cheatVer;
var testedOn;*/
//variables init
//main
var isLoad=false;
var curVer=document.getElementById("gameVersionDisplay2").innerHTML;
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
var downloadSite='https://www.mediafire.com/folder/d6uiwpcm3y0gu/degrees_of_lewdity';
var sourceCode='https://github.com/Zenix-Al/DoL-CheatPlus';
//mycode
var functionbundle = {}; 
var dailyfunctionbundle = {};
var errorFunctions;
var progressFunctions=0;
var totalFunctions=0;
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
var textBox=document.getElementById("tmpText");
var babyOptions = ["motherKnown", "fatherKnown", "name", "abandon"];
var babyOptionsText = ["mother Known", "father Known", "name", "Abandon"];
//storage
if (!SugarCube.State.variables.cheatPlus) SugarCube.State.variables.cheatPlus={};
//endof variable init
if (curVer==testedOn) {
	var isCheatWork="compatible";
	var isCheatWorkSymbol="☑";
} else {
	var isCheatWork="version is different, proceed with caution!";
	var isCheatWorkSymbol="⚠";
}
if (isServer==1) {
	cheatVerType="CheatP Server";
} else {
	cheatVerType="CheatP";
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
  init_interface();
  loadall();
}

function closeModal() {
  modal.style.display = "none";
  modalOpen = false; 
  deleteText();
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

function deleteText(){
	//delete
	var content = document.getElementById("quick-content");
	var childs=content.querySelectorAll("div");
	childs.forEach( number => {
	   number.remove();
	});
	var content = document.getElementById("stats-content");
	var childs=content.querySelectorAll("div");
	childs.forEach( number => {
	   number.remove();
	});
	var content = document.getElementById("misc-content");
	var childs=content.querySelectorAll("div");
	childs.forEach( number => {
	   number.remove();
	});

}
function hideAllContent() {
	quicklink.classList.remove("gold");
	statlink.classList.remove("gold");
	misclink.classList.remove("gold");
	quickcontent.classList.remove("active");
	statscontent.classList.remove("active");
	misccontent.classList.remove("active");
}

function Enable_cheat_history(){
  var button_back=document.getElementById("cheat-history-backwards");
  var button_forward=document.getElementById("cheat-history-forwards");
  var button_set=document.getElementById("Enable_cheat_history");
  if (button_back.hidden==true){
	  button_back.hidden=false;
	  button_forward.hidden=false;
	  button_set.innerHTML="Disable";
	  mycode.update_history();
  } else {
	  button_back.hidden=true;
	  button_forward.hidden=true;
	  button_set.innerHTML="Enable";
  }
  
}

function Enable_sidebar_button(){
  var button=document.getElementById("cheat-sidebar");
  var sidebar_button=document.getElementById("Enable_sidebar_button");
  if (button.hidden==true){
	  button.hidden=false;
	  sidebar_button.innerHTML="Disable";
  } else {
	  button.hidden=true;
	  sidebar_button.innerHTML="Enable";
  }
}

function simple_cheat_button() {
  var cheat_button=document.getElementById("cheat-open");
  var simple_cheat_button=document.getElementById("simple_cheat_button");
  if (simple_cheat_button.innerHTML=="Disable") {
	  simple_cheat_button.innerHTML="Enable";
	  cheat_button.innerHTML="Cheat";
	  cheat_button.style="";
  } else {
	  simple_cheat_button.innerHTML="Disable";
	  cheat_button.innerHTML="⚙";
	  cheat_button.style="font-size: 89%;";
  }
}

function executeSearch(action) {
	console.clear();
	var search_type = document.getElementById("search_type").value;
	var searchTerm = document.getElementById("search_value").value;

	if (search_type === "0") {
		search_type = "startsWith";
	} else if (search_type === "1") {
		search_type = "includes";
	} else if (search_type === "2") {
		search_type = "endsWith";
	}
	if (searchTerm==""){
		showToast('failed, Search key is blank!');
		return;
	}
	function processValue(value, newPath) {
		if (Array.isArray(value) && value.length==0) {
		  var check=Object.keys(value);
		  if (check.length>0) {
			logBrokenArrayValues(value, newPath);
		  }
		} else if (Array.isArray(value) ) {
			logArrayValues(value, newPath);
		} else if (typeof value === 'object') {
			logObjectValues(value, newPath);
		} else if (String(value).toLowerCase()[search_type](searchTerm.toLowerCase()) && String(value)!="") {
			  console.log(newPath + "=" + value);
		}
	}
	
	function checkObject(key, value, newPath){
		if (key.toLowerCase()[search_type](searchTerm.toLowerCase()) && value!="") {
			  console.log(newPath + "=" + value);
		}
	}
	function logObjectValues(obj, curPath) {
	  for (const key in obj) {
		const value = obj[key];
		const newPath = curPath+"."+key;
		processValue(value, newPath);
		checkObject(key, value, newPath);
	  }
	}

	function logArrayValues(obj, curPath){
		for (let i = 0; i < obj.length; i++) {
			const value = obj[i];
			const newPath = curPath+"["+i+"]";
			processValue(value, newPath);
		}
	}

	function logBrokenArrayValues(obj, curPath){
		var check=Object.keys(obj);
		for (const key of check) {
			const value = obj[key];
			const newPath = curPath + "[" + key + "]";
			processValue(value, newPath);
			checkObject(key, value, newPath);
		  }
	}
	
	if (action === "search123") {
		showToast('Searching... might take a while');
		logObjectValues(SugarCube.State.variables, "SugarCube.State.variables");
	} else if (action === "search456") {
		showToast('Searching...');
		for (var prop in SugarCube.State.variables) {
			if (prop.toLowerCase()[search_type](searchTerm.toLowerCase())) {
			  console.log("SugarCube.State.variables." + prop + "=" + SugarCube.State.variables[prop]);
			}
		  }
	}
}