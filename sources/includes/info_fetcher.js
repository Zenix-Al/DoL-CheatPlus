var firstload = {
	//main function
	update_toggle: function(){
		for (const id in functionbundle) {
			if (functionbundle.hasOwnProperty(id) && typeof functionbundle[id] === 'function') {
				const button = document.getElementById(id);
				button.innerHTML +="&#10003;";
			}
		}
		for (const id in dailyfunctionbundle) {
			if (dailyfunctionbundle.hasOwnProperty(id) && typeof dailyfunctionbundle[id] === 'function') {
				const button = document.getElementById(id);
				button.innerHTML +="&#10003;";
			}
		}
	},
	//cheats function
	statpick: function(){
		var selectedValue = document.getElementById("statpick").value;
		var input = document.getElementById("statinput");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	statpicke: function(){
		var selectedValue = document.getElementById("statpicke").value;
		var input = document.getElementById("statinpute");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	spraystate: function(){
		const button = document.getElementById('sprayset');
		if (SugarCube.State.variables.infinitespray==1){
			button.innerHTML="unset";
		} else button.innerHTML="set";
	},
	bodycurrent: function(){
		const button = document.getElementById('bodycurrent');
		if (SugarCube.State.variables.bodysize==0){
			button.innerHTML="Tiny";
		} else if (SugarCube.State.variables.bodysize==1){
			button.innerHTML="Small";
		} else if (SugarCube.State.variables.bodysize==2){
			button.innerHTML="Normal";
		} else if (SugarCube.State.variables.bodysize==3){
			button.innerHTML="Large";
		}
	}, 
	bodytypecurrent: function(){
		const button = document.getElementById('bodytypecurrent');
		if (SugarCube.State.variables.player.gender_body=='m'){
			button.innerHTML='Masculine';
		} else if (SugarCube.State.variables.player.gender_body=='f'){
			button.innerHTML="Feminine";
		} else if (SugarCube.State.variables.player.gender_body=='a'){
			button.innerHTML="Androgynous";
		}
	},
	ballscurrent: function(){
		const button = document.getElementById('ballsset');
		if (SugarCube.State.variables.player.ballsExist==true) {
			button.innerHTML="remove";
		} else button.innerHTML="add";
	},
	virginitycurrent: function(){
		const virginitypick=document.getElementById("virginitypick").value;
		const button = document.getElementById('virginitycurrent');
		if (SugarCube.State.variables.player.virginity[virginitypick]==true) {
			button.innerHTML="pure";
		} else button.innerHTML="Taken";
	}, 
	crimecurrent: function(){
		var total=0;
		for (var key in SugarCube.State.variables.crime) {
		  if (key !== "events") total+=SugarCube.State.variables.crime[key].current;
		}
		const button = document.getElementById('crimecurrent');
		button.innerHTML=total;
	}, 
	vowcurrent: function(){
		const button = document.getElementById('vow-virgin');
		if (SugarCube.State.variables.player.virginity.temple==true){
		  button.innerHTML="Virgin";
	    } else button.innerHTML="Not Virgin";
	}, 
	characurrent: function(){
		var selectedValue = document.getElementById("charapick").value;
		var input = document.getElementById("charainput");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	}, 
	lactatingcurrent: function(){
		const button = document.getElementById('lactatingset');
		if (SugarCube.State.variables.lactating==1){
		  button.innerHTML="Yes";
	    } else button.innerHTML="Not";
	},
	milkcurrent: function(){
		var input = document.getElementById("milkinput");
		input.value=SugarCube.State.variables.milk_volume;
	}, 
	cumcurrent: function(){
		var input = document.getElementById("cuminput");
		input.value=SugarCube.State.variables.semen_volume;
	}, 
	famecurrent: function(){
		var selectedValue = document.getElementById("fame_name").value;
		var input = document.getElementById("input_fame12");
		var value = SugarCube.State.variables.fame[selectedValue];
		input.value=value;
	}, 
	npccurrent: function(){
		const cmbBox = document.getElementById("npcnames").value;
	    const cmbBox2 = document.getElementById("npctraits").value;
	    const input = document.getElementById("npcchangeinput");
		for (let i = 0; i < npcnamelist.length; i++) {
		  if (SugarCube.State.variables.NPCName[i].description === cmbBox) {
			var value=SugarCube.State.variables.NPCName[i][cmbBox2];
			input.value=value;
			break;
		  }
		}
	},
	examcurrent: function(){
		var selectedValue = document.getElementById("select_exam").value;
		var input = document.getElementById("input_exam");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	talentcurrent: function(){
		var selectedValue = document.getElementById("select_talent").value;
		var input = document.getElementById("input_talent");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	arousalpicked: function(){
		var button = document.getElementById("arousal_preview");
		var value = document.getElementById("arousal_val").value;
		button.innerHTML=value + "%";
	},
	update_pregnancy: function(){
		var button1 = document.getElementById("pc_pregnancy");
		var button2 = document.getElementById("npc_pregnancy");
		var value1 = mycode.pc_pregnant;
		var value2 = mycode.total_npc_pregnant;
		button1.innerHTML="MC = " + value1;
		button2.innerHTML="NPC = " + value2;
	},
	update_school_rep: function(){
		var selected = document.getElementById("select_school_rep").value;
	    document.getElementById("input_school_rep").value=SugarCube.State.variables[selected];
	},
	update_pregnancy_list_named_npc: function(){
		const selectElement = document.getElementById("named_npc_pregnancy_manager");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		// Add new options
		var fetuses=SugarCube.State.variables.sexStats.vagina.pregnancy.fetus;
		for (var i=0;i<SugarCube.State.variables.NPCName.length;i++){
			if (SugarCube.State.variables.NPCName[i].pregnancy.timer!=null) {
				const option = document.createElement("option");
				option.value = i;
				option.text = SugarCube.State.variables.NPCName[i].description;
				selectElement.appendChild(option);
			}
		}
	},
	update_pregnancy_day_named_npc: function(){
		const selectElement = document.getElementById("named_npc_pregnancy_manager").value;
		const named_npc_pregnancy_toggle = document.getElementById("named_npc_pregnancy_toggle").value;
		if (!selectElement) return;
		document.getElementById("named_npc_pregnancy_input").value=(SugarCube.State.variables.NPCName[selectElement].pregnancy.timerEnd-SugarCube.State.variables.NPCName[selectElement].pregnancy.timer)/3;
		var isExist=mycode.named_npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (isExist!==-1) {
			named_npc_pregnancy_toggle.checked=true;
		} else {
			named_npc_pregnancy_toggle.checked=false;
		}
	},
	update_pregnancy_list_npc: function(){
		const selectElement = document.getElementById("npc_pregnancy_manager");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		// Add new options
		for (var key in SugarCube.State.variables.storedNPCs){
			const option = document.createElement("option");
			option.value = key;
			option.text = SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother;
			selectElement.appendChild(option);
		}
	},
	update_pregnancy_day_npc: function(){
		const selectElement = document.getElementById("npc_pregnancy_manager").value;
		let npc_pregnancy_toggle = document.getElementById("npc_pregnancy_toggle");
		if (!selectElement) return;
		document.getElementById("npc_pregnancy_input").value=(SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timerEnd-SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timer)/3;
		var isExist=mycode.npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (isExist!==-1) {
			npc_pregnancy_toggle.checked=true;
		} else {
			npc_pregnancy_toggle.checked=false;
		}
	},
	update_pregnancy_list_mc: function(){
		var selectElement = document.getElementById("mc_pregnancy_manager");
		var selectHole = document.getElementById("mc_pregnancy_hole").value;
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		if (SugarCube.State.variables.sexStats[selectHole].pregnancy.type=="parasite") {
			for (var key in SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus){
				const option = document.createElement("option");
				option.value = key;
				option.text = SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[key].creature;
				selectElement.appendChild(option);
			}
		} else if (SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd!=null) {
			const option = document.createElement("option");
			option.value = "baby";
			option.text = "baby";
			selectElement.appendChild(option);
		}
	},
	update_pregnancy_day_mc: function(){
		var selectElement = document.getElementById("mc_pregnancy_manager").value;
		var selectHole = document.getElementById("mc_pregnancy_hole").value;
		var mc_pregnancy_input=document.getElementById("mc_pregnancy_input");
		var mc_pregnancy_toggle=document.getElementById("mc_pregnancy_toggle");
		if (!selectElement) return;
		var pregType=SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
		if (pregType=="parasite") {
			mc_pregnancy_input.value=SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft;
		} else {
			mc_pregnancy_input.value=(SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd-SugarCube.State.variables.sexStats[selectHole].pregnancy.timer)/3;
		}
		var isExist=mycode.mc_pregnancy_locked.findIndex(name => name == selectElement);
		var isExist2= isExist ===-1 ? 0 : (mycode.mc_pregnancy_locked_hole[isExist] != selectHole ? 1 : (mycode.mc_pregnancy_locked_type[isExist] != pregType ? 2 : 3));
		if (isExist2===3) {
			mc_pregnancy_toggle.checked=true;
		} else {
			mc_pregnancy_toggle.checked=false;
		}
	},
	update_mc_tentacle: function(){
		var selectElement = document.getElementById("mc_tentacle_select");
		var selectlocation = document.getElementById("mc_tentacle_location").value;
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
			for (var key in SugarCube.State.variables.container[selectlocation].creatures){
				if (SugarCube.State.variables.container[selectlocation].creatures[key]!=null) {
					const option = document.createElement("option");
					option.value = key;
					option.text = SugarCube.State.variables.container[selectlocation].creatures[key].creature;
					selectElement.appendChild(option);
				}
			}
		firstload.update_mc_tentacle_input();
	},
	update_mc_tentacle_input: function(){
		var selectElement = document.getElementById("mc_tentacle_select").value;
		var selectlocation = document.getElementById("mc_tentacle_location").value;
		if (!selectElement) return;
		document.getElementById("mc_tentacle_input").value=SugarCube.State.variables.container[selectlocation].creatures[selectElement].stats.speed;
	},
	update_mc_baby_info: function(){
		var selectElement = document.getElementById("mc_baby_select").value;
		var selectAction = document.getElementById("mc_baby_action_select").value;
		var mc_baby_input = document.getElementById("mc_baby_input");
		if (!SugarCube.State.variables.children[selectElement]) return;
		const spanElement = document.getElementById("mc_baby_tooltip").querySelector("span");
		spanElement.textContent = "Name:"+SugarCube.State.variables.children[selectElement].name+", father:"+SugarCube.State.variables.children[selectElement].father+", mother:"+SugarCube.State.variables.children[selectElement].mother+", location:"+SugarCube.State.variables.children[selectElement].birthLocation;
		if (selectAction=="name") {
			mc_baby_input.type="";
			mc_baby_input.value=SugarCube.State.variables.children[selectElement][selectAction];
		} else {
			mc_baby_input.value="";
			mc_baby_input.type="checkbox";
			mc_baby_input.checked= SugarCube.State.variables.children[selectElement][selectAction]===true ? true : false;
		}
	},
	update_mc_baby_list_options:0,
	update_mc_baby_list: function(){
		var selectElement = document.getElementById("mc_baby_select");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		for (var key in SugarCube.State.variables.children) {
			const option = document.createElement("option");
			option.value = key;
			option.text = key;
			selectElement.appendChild(option);
		}
		firstload.update_mc_baby_info();
		if (firstload.update_mc_baby_list_options===0) {
			firstload.update_mc_baby_list_options=1;
			document.getElementById("mc_baby_input").style=""
			selectElement = document.getElementById("mc_baby_action_select");
			while (selectElement.firstChild) {
				selectElement.removeChild(selectElement.firstChild);
			}
			for (var key in babyOptions) {
				const option = document.createElement("option");
				option.value = babyOptions[key];
				option.text = babyOptionsText[key];
				selectElement.appendChild(option);
			}
		}
	},
	update_mc_baby_list: function(){
		var selectElement = document.getElementById("mc_baby_select");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		for (var key in SugarCube.State.variables.children) {
			const option = document.createElement("option");
			option.value = key;
			option.text = key;
			selectElement.appendChild(option);
		}
		firstload.update_mc_baby_info();
		if (firstload.update_mc_baby_list_options===0) {
			firstload.update_mc_baby_list_options=1;
			document.getElementById("mc_baby_input").style=""
			selectElement = document.getElementById("mc_baby_action_select");
			while (selectElement.firstChild) {
				selectElement.removeChild(selectElement.firstChild);
			}
			for (var key in babyOptions) {
				const option = document.createElement("option");
				option.value = babyOptions[key];
				option.text = babyOptionsText[key];
				selectElement.appendChild(option);
			}
		}
	},
	update_mc_abortion_list: function(){
		var locations = document.getElementById("mc_abortion_location").value;
		var abortionSelect = document.getElementById("mc_abortion_select");
		var totalFetus=SugarCube.State.variables.sexStats[locations].pregnancy.fetus.length;
		while (abortionSelect.firstChild) {
			abortionSelect.removeChild(abortionSelect.firstChild);
		}
		for (var i=0; i<totalFetus; i++) {
			const option = document.createElement("option");
			option.value = i;
			option.text = i;
			abortionSelect.appendChild(option);
		}
	},
	update_named_npc_abortion_list: function(){
		var npcSelect = document.getElementById("named_npc_abortion_chara_select").value;
		var abortionSelect = document.getElementById("named_npc_abortion_select");
		for (let i = 0; i < npcnamelist.length; i++) {
		  if (SugarCube.State.variables.NPCName[i].description === npcSelect) { 
		  var totalFetus=0;
			  if (typeof(SugarCube.State.variables.NPCName[i].pregnancy.fetus)==='object') totalFetus=SugarCube.State.variables.NPCName[i].pregnancy.fetus.length;
		  }
		}
		
		while (abortionSelect.firstChild) {
			abortionSelect.removeChild(abortionSelect.firstChild);
		}
			
		for (var i=0; i<totalFetus; i++) {
			const option = document.createElement("option");
			option.value = i;
			option.text = i;
			abortionSelect.appendChild(option);
		}
	},
	update_npc_abortion_list: function(){
		if (!typeof(SugarCube.State.variables.storedNPCs.pregnancy_0)==='object') return false;
		var abortionCharaSelect = document.getElementById("npc_abortion_chara_select");
		while (abortionCharaSelect.firstChild) {
			abortionCharaSelect.removeChild(abortionCharaSelect.firstChild);
		}
		var number=1;
		for (var key in SugarCube.State.variables.storedNPCs) {
			const option = document.createElement("option");
			option.value = key;
			option.text = number+". "+SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother;
			abortionCharaSelect.appendChild(option);
			number++;
		}
	},
	update_npc_fetus_abortion_list: function(){
		if (typeof(SugarCube.State.variables.storedNPCs.pregnancy_0)!=='object') return false;
		var abortionSelect = document.getElementById("npc_abortion_select");
		var abortionCharaSelect = document.getElementById("npc_abortion_chara_select").value;
		var totalFetus=0;
		if (typeof(SugarCube.State.variables.storedNPCs[abortionCharaSelect].pregnancy.fetus)==='object') totalFetus = SugarCube.State.variables.storedNPCs[abortionCharaSelect].pregnancy.fetus.length;
		while (abortionSelect.firstChild) {
			abortionSelect.removeChild(abortionSelect.firstChild);
		}
		for (var i=0; i<totalFetus; i++) {
			const option = document.createElement("option");
			option.value = i;
			option.text = i;
			abortionSelect.appendChild(option);
		}
	},
	update_cheat_state: function() {
		var button=document.getElementById("in_game_cheat");
		if (SugarCube.State.variables.debug===1 && button.innerHTML==="Enable") mycode.in_game_cheat();
		if (SugarCube.State.variables.debug===0 && button.innerHTML==="Disable") mycode.in_game_cheat();
	},
	update_farm_assault_day: function() {
		if (SugarCube.State.variables.farm_attack_timer)
			document.getElementById("assault_time").value=SugarCube.State.variables.farm_attack_timer;
	},
	update_farm_buildtime: function() {
		if (SugarCube.State.variables.farm.build_timer)
			document.getElementById("build_time").value=SugarCube.State.variables.farm.build_timer;
	},
	update_farm_animals_like: function() {
		if (SugarCube.State.variables.farm) {
			var animal=document.getElementById("animal_choice").value;
			document.getElementById("animal_input").value=SugarCube.State.variables.farm.beasts[animal];
		}
	},
	update_array_checker: function(){
		const button = document.getElementById("auto_check_status");
		if (SugarCube.State.variables.cheatPlus.arrayCheck) {
			button.innerHTML="found";
		} else {
			button.innerHTML="not found";
		}
	}
}

var alt_fetch= {
	update_pregnancy_mc: function(){
		firstload.update_pregnancy_list_mc();
	    firstload.update_pregnancy_day_mc();
	}
}

function loadall() {
	if (SugarCube.State.variables.passage=='Start') return;
	document.getElementById("moneyinput").value=SugarCube.State.variables.money;
	var interval=1;
	isFetching=true;
	totalFetchFunction=0;
	currentFetch=0;
	for (const functionName in firstload) {
		if (typeof firstload[functionName] === 'function') {
			setTimeout(function() {
				firstload[functionName]();
				currentFetch++;
			}, interval);
			totalFetchFunction++;
			interval+=1;
		}
	}
}

