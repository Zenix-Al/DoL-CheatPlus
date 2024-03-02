mycode = { ...mycode,
//quick cheat
  arousal_player: function(){
	showToast('Activated!');
	var value = document.getElementById("arousal_val").value;
	SugarCube.State.variables.arousal = parseInt(10000*value/100);
  },
  arousal_enemy: function(){
	showToast('Activated!');
	var value = document.getElementById("arousal_val").value;
	const arousal = SugarCube.State.variables.enemyarousalmax;
	SugarCube.State.variables.enemyarousal = parseInt(arousal*value/100);
  },
  aezakmi: function() {
	showToast('Activated!');
	var totalKeys=0;
	var total=0
    for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			total+=SugarCube.State.variables.crime[key].current;
			totalKeys++;
		}
	}
	
	total=parseInt((total-100)/totalKeys);
	
	for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			SugarCube.State.variables.crime[key].current=total;
		}
	}
	firstload.crimecurrent();
  }, 
  imdonefor: function() {
	showToast('Activated!');
	var totalKeys=0;
	var total=0
    for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			total+=SugarCube.State.variables.crime[key].current;
			totalKeys++;
		}
	}
	total=parseInt((total+100)/totalKeys);
	for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			SugarCube.State.variables.crime[key].current=total;
		}
	}
	firstload.crimecurrent();
  }, 
	imvirgintemple: function() {
	  showToast('Activated!');
	  if (SugarCube.State.variables.player.virginity.temple==true){
		  SugarCube.State.variables.player.virginity.temple=false;
	  } else SugarCube.State.variables.player.virginity.temple=true;
	  firstload.vowcurrent();
	},
	ArrayChecker: function(){
		function processValue(value, newPath) {
		  if (Array.isArray(value) && value.length==0) {
			  var check=Object.keys(value);
			  if (check.length>0) {
				textBox.value=textBox.value+newPath+"=convertStringIndexArrayToObject("+newPath+");";
				logBrokenArrayValues(value, newPath);
			  }
			} else if (Array.isArray(value) ) {
				logArrayValues(value, newPath);
			} else if (typeof value === 'object' && value !== null) {
				logObjectValues(value, newPath);
			}
		}
		function logObjectValues(obj, curPath) {
		  for (const key in obj) {
			const value = obj[key];
			const newPath = curPath+"."+key;
			processValue(value, newPath);
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
			  }
		}
		var textBoxId=document.getElementById("tmpText");
		textBoxId.value=""
		var textBox=document.querySelector(".tmpText");
		logObjectValues(SugarCube.State.variables, "SugarCube.State.variables");
		textBox.focus();
		textBox.select();
		try {
		  var successful = document.execCommand('copy');
		  var msg = successful ? 'successful' : 'unsuccessful';
			showToast('Copying text command was ' + msg);
		} catch (err) {
			showToast('Oops, unable to copy');
		}
		
	},
	//stats
	hesoyam: function() {
		showToast('Activated!');
		SugarCube.State.variables.pain=0;
		SugarCube.State.variables.arousal=0;
		SugarCube.State.variables.tiredness=0;
		SugarCube.State.variables.stress=0;
		SugarCube.State.variables.trauma=0;
		SugarCube.State.variables.control=1000;
		SugarCube.State.variables.drunk=0;
		SugarCube.State.variables.drugged=0;
		SugarCube.State.variables.hallucinogen=0;
	  },
	statmanager: function(){
		const statpick=document.getElementById("statpick").value;
		const value=parseFloat(document.getElementById("statinput").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables[statpick]=value;
		}
	  },
	kill_player: function() {
		showToast('Activated!');
		SugarCube.State.variables.pain=200;
		SugarCube.State.variables.arousal=10000;
		SugarCube.State.variables.tiredness=2000;
		SugarCube.State.variables.stress=10000;
		SugarCube.State.variables.trauma=5000;
		SugarCube.State.variables.control=0;
		SugarCube.State.variables.drunk=1000;
		SugarCube.State.variables.drugged=1000;
		SugarCube.State.variables.hallucinogen=1000;
	},
	//enemy stats
	kill_enemy: function() {
		showToast('Activated!');
		SugarCube.State.variables.enemyhealth = 0;
		SugarCube.State.variables.enemytrust = 100;
		SugarCube.State.variables.enemyanger = 0;
	  },
	enemycalm: function() {
	  showToast('Activated!');
		SugarCube.State.variables.enemyhealth = SugarCube.State.variables.enemyhealthmax;
		SugarCube.State.variables.enemytrust=100;
		SugarCube.State.variables.enemyanger=0;
	},
	statmanagere: function(){
		const statpicke=document.getElementById("statpicke").value;
		const value=parseInt(document.getElementById("statinpute").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables[statpicke]=value;
		}
	},
	//player
	moneymanager: function(){
		const input=parseInt(document.getElementById("moneyinput").value);
		if (!isNaN(input)) {
			showToast('Activated!');
			SugarCube.State.variables.money=input;
		}
	},
	bodymanager: function(){
		const bodypick=document.getElementById("bodypick").value;
		if (bodypick=="Tiny"){
			SugarCube.State.variables.bodysize=0;
		} else if (bodypick=="Small"){
			SugarCube.State.variables.bodysize=1;
		} else if (bodypick=="Normal"){
			SugarCube.State.variables.bodysize=2;
		} else if (bodypick=="Large"){
			SugarCube.State.variables.bodysize=3;
		}
		showToast('Activated!');
		firstload.bodycurrent();
	},
	bodytypemanager: function(){
		const bodytypepick=document.getElementById("bodytypepick").value;
		if (bodytypepick=='Masculine'){
			SugarCube.State.variables.player.gender_body='m';
		} else if (bodytypepick=='Feminine'){
			SugarCube.State.variables.player.gender_body="f";
		} else if (bodytypepick=='Androgynous'){
			SugarCube.State.variables.player.gender_body="a";
		}
		showToast('Activated!');
		firstload.bodytypecurrent();
	},
	sprayunlimited: function(){
		if (SugarCube.State.variables.infinitespray==1) {
			SugarCube.State.variables.infinitespray=0;
		} else SugarCube.State.variables.infinitespray=1;
		showToast('Activated!');
		firstload.spraystate();
	},
	ballsmanager: function(){
		if (SugarCube.State.variables.player.ballsExist==true) {
			SugarCube.State.variables.player.ballsExist=false;
		} else SugarCube.State.variables.player.ballsExist=true;
		showToast('Activated!');
		firstload.ballscurrent();
	},
	virginitymanager: function(){
		const virginitypick=document.getElementById("virginitypick").value;
		SugarCube.State.variables.player.virginity[virginitypick]=true;
		firstload.virginitycurrent();
		showToast('Activated!');
	},
	virginitypure: function(){
		const virginitypick=document.getElementById("virginitypick");
		var options = virginitypick.getElementsByTagName("option");
		for (var i = 0; i < options.length; i++) {
			var option = options[i].value;
			SugarCube.State.variables.player.virginity[option]=true;
		}
		firstload.virginitycurrent();
		showToast('Activated!');
	},
	charamanager: function(){
		const statpick=document.getElementById("charapick").value;
		const value=parseInt(document.getElementById("charainput").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables[statpick]=value;
		}
	},
	lactatingmanager: function(){
		if (SugarCube.State.variables.lactating==1) {
			SugarCube.State.variables.lactating=0;
		} else SugarCube.State.variables.lactating=1;
		firstload.lactatingcurrent();
		showToast('Activated!');
	},
	cummanager: function(){
		const value=parseInt(document.getElementById("cuminput").value);
		if (!isNaN(value)) {
			if (value>3000) value=3000
			showToast('Activated!');
			SugarCube.State.semen_volume=value;
			firstload.cumcurrent();
		}
	},
	milkmanager: function(){
		const value=parseInt(document.getElementById("milkinput").value);
		if (!isNaN(value)) {
			if (value>3000) value=3000
			showToast('Activated!');
			SugarCube.State.milk_volume=value;
			firstload.milkcurrent();
		}
	},
	cumfill: function(){
		SugarCube.State.semen_amount=SugarCube.State.semen_volume;
		showToast('Activated!');
	},
	milkfill: function(){
		SugarCube.State.milk_amount=SugarCube.State.milk_volume;
		showToast('Activated!');
	},
	infect: function(){
		showToast('Activated!');
	  const parasite = document.getElementById("parasitename").value;
	  const body = document.getElementById("bodyparts").value;
	  SugarCube.State.variables.parasite[parasite].push(body);
	  SugarCube.State.variables.parasite[body]["name"]=parasite;
	},
	desinfect: function(){
		showToast('Activated!');
		const parasite = document.getElementById("parasitename").value;
		const body = document.getElementById("bodyparts").value;
		SugarCube.State.variables.parasite[body]=[];
		SugarCube.State.variables.parasite[parasite] = SugarCube.State.variables.parasite[parasite].filter(item => item !== body);
	},
	changetraitbro: function(){
	  const cmbBox = document.getElementById("npcnames").value;
	  const cmbBox2 = document.getElementById("npctraits").value;
	  const value = parseInt(document.getElementById("npcchangeinput").value);
		if (!isNaN(value)) {
			for (let i = 0; i < npcnamelist.length; i++) {
			  if (SugarCube.State.variables.NPCName[i].description === cmbBox) {
				SugarCube.State.variables.NPCName[i][cmbBox2] = value;
				showToast('Activated!');
				break;
			  }
			}
		}
	},
	  set_fame12: function(){
		  showToast('Activated!');
		  var selected = document.getElementById("fame_name").value;
		  var input = parseInt(document.getElementById("input_fame12").value);
		  SugarCube.State.variables.fame[selected]=input;
	  },
	  exammanager: function(){
		showToast('Activated!');
		  var selected = document.getElementById("select_exam").value;
		  var input = parseInt(document.getElementById("input_exam").value);
		  SugarCube.State.variables[selected]=input;
	  },
		talentmanager: function(){
		showToast('Activated!');
		  var selected = document.getElementById("select_talent").value;
		  var input = parseInt(document.getElementById("input_talent").value);
		  SugarCube.State.variables[selected]=input;
	  },
	//misc
	VrelCoinsUsage: function(){
		  showToast('Activated!');
		  SugarCube.State.variables.featsBoosts.pointsUsed=0
	  },
	executeSearch: function(action) {
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
	},
	set_animal_like: function(){
		const animal=document.getElementById("animal_choice").value;
		const value=parseInt(document.getElementById("animal_input").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.farm.beasts[animal]=value;
		}
	},
	set_build_time: function(){
		const value=parseInt(document.getElementById("build_time").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.farm.build_timer=value;
		}
	},
	set_assault_time: function(){
		const value=parseInt(document.getElementById("assault_time").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.farm_attack_timer=value;
		}
	},
	clean_cum: function(){
		for (var key in SugarCube.State.variables.player.bodyliquid){
			for (var key2 in SugarCube.State.variables.player.bodyliquid[key]){
				SugarCube.State.variables.player.bodyliquid[key][key2]=0;
			}
		}
		showToast('Activated!');
	},
	funny_fruits: ['cabbage', 'wild_carrot', 'turnip', 'potato', 'onion', 'garlic_bulb', 'broccoli'],
	check_fruit_selling: function(){
		var total_funny_fruits={};
		var placeholder="";
		var they_selling=SugarCube.State.variables.farmersProduce.selling;
		for (const fruit of mycode.funny_fruits) 
			if (fruit in SugarCube.State.variables.farmersProduce.selling) {
				total_funny_fruits={...total_funny_fruits, [fruit]: they_selling[fruit]};
			} else {
				total_funny_fruits={...total_funny_fruits, [fruit]: 0};
			}
		var tmp_total_funny_fruits= Object.entries(total_funny_fruits);
		tmp_total_funny_fruits.sort((a, b) => b[1] - a[1]); 
		
		for (const key in tmp_total_funny_fruits) {
			placeholder+=(parseInt(key)+1)+". "+tmp_total_funny_fruits[key][0]+":"+tmp_total_funny_fruits[key][1]+" | ";
		}
		document.getElementById("placeholder_fruits").innerHTML=placeholder;
	},
	set_school_rep: function(){
		showToast('Activated!');
		var selected = document.getElementById("select_school_rep").value;
		  var input = parseInt(document.getElementById("input_school_rep").value);
		  SugarCube.State.variables[selected]=input;
	},
	performance_quick_inyohead: 0,
	performance_quick: function(){
		var selected = document.getElementById("performance_quick").value;
		var toggle=document.getElementById("active_performance_quick").checked;
		var info_performance_quick=document.getElementById("info_performance_quick");
		if (toggle===true && this.performance_quick_inyohead>0 && !this.toggleActive["performance_quick"]) {
		  functionbundle["performance_quick"]=mycode["performance_quick"].bind(mycode);
		  this.toggleActive["performance_quick"]=true;
		} else if (this.toggleActive["performance_quick"]) {
			functionbundle["performance_quick"]=undefined;
			this.toggleActive["performance_quick"]=undefined;
		}
		if (this.performance_quick_inyohead>0) this.performance_quick_inyohead--;
		if (selected==0){
			info_performance_quick.innerHTML="Beautiful";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=true;
			SugarCube.State.variables.options.sidebarAnimations=true;
			SugarCube.State.variables.options.combatAnimations=true;
			SugarCube.State.variables.options.images=1;
		} else if (selected==1){
			info_performance_quick.innerHTML="good";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=true;
			SugarCube.State.variables.options.combatAnimations=true;
			SugarCube.State.variables.options.images=1;
		} else if (selected==2){
			info_performance_quick.innerHTML="Fast";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=false;
			SugarCube.State.variables.options.combatAnimations=true;
			SugarCube.State.variables.options.images=1;
		} else if (selected==3){
			info_performance_quick.innerHTML="Lite";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=false;
			SugarCube.State.variables.options.combatAnimations=false;
			SugarCube.State.variables.options.images=1;
		} else if (selected==4){
			info_performance_quick.innerHTML="No Image";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=false;
			SugarCube.State.variables.options.combatAnimations=false;
			SugarCube.State.variables.options.images=0;
			
		}
	},
	named_npc_pregnancy_locked: [],
	named_npc_pregnancy_locked_day: [],
	named_npc_pregnancy_set: function(){
		var selectElement = document.getElementById("named_npc_pregnancy_manager").value;
		var input = parseInt(document.getElementById("named_npc_pregnancy_input").value);
		var toggle=document.getElementById("named_npc_pregnancy_toggle").checked;
		if (!selectElement || !input) return;
		var isExist=mycode.named_npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (toggle===true && isExist===-1) {
			mycode.named_npc_pregnancy_locked.push(selectElement);
			mycode.named_npc_pregnancy_locked_day.push(input);
			functionbundle["named_npc_pregnancy_manager_toggle"]=mycode["named_npc_pregnancy_manager_toggle"].bind(mycode);
			mycode.toggleActive["named_npc_pregnancy_manager_toggle"]=true;
		} else if (isExist!==-1 && toggle===false) {
			mycode.named_npc_pregnancy_locked.splice(isExist,1);
			mycode.named_npc_pregnancy_locked_day.splice(isExist,1);
			functionbundle["named_npc_pregnancy_manager_toggle"]=undefined;
			mycode.toggleActive["named_npc_pregnancy_manager_toggle"]=undefined;
		}
		var timeEnd=SugarCube.State.variables.NPCName[selectElement].pregnancy.timerEnd;
		var time=timeEnd-(input*3);
		if (time<0) time=0;
		SugarCube.State.variables.NPCName[selectElement].pregnancy.timer=time;
		showToast('Activated!');
	},
	npc_pregnancy_locked: [],
	npc_pregnancy_locked_day: [],
	npc_pregnancy_set: function(){
		var selectElement = document.getElementById("npc_pregnancy_manager").value;
		var input = parseInt(document.getElementById("npc_pregnancy_input").value);
		var toggle=document.getElementById("npc_pregnancy_toggle").checked;
		if (!selectElement || !input) return;
		var isExist=mycode.npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (toggle===true && isExist===-1) {
			mycode.npc_pregnancy_locked.push(selectElement);
			mycode.npc_pregnancy_locked_day.push(input);
			functionbundle["npc_pregnancy_manager_toggle"]=mycode["npc_pregnancy_manager_toggle"].bind(mycode);
			mycode.toggleActive["npc_pregnancy_manager_toggle"]=true;
		} else if (isExist!==-1 && toggle===false) {
			mycode.npc_pregnancy_locked.splice(isExist,1);
			mycode.npc_pregnancy_locked_day.splice(isExist,1);
			functionbundle["npc_pregnancy_manager_toggle"]=undefined;
			mycode.toggleActive["npc_pregnancy_manager_toggle"]=undefined;
		}
		var timeEnd=SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timerEnd;
		var time=timeEnd-(input*3);
		if (time<0) time=0;
		SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timer=time;
		showToast('Activated!');
	},
	mc_pregnancy_locked: [],
	mc_pregnancy_locked_hole: [],
	mc_pregnancy_locked_type: [],
	mc_pregnancy_locked_day: [],
	mc_pregnancy_set: function(){
		var selectElement = document.getElementById("mc_pregnancy_manager").value;
		var selectHole = document.getElementById("mc_pregnancy_hole").value;
		var input = parseInt(document.getElementById("mc_pregnancy_input").value);
		var toggle=document.getElementById("mc_pregnancy_toggle").checked;
		if (!selectElement || !input) return;
		var pregType = SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
		var isExist=mycode.mc_pregnancy_locked.findIndex(name => name == selectElement);
		var isExist2= isExist ===-1 ? 0 : (mycode.mc_pregnancy_locked_hole[isExist] != selectHole ? 1 : (mycode.mc_pregnancy_locked_type[isExist] != pregType ? 2 : 3));
		if (toggle===true && isExist2===0) {
			mycode.mc_pregnancy_locked.push(selectElement);
			mycode.mc_pregnancy_locked_hole.push(selectHole);
			mycode.mc_pregnancy_locked_type.push(pregType);
			mycode.mc_pregnancy_locked_day.push(input);
			functionbundle["mc_pregnancy_manager_toggle"]=mycode["mc_pregnancy_manager_toggle"].bind(mycode);
			mycode.toggleActive["mc_pregnancy_manager_toggle"]=true;
		} else if (isExist2!==0 && toggle===false) {
			mycode.mc_pregnancy_locked.splice(isExist,1);
			mycode.mc_pregnancy_locked_hole.splice(isExist,1);
			mycode.mc_pregnancy_locked_type.splice(isExist,1);
			mycode.mc_pregnancy_locked_day.splice(isExist,1);
			functionbundle["mc_pregnancy_manager_toggle"]=undefined;
			mycode.toggleActive["mc_pregnancy_manager_toggle"]=undefined;
		}
		if (pregType=="parasite") {
			SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft=input;
		} else {
			var timeEnd=SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd;
			var time=timeEnd-(input*3);
			if (time<0) time=0;
			SugarCube.State.variables.sexStats[selectHole].pregnancy.timer=time;
		}
		showToast('Activated!');
	},
	  max_Ferocity: function(){
	  SugarCube.State.variables.wolfpackferocity=22;
	  showToast('Activated!');
	  },
	  max_harmony: function(){
		  SugarCube.State.variables.wolfpackharmony=22;
		  showToast('Activated!');
	  },
	  mc_tentacle_set: function(){
		var selectElement = document.getElementById("mc_tentacle_select").value;
		var selectlocation = document.getElementById("mc_tentacle_location").value;
		var input=parseInt(document.getElementById("mc_tentacle_input").value);
		if (!selectElement || !input) return;
		SugarCube.State.variables.container[selectlocation].creatures[selectElement].stats.speed=input;
		showToast('Activated!');
	  },
	  mc_baby_set: function(){
		var selectElement = document.getElementById("mc_baby_select").value;
		var selectAction = document.getElementById("mc_baby_action_select").value;
		var input = document.getElementById("mc_baby_input").type=="checkbox" ? document.getElementById("mc_baby_input").checked : document.getElementById("mc_baby_input").value;
		if (!SugarCube.State.variables.children[selectElement]) return;
		if (selectAction=="abandon") {
			if (input==true) {
				showToast(SugarCube.State.variables.children[selectElement].name+' has been abandoned!');
				delete SugarCube.State.variables.children[selectElement];
				firstload.update_mc_baby_list();
			} else {
				showToast('check the checkbox to confirm');
			}
			return true;
		}
		SugarCube.State.variables.children[selectElement][selectAction]=input;
		showToast('Activated!');
	  },
	  set_hentai_skill: function(){
		showToast('Activated!');
		  var selected = document.getElementById("select_hentai_skill").value;
		  var input = parseInt(document.getElementById("input_hentai_skill").value);
		  SugarCube.State.variables[selected]=input;
	  },
	  Enable_cheat_history: function(){
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
		  
	  },
	  Enable_sidebar_button: function(){
		  var button=document.getElementById("cheat-sidebar");
		  var sidebar_button=document.getElementById("Enable_sidebar_button");
		  if (button.hidden==true){
			  button.hidden=false;
			  sidebar_button.innerHTML="Disable";
		  } else {
			  button.hidden=true;
			  sidebar_button.innerHTML="Enable";
		  }
	  },
	  sidebar_cheat: function() {
		  document.getElementById("ui-bar-toggle").click();
	  },
	  update_history: function() {
		  document.getElementById("cheat-history-backwards").disabled=document.getElementById("history-backward").disabled;
		  document.getElementById("cheat-history-forwards").disabled=document.getElementById("history-forward").disabled;
	  },
	  cheat_backwards: function(){
		  document.getElementById("history-backward").click();
		  mycode.update_history();
	  }, 
	  cheat_forwards: function(){
		  var button=document.getElementById("history-forward").click();
		  mycode.update_history();
	  }, 
	  simple_cheat_button: function() {
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

}