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
			SugarCube.State.variables.crime[key].count=total;
			SugarCube.State.variables.crime[key].countHistory=total;
			SugarCube.State.variables.crime[key].history=total;
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
		var value=parseInt(document.getElementById("cuminput").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.semen_volume=value;
			firstload.cumcurrent();
		}
	},
	milkmanager: function(){
		const value=parseInt(document.getElementById("milkinput").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.milk_volume=value;
			firstload.milkcurrent();
		}
	},
	cumfill: function(){
		SugarCube.State.variables.semen_amount=SugarCube.State.variables.semen_volume;
		showToast('Activated!');
	},
	milkfill: function(){
		SugarCube.State.variables.milk_amount=SugarCube.State.variables.milk_volume;
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
	dirty_cum: function(){
		for (var key in SugarCube.State.variables.player.bodyliquid){
			for (var key2 in SugarCube.State.variables.player.bodyliquid[key]){
				SugarCube.State.variables.player.bodyliquid[key][key2]=100;
			}
		}
		showToast('Activated!');
	},
	clean_cum_uretus: function(){
		SugarCube.State.variables.sexStats.vagina.sperm=[];
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
	  sidebar_cheat: function() {
		  document.getElementById("ui-bar-toggle").click();
	  },
	  cheat_backwards: function(){
		  document.getElementById("history-backward").click();
		  mycode.update_history();
	  }, 
	  cheat_forwards: function(){
		  var button=document.getElementById("history-forward").click();
		  mycode.update_history();
	  }, 
	  abortion_notice: function(){
		  showToast('Aborting...');
		  setTimeout(function(){bloodEffect();}, 1000);
		  setTimeout(function(){showToast('baby is aborted!');}, 3200);
	  },
	  mc_abortion_set: function() {
		  var checkboxes=document.getElementById("mc_abortion_checkbox").checked;
		  if (checkboxes==false) {
			showToast('check the checkbox to confirm');
			return false;
		  }
		  var locations=document.getElementById("mc_abortion_location").value;
		  var selected=document.getElementById("mc_abortion_select").value;
		  var length=SugarCube.State.variables.sexStats[locations].pregnancy.fetus.length;
		  if (length==0) {
			  showToast('No baby!');
			  return false;
		  } else if (length==1) {
			  SugarCube.State.variables.sexStats[locations].pregnancy.fetus=[];
			  SugarCube.State.variables.sexStats[locations].pregnancy.awareOf=null;
			  SugarCube.State.variables.sexStats[locations].pregnancy.awareOfDetails=null;
			  SugarCube.State.variables.sexStats[locations].pregnancy.awareOfMultiple=null;
			  SugarCube.State.variables.sexStats[locations].pregnancy.potentialFathers=[];
			  SugarCube.State.variables.sexStats[locations].pregnancy.timer=0;
			  SugarCube.State.variables.sexStats[locations].pregnancy.timerEnd=null;
			  SugarCube.State.variables.sexStats[locations].pregnancy.type=null;
			  SugarCube.State.variables.sexStats[locations].pregnancy.waterBreaking=false;
			  SugarCube.State.variables.sexStats[locations].pregnancy.waterBreakingTimer=null;
			  if (SugarCube.State.variables.sexStats.anus.pregnancy.fetus[0].stats.gender==="Hermaphrodite") {
				    SugarCube.State.variables.sexStats.anus.pregnancy.motherStatus=1;
			  }
			  mycode.abortion_notice();
		  } else {
			  SugarCube.State.variables.sexStats[locations].pregnancy.fetus.splice(selected, 1);
			  if (SugarCube.State.variables.sexStats.anus.pregnancy.fetus[0].stats.gender==="Hermaphrodite") {
				    SugarCube.State.variables.sexStats.anus.pregnancy.motherStatus=1;
			  }
			  mycode.abortion_notice();
		  }
		  firstload.update_mc_abortion_list();
	  }, 
	  named_npc_abortion_set: function() {
		  var checkboxes=document.getElementById("named_npc_abortion_checkbox").checked;
		  if (checkboxes==false) {
			showToast('check the checkbox to confirm');
			return false;
		  }
		  var selected=document.getElementById("named_npc_abortion_chara_select").value;
		  var fetus=document.getElementById("named_npc_abortion_select").value;
		  for (let i = 0; i < npcnamelist.length; i++) {
			  if (SugarCube.State.variables.NPCName[i].description === selected) { 
			  var totalFetus=0;
			  var selected=i;
				  if (typeof(SugarCube.State.variables.NPCName[i].pregnancy.fetus)==='object') totalFetus=SugarCube.State.variables.NPCName[i].pregnancy.fetus.length;
			  }
			}
		  if (totalFetus==0) {
			  showToast('No baby!');
			  return false;
		  } else if (totalFetus==1) {
			  SugarCube.State.variables.NPCName[selected].pregnancy.fetus=[];
			  SugarCube.State.variables.NPCName[selected].pregnancy.potentialFathers=[];
			  SugarCube.State.variables.NPCName[selected].pregnancy.timer=0;
			  SugarCube.State.variables.NPCName[selected].pregnancy.timerEnd=null;
			  SugarCube.State.variables.NPCName[selected].pregnancy.type=null;
			  SugarCube.State.variables.NPCName[selected].pregnancy.waterBreaking=false;
			  SugarCube.State.variables.NPCName[selected].pregnancy.waterBreakingTimer=null;
			  mycode.abortion_notice();
		  } else {
			  SugarCube.State.variables.NPCName[selected].pregnancy.fetus.splice(fetus, 1);
			  mycode.abortion_notice();
		  }
		  firstload.update_named_npc_abortion_list();
	  },
	  npc_abortion_set: function() {
		  var checkboxes=document.getElementById("npc_abortion_set").checked;
		  if (checkboxes==false) {
			showToast('check the checkbox to confirm');
			return false;
		  }
		  var selected=document.getElementById("npc_abortion_chara_select").value;
		  if (!selected) return false;
		  var fetus=document.getElementById("npc_abortion_select").value;
		  if (selected.match(/pregnancy/)) {
			  var totalFetus=SugarCube.State.variables.storedNPCs[selected].pregnancy.fetus.length;
			  var inGame=true;
		  } else if (selected.match(/stored/)) {
			  var totalFetus=SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.fetus.length;
			  var inGame=false;
		  }
		  if (totalFetus==0) {
			  showToast('No baby!');
			  return false;
		  } else if (totalFetus==1) {
			  if (inGame) {
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.fetus=[];
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.potentialFathers=[];
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.timer=0;
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.timerEnd=null;
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.type=null;
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.waterBreaking=false;
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.waterBreakingTimer=null;
				  delete  SugarCube.State.variables.storedNPCs[selected];
			  } else if (!inGame) {
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.fetus=[];
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.potentialFathers=[];
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.timer=0;
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.timerEnd=null;
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.type=null;
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.waterBreaking=false;
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.waterBreakingTimer=null;
				  delete  SugarCube.State.variables.cheatPlus.storedNPCs[selected];
			  }
			  mycode.abortion_notice();
			  firstload.update_npc_abortion_list();
		  } else {
			  if (inGame) {
				  SugarCube.State.variables.storedNPCs[selected].pregnancy.fetus.splice(fetus, 1);
			  } else if (!inGame) {
				  SugarCube.State.variables.cheatPlus.storedNPCs[selected].pregnancy.fetus.splice(fetus, 1);
			  }
			  mycode.abortion_notice();
		  }
		  firstload.update_npc_fetus_abortion_list();
	  },
	  in_game_cheat: function() {
		  var button=document.getElementById("in_game_cheat");
		  var button2=document.getElementById("alt_cheat");
		  if (button.innerHTML==="Enable") {
			  SugarCube.State.variables.debug=1;
			  button2.innerHTML="Open";
			  button.innerHTML="Disable";
		  } else if (button.innerHTML==="Disable") {
			  SugarCube.State.variables.debug=0;
			  button2.innerHTML="";
			  button.innerHTML="Enable";
		  }
	  },
	  alt_cheat: function() {
		 var overlay = document.getElementById("overlayButtons")
		var overlay2=overlay.querySelectorAll(".link-internal")

		for (var i=0; i<overlay2.length;i++) {
			if (overlay2[i].innerHTML==="CHEATS") {
				closeModal();
				overlay2[i].click();
				return;
			}
		}
		if (SugarCube.State.variables.debug===1) {
			showToast('move passage to see the change');
		} else {
			showToast('cheat not enabled, please re-enable it again.');
		}
		
	  },
	  stingJSSet: function(){
		function textToJS(str, value) {
			var text=str.split(".");
			var length=text.length;
			if (length===1) {
			  window[text[0]]=value;
			} else if (length===2) {
			  window[text[0]][text[1]]=value;
			} else if (length===3) {
			  window[text[0]][text[1]][text[2]]=value;
			} else if (length===4) {
			  window[text[0]][text[1]][text[2]][text[3]]=value;
			} else if (length===5) {
			  window[text[0]][text[1]][text[2]][text[3]][text[4]]=value;
			} else if (length===6) {
			  window[text[0]][text[1]][text[2]][text[3]][text[4]][text[5]]=value;
			} else if (length===7) {
			  window[text[0]][text[1]][text[2]][text[3]][text[4]][text[5]][text[6]]=value;
			} else if (length===8) {
			  window[text[0]][text[1]][text[2]][text[3]][text[4]][text[5]][text[6]][text[7]]=value;
			} else {
				showToast('error');
				return;
			}
			showToast('Activated.');
		}
		var string=document.getElementById("stringJS").value;
		var value=document.getElementById("stringValue").value;
		if (isNaN(parseFloat(value))) {
			textToJS(string, value);
		} else {
			textToJS(string, parseFloat(value));
		}
	  },
	  randomEncounterSet: function(){
		  if (SugarCube.State.variables.alluremod===0) {
			  SugarCube.State.variables.alluremod=1;
			  document.getElementById("randomEncounterSet").innerHTML="Enabled";
			  showToast('Enabled.');
		  } else {
			  SugarCube.State.variables.alluremod=0;
			  document.getElementById("randomEncounterSet").innerHTML="Disabled";
			  showToast('Disabled.');
		  }
	  },
	  purgeNPCPregnancy: function(){
		SugarCube.State.variables.storedNPCs={};
		SugarCube.State.variables.cheatPlus.storedNPCs={};
		mycode.abortion_notice();
		firstload.update_npc_abortion_list();
		firstload.update_npc_fetus_abortion_list();
	  }

}