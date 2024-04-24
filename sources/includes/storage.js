//init
if (!SugarCube.State.variables.cheatPlus.angel) SugarCube.State.variables.cheatPlus.angel="";
if (!SugarCube.State.variables.cheatPlus.toggles) SugarCube.State.variables.cheatPlus.toggles={};

//functions
function reactivateToggles() {
	if (SugarCube.State.variables.cheatPlus.toggles) {
		var tmp=Object.assign({}, SugarCube.State.variables.cheatPlus.toggles);
		deactiveAllToggles();
		for (const key3 in tmp) {
			if (typeof(tmp[key3]) != "undefined")
				buttonActions[key3]();
		}
	} else {
		showToast('all toggle deactivated!');
		deactiveAllToggles();
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