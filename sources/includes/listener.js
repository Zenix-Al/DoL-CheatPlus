document.addEventListener("click", function(event) {
  var target = event.target;
  setTimeout(function() {
	clickCounter+=1;
    mycode.runitall();
	var date = (SugarCube.State.variables.timeStamp-SugarCube.State.variables.timeStamp%86400)/86400;
	if (curDate<date || curDate>date){
		curDate=date;
		mycode.runitallDaily();
	}
  }, 10);
  if (target.closest("#cheat")) {
	  if (target.tagName === "A" && target.closest(".modal-content")) {
		var buttonId = target.id;
		if (!buttonActions) var buttonActions = {
		  //toggles
		  "maxchruchtask": mycode.toggleDaily.bind(mycode, 'maxchruchtask', 'Church'),
		  "maxanimaltask": mycode.toggleDaily.bind(mycode, 'maxanimaltask', 'Stray'),
		  "edenshrooms": mycode.toggleDaily.bind(mycode, 'edenshrooms', 'Shroom'),
		  "edengarden": mycode.toggleDaily.bind(mycode, 'edengarden', 'Garden'),
		  "edenspring": mycode.toggleDaily.bind(mycode, 'edenspring', 'Spring'),
		  "edentimer": mycode.toggleDaily.bind(mycode, 'edentimer', 'Timer'),
		  "virginity": mycode.toggle.bind(mycode, 'virginity', 'Virgin'),
		  "purity": mycode.toggle.bind(mycode, 'purity', 'Pure'),
		  "unlicum": mycode.toggle.bind(mycode, 'unlicum', 'Cum'),
		  "unliarousal": mycode.toggle.bind(mycode, 'unliarousal', 'arousal'), 
		  "everyone_horny": mycode.toggle.bind(mycode, 'everyone_horny', 'Horny'),
		  "farm_safe": mycode.toggle.bind(mycode, 'farm_safe', 'Safe'),
		  "checkArray": mycode.toggle.bind(mycode, 'checkArray', 'Scan'),
		  "interact_child": mycode.toggle.bind(mycode, 'interact_child', 'Auto'),
		  "pregnancy_detection": mycode.toggle.bind(mycode, 'pregnancy_detection', 'Activate'),
		  //togglesend
		  "max_harmony": mycode.max_harmony,
		  "max_Ferocity": mycode.max_Ferocity,
		  "save_data": export_data,
		  "load_data": import_data,
		  "vow-virgin": mycode.imvirgintemple,
		  "arousal_player": mycode.arousal_player,
		  "arousal_enemy": mycode.arousal_enemy,
		  "sheesh": mycode.aezakmi,
		  "jk-lol": mycode.imdonefor,
		  "hesoyam": mycode.hesoyam,
		  "kill_player": mycode.kill_player,
		  "ArrayChecker": mycode.ArrayChecker,
		  "statset": mycode.statmanager,
		  "enemycalm": mycode.enemycalm,
		  "kill_enemy": mycode.kill_enemy,
		  "statsete": mycode.statmanagere,
		  "moneyset": mycode.moneymanager,
		  "sprayset": mycode.sprayunlimited,
		  "bodyset": mycode.bodymanager,
		  "bodytypeset": mycode.bodytypemanager,
		  "ballsset": mycode.ballsmanager,
		  "virginityset": mycode.virginitymanager,
		  "virginpure": mycode.virginitypure,
		  "charaset": mycode.charamanager,
		  "lactatingset": mycode.lactatingmanager,
		  "cumset": mycode.cummanager,
		  "milkset": mycode.milkmanager,
		  "cumrefil": mycode.cumfill,
		  "milkrefil": mycode.milkfill,
		  "search123": mycode.executeSearch.bind(null, buttonId),
		  "search456": mycode.executeSearch.bind(null, buttonId),
		  "changetraitbro": mycode.changetraitbro,
		   "VrelCoinsUsage": mycode.VrelCoinsUsage,
		   "set_fame12": mycode.set_fame12,
		  "infect": mycode.infect,
		  "desinfect": mycode.desinfect,
		   "set_animal_like": mycode.set_animal_like,
		  "set_build_time": mycode.set_build_time,
		  "set_assault_time": mycode.set_assault_time,
		  "set_exam": mycode.exammanager,
		  "set_talent": mycode.talentmanager,
		  "clean_cum": mycode.clean_cum,
		  "check_fruit_selling": mycode.check_fruit_selling,
		  "set_school_rep":mycode.set_school_rep,
		  "named_npc_pregnancy_set":mycode.named_npc_pregnancy_set,
		  "npc_pregnancy_set":mycode.npc_pregnancy_set,
		  "mc_pregnancy_set":mycode.mc_pregnancy_set,
		  "mc_tentacle_set":mycode.mc_tentacle_set,
		  "mc_baby_set":mycode.mc_baby_set,
		  "set_hentai_skill":mycode.set_hentai_skill,
		  "Enable_cheat_history":mycode.Enable_cheat_history,
		  "Enable_sidebar_button":mycode.Enable_sidebar_button,
		  "simple_cheat_button":mycode.simple_cheat_button,
		  "mc_abortion_set":mycode.mc_abortion_set,
		  "named_npc_abortion_set":mycode.named_npc_abortion_set,
		  "npc_abortion_set":mycode.npc_abortion_set
		};
		if (SugarCube.State.variables.passage=='Start' && !(buttonId=='save_data' || buttonId=='load_data')){
			showToast('Still in the main menu!');
			return;
		}
		if (buttonId in buttonActions) {
		  buttonActions[buttonId]();
		}

	  } else if (target.closest("#floating-button")) {
		if (target.id === "cheat-up") {
		  moveButton("up");
		} else if (target.id === "cheat-down") {
		  moveButton("down");
		} else if (target.id === "cheat-open") {
		  openModal();
		} else if (target.id === "cheat-history-backwards") {
		  mycode.cheat_backwards();
		} else if (target.id === "cheat-history-forwards") {
		  mycode.cheat_forwards();
		} else if (target.id === "cheat-sidebar") {
		  mycode.sidebar_cheat();
		} 
	  } else if (target.classList.contains("nav-link")) {
		  var navId = target.id;
		  if (navId=="quick-link"){
			var navTarget=quicklink;
			var navTargetContent=quickcontent;
			showContent(navTarget, navTargetContent);
		  } else if (navId=="stats-link") {
			  var navTarget=statlink;
			  var navTargetContent=statscontent;
			  showContent(navTarget, navTargetContent);
		  } else if (navId=="misc-link") {
			  var navTarget=misclink;
			  var navTargetContent=misccontent;
			  showContent(navTarget, navTargetContent);
		  } else if (navId=="closeButton") { 
			closeModal();
		  }
	  }
  } else {
	  if (document.getElementById("cheat-history-backwards").hidden==false) mycode.update_history();
  }
});

cheat.addEventListener("change", function(event) {
	if (SugarCube.State.variables.passage=='Start') return;
  var target = event.target;
  if (target.id === "statpick") {
	  firstload.statpick();
  } else if (target.id === "statpicke") {
	  firstload.statpicke();
  } else if (target.id === "charapick") {
	  firstload.characurrent();
  } else if (target.id === "fame_name") {
	  firstload.famecurrent();
  } else if (target.id === "select_exam") {
	  firstload.examcurrent();
  } else if (target.id === "npcnames" || target.id === "npctraits") {
	  firstload.npccurrent();
  } else if (target.id === "select_talent") {
	  firstload.talentcurrent();
  } else if (target.id === "select_school_rep") {
	  firstload.update_school_rep();
  } else if (target.id === "named_npc_pregnancy_manager") {
	  firstload.update_pregnancy_day_named_npc();
  } else if (target.id === "npc_pregnancy_manager") {
	  firstload.update_pregnancy_day_npc();
  } else if (target.id === "mc_pregnancy_hole") {
	  firstload.update_pregnancy_list_mc();
	  firstload.update_pregnancy_day_mc();
  } else if (target.id === "mc_pregnancy_manager") {
	  firstload.update_pregnancy_day_mc();
  } else if (target.id === "mc_tentacle_location") {
	  firstload.update_mc_tentacle();
  } else if (target.id === "mc_tentacle_select") {
	  firstload.update_mc_tentacle_input();
  } else if (target.id === "mc_baby_action_select" || target.id === "mc_baby_select") {
	  firstload.update_mc_baby_info();
  } else if (target.id === "mc_abortion_location") {
	  firstload.update_mc_abortion_list();
  } else if (target.id === "named_npc_abortion_chara_select") {
	  firstload.update_named_npc_abortion_list();
  } else if (target.id === "npc_abortion_chara_select") {
	  firstload.update_npc_fetus_abortion_list();
  }
  
});

cheat.addEventListener("input", function(event) {
  var target = event.target;
  if (target.id === "arousal_val") {
	  firstload.arousalpicked();
  } else if (target.id === "performance_quick" && document.getElementById("active_performance_quick").checked==true) {
	  mycode.performance_quick_inyohead=10;
	  mycode.performance_quick();
  }
});