//init
function initStorage(){
	if (!SugarCube.State.variables.cheatPlus) SugarCube.State.variables.cheatPlus={};
	if (!SugarCube.State.variables.cheatPlus.angel) SugarCube.State.variables.cheatPlus.angel="";
	if (!SugarCube.State.variables.cheatPlus.toggles) SugarCube.State.variables.cheatPlus.toggles={};
	if (!SugarCube.State.variables.cheatPlus.storedNPCs) SugarCube.State.variables.cheatPlus.storedNPCs={};
	if (!SugarCube.State.variables.cheatPlus.storedNPCsDate) SugarCube.State.variables.cheatPlus.storedNPCsDate=0;
}
initStorage();

//functions
function reactivateToggles() {
	var tmp=Object.assign({}, SugarCube.State.variables.cheatPlus.toggles);
	deactiveAllToggles();
	for (const key3 in tmp) {
		if (typeof(tmp[key3]) != "undefined")
			buttonActions[key3]();
	}
}

function deactiveAllToggles(){
	for (const key1 in functionbundle) {
		if (functionbundle.hasOwnProperty(key1) && typeof functionbundle[key1] === 'function') {
			buttonActions[key1]();
		}
	}
	for (const key2 in dailyfunctionbundle) {
		if (dailyfunctionbundle.hasOwnProperty(key2) && typeof dailyfunctionbundle[key2] === 'function') {
			buttonActions[key2]();
		}
	}
}
reactivateToggles();