//init
function initStorage(){
	if (!SugarCube.State.variables.cheatPlus) SugarCube.State.variables.cheatPlus={};
	if (!SugarCube.State.variables.cheatPlus.angel) SugarCube.State.variables.cheatPlus.angel="";
	if (!SugarCube.State.variables.cheatPlus.toggles) SugarCube.State.variables.cheatPlus.toggles={};
	if (!SugarCube.State.variables.cheatPlus.storedNPCs) SugarCube.State.variables.cheatPlus.storedNPCs={};
	if (!SugarCube.State.variables.cheatPlus.storedNPCsDate) SugarCube.State.variables.cheatPlus.storedNPCsDate=0;
	if (!SugarCube.State.variables.cheatPlus.orgasmCount) SugarCube.State.variables.cheatPlus.orgasmCount=0;
	if (SugarCube.State.variables.penisstate!=0 || SugarCube.State.variables.vaginastate!=0) return;
		if (SugarCube.State.variables.demon>0) {
			SugarCube.State.variables.cheatPlus.trueDivine="demon";
		} else if (SugarCube.State.variables.angel>0) {
			SugarCube.State.variables.cheatPlus.trueDivine="angel";
		}
}
initStorage();

//functions
function reactivateToggles() {
	reactivatingToggles=true;
	var tmp=Object.assign({}, SugarCube.State.variables.cheatPlus.toggles);
	deactiveAllToggles();
	for (const key3 in tmp) {
		if (typeof(tmp[key3]) != "undefined")
			buttonActions[key3]();
	}
	reactivatingToggles=false;
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