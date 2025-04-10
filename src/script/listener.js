let mainActions = {
  "quick-link": showContent.bind(null, quicklink, quickcontent),
  "stats-link": showContent.bind(null, statlink, statscontent),
  "misc-link": showContent.bind(null, misclink, misccontent),
  closeButton: closeModal,
  "cheat-up": moveButton.bind(null, "up"),
  "cheat-down": moveButton.bind(null, "down"),
  "cheat-open": openModal,
  "cheat-history-backwards": mycode.cheat_backwards,
  "cheat-history-forwards": mycode.cheat_forwards,
  "cheat-sidebar": mycode.sidebar_cheat,
};

let buttonActions = {
  //toggles
  maxchruchtask: mycode.toggleDaily.bind(mycode, "maxchruchtask", "Church"),
  maxanimaltask: mycode.toggleDaily.bind(mycode, "maxanimaltask", "Stray"),
  edenshrooms: mycode.toggleDaily.bind(mycode, "edenshrooms", "Shroom"),
  edengarden: mycode.toggleDaily.bind(mycode, "edengarden", "Garden"),
  edenspring: mycode.toggleDaily.bind(mycode, "edenspring", "Spring"),
  edentimer: mycode.toggleDaily.bind(mycode, "edentimer", "Timer"),
  virginity: mycode.toggle.bind(mycode, "virginity", "Virgin"),
  purity: mycode.toggle.bind(mycode, "purity", "Pure"),
  unlicum: mycode.toggle.bind(mycode, "unlicum", "Cum"),
  unliarousal: mycode.toggle.bind(mycode, "unliarousal", "arousal"),
  everyone_horny: mycode.toggle.bind(mycode, "everyone_horny", "Horny"),
  farm_safe: mycode.toggle.bind(mycode, "farm_safe", "Safe"),
  checkArray: mycode.toggle.bind(mycode, "checkArray", "Scan"),
  interact_child: mycode.toggle.bind(mycode, "interact_child", "Auto"),
  pregnancy_detection: mycode.toggle.bind(mycode, "pregnancy_detection", "Activate"),
  invincibleAngel: mycode.toggle.bind(mycode, "invincibleAngel", "Activate"),
  invinityNPCPregnancy: mycode.toggleDaily.bind(mycode, "invinityNPCPregnancy", "Activate"),
  //"demonForcedPregnancy": mycode.toggle.bind(mycode, 'demonForcedPregnancy', 'Activate'),
  intenseCum: mycode.toggle.bind(mycode, "intenseCum", "intense cum"),
  allNPCInstaPregnant: mycode.toggle.bind(mycode, "allNPCInstaPregnant", "Activate"),
  allNPCMultiplePregnancy: mycode.toggle.bind(mycode, "allNPCMultiplePregnancy", "Activate"),
  //togglesend
  max_harmony: mycode.max_harmony,
  max_Ferocity: mycode.max_Ferocity,
  // "save_data": export_data,
  // "load_data": import_data,
  "vow-virgin": mycode.imvirgintemple,
  arousal_player: mycode.arousal_player,
  arousal_enemy: mycode.arousal_enemy,
  sheesh: mycode.aezakmi,
  "jk-lol": mycode.imdonefor,
  hesoyam: mycode.hesoyam,
  kill_player: mycode.kill_player,
  ArrayChecker: mycode.ArrayChecker,
  statset: mycode.statmanager,
  enemycalm: mycode.enemycalm,
  kill_enemy: mycode.kill_enemy,
  statsete: mycode.statmanagere,
  moneyset: mycode.moneymanager,
  sprayset: mycode.sprayunlimited,
  bodyset: mycode.bodymanager,
  bodytypeset: mycode.bodytypemanager,
  ballsset: mycode.ballsmanager,
  virginityset: mycode.virginitymanager,
  virginpure: mycode.virginitypure,
  charaset: mycode.charamanager,
  lactatingset: mycode.lactatingmanager,
  cumset: mycode.cummanager,
  milkset: mycode.milkmanager,
  cumrefil: mycode.cumfill,
  milkrefil: mycode.milkfill,
  search123: executeSearch.bind(null, buttonId),
  search456: executeSearch.bind(null, buttonId),
  changetraitbro: mycode.changetraitbro,
  VrelCoinsUsage: mycode.VrelCoinsUsage,
  set_fame12: mycode.set_fame12,
  infect: mycode.infect,
  desinfect: mycode.desinfect,
  set_animal_like: mycode.set_animal_like,
  set_build_time: mycode.set_build_time,
  set_assault_time: mycode.set_assault_time,
  set_exam: mycode.exammanager,
  set_talent: mycode.talentmanager,
  clean_cum: mycode.clean_cum,
  check_fruit_selling: mycode.check_fruit_selling,
  set_school_rep: mycode.set_school_rep,
  named_npc_pregnancy_set: mycode.named_npc_pregnancy_set,
  npc_pregnancy_set: mycode.npc_pregnancy_set,
  mc_pregnancy_set: mycode.mc_pregnancy_set,
  mc_tentacle_set: mycode.mc_tentacle_set,
  mc_baby_set: mycode.mc_baby_set,
  set_hentai_skill: mycode.set_hentai_skill,
  Enable_cheat_history: Enable_cheat_history,
  Enable_sidebar_button: Enable_sidebar_button,
  simple_cheat_button: simple_cheat_button,
  mc_abortion_set: mycode.mc_abortion_set,
  named_npc_abortion_set: mycode.named_npc_abortion_set,
  npc_abortion_set: mycode.npc_abortion_set,
  dirty_cum: mycode.dirty_cum,
  clean_cum_uretus: mycode.clean_cum_uretus,
  in_game_cheat: mycode.in_game_cheat,
  alt_cheat: mycode.alt_cheat,
  stingJSSet: mycode.stingJSSet,
  randomEncounterSet: mycode.randomEncounterSet,
  npc_abortion_purge: mycode.purgeNPCPregnancy,
  purgeNPCBaby: mycode.purgeNPCBaby,
};
//change lookup
let changeActions = {
  statpick: firstload.statpick,
  statpicke: firstload.statpicke,
  charapick: firstload.characurrent,
  fame_name: firstload.famecurrent,
  select_exam: firstload.examcurrent,
  npcnames: firstload.npccurrent,
  npctraits: firstload.npccurrent,
  select_talent: firstload.talentcurrent,
  select_school_rep: firstload.update_school_rep,
  named_npc_pregnancy_manager: firstload.update_pregnancy_day_named_npc,
  npc_pregnancy_manager: firstload.update_pregnancy_day_npc,
  mc_pregnancy_hole: alt_fetch.update_pregnancy_mc,
  mc_pregnancy_manager: firstload.update_pregnancy_day_mc,
  mc_tentacle_location: firstload.update_mc_tentacle,
  mc_tentacle_select: firstload.update_mc_tentacle_input,
  mc_baby_action_select: firstload.update_mc_baby_info,
  mc_baby_select: firstload.update_mc_baby_info,
  mc_abortion_location: firstload.update_mc_abortion_list,
  named_npc_abortion_chara_select: firstload.update_named_npc_abortion_list,
  npc_abortion_chara_select: firstload.update_npc_fetus_abortion_list,
  animal_choice: firstload.update_farm_animals_like,
};
let inputActions = {
  arousal_val: firstload.arousalpicked,
};
function initListeners() {
  cheat.addEventListener("click", function (event) {
    let target = event.target;
    if (!target.id) return;
    buttonId = target.id;
    if (target.tagName === "A" && target.closest(".modal-content")) {
      if (
        SugarCube.State.variables.passage == "Start" &&
        !(buttonId == "save_data" || buttonId == "load_data" || buttonId == "VrelCoinsUsage")
      ) {
        showToast("Still in the main menu!");
        return;
      }
      if (buttonId in buttonActions) {
        buttonActions[buttonId]();
      }
    } else if (buttonId in mainActions) {
      mainActions[buttonId]();
    } else if (isLoad) {
      initStorage();
      reactivateToggles();
      showToast("Cheat state loaded");
      isLoad = false;
    }
    event.stopPropagation();
  });
  cheat.addEventListener("change", function (event) {
    if (SugarCube.State.variables.passage == "Start") return;
    let target = event.target;
    if (target.id in changeActions) {
      changeActions[target.id]();
    }
    event.stopPropagation();
  });

  //input slider listener

  cheat.addEventListener("input", function (event) {
    let target = event.target;
    if (target.id in inputActions) {
      inputActions[target.id]();
    }
    event.stopPropagation();
  });

  //document listener for toggle cheat
  document.addEventListener("click", function (event) {
    if (SugarCube.State.variables.passage === "Settings") {
      //restore variables in certain passage to avoid error.
      restoreVariables();
    } else {
      clickCounter++;
      mycode.runitall();
    }
    //to avoid this variable undefined and causing an error
    let target = event.target;
    if (target.classList.contains("macro-button") && target.innerHTML == "SAVES") {
      isLoad = true;
    } else if (isLoad) {
      initStorage();
      reactivateToggles();
      showToast("Cheat state loaded");
      isLoad = false;
    } else if (target.id == "history-backward" || target.id === "history-forward") {
      initStorage();
    }
  });

  document.addEventListener("keyup", function (event) {
    if (SugarCube.State.variables.passage != "Settings") {
      clickCounter++;
      mycode.runitall();
    }
  });
  cheat.addEventListener("keyup", function (event) {
    event.stopPropagation();
  });
}
