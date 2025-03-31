var firstload = {
  //main function
  update_toggle: function () {
    const appendCheckmark = (bundle) => {
      for (const id in bundle) {
        if (typeof bundle[id] === "function") {
          const button = document.getElementById(id);
          if (button) button.innerHTML += "&#10003;";
        }
      }
    };
    appendCheckmark(functionbundle);
    appendCheckmark(dailyfunctionbundle);
  },
  setButtonText: function (id, text) {
    const button = document.getElementById(id);
    if (button) button.innerHTML = text;
  },

  //cheats function
  statpick: function () {
    const selectedValue = document.getElementById("statpick").value;
    document.getElementById("statinput").value = SugarCube.State.variables[selectedValue];
  },
  statpicke: function () {
    const selectedValue = document.getElementById("statpicke").value;
    document.getElementById("statinpute").value = SugarCube.State.variables[selectedValue];
  },
  spraystate: function () {
    this.setButtonText("sprayset", SugarCube.State.variables.infinitespray == 1 ? "unset" : "set");
  },

  bodycurrent: function () {
    const sizeNames = ["Tiny", "Small", "Normal", "Large"];
    this.setButtonText("bodycurrent", sizeNames[SugarCube.State.variables.bodysize] || "Unknown");
  },
  bodytypecurrent: function () {
    const genderMap = {
      m: "Masculine",
      f: "Feminine",
      a: "Androgynous",
    };
    this.setButtonText(
      "bodytypecurrent",
      genderMap[SugarCube.State.variables.player.gender_body] || "Unknown"
    );
  },

  ballscurrent: function () {
    SugarCube.State.variables.player.ballsExist
      ? this.setButtonText("ballsset", "remove")
      : this.setButtonText("ballsset", "add");
  },
  virginitycurrent: function () {
    const virginitypick = document.getElementById("virginitypick").value;
    SugarCube.State.variables.player.virginity[virginitypick]
      ? this.setButtonText("virginitycurrent", "pure")
      : this.setButtonText("virginitycurrent", "taken");
  },
  crimecurrent: function () {
    let total = 0;
    for (const key in SugarCube.State.variables.crime) {
      if (key !== "events") total += SugarCube.State.variables.crime[key].current;
    }
    this.setButtonText("crimecurrent", total);
  },
  vowcurrent: function () {
    this.setButtonText(
      "vow-virgin",
      SugarCube.State.variables.player.virginity.temple ? "Virgin" : "Not Virgin"
    );
  },
  characurrent: function () {
    const selectedValue = document.getElementById("charapick").value;
    document.getElementById("charainput").value = SugarCube.State.variables[selectedValue];
  },
  lactatingcurrent: function () {
    SugarCube.State.variables.lactating
      ? this.setButtonText("lactatingset", "No")
      : this.setButtonText("lactatingset", "Yes");
  },
  milkcurrent: function () {
    document.getElementById("milkinput").value = SugarCube.State.variables.milk_volume;
  },
  cumcurrent: function () {
    document.getElementById("cuminput").value = SugarCube.State.variables.semen_volume;
  },
  famecurrent: function () {
    const selectedValue = document.getElementById("fame_name").value;
    document.getElementById("input_fame12").value = SugarCube.State.variables.fame[selectedValue];
  },
  npccurrent: function () {
    const cmbBox = document.getElementById("npcnames").value;
    const cmbBox2 = document.getElementById("npctraits").value;
    const input = document.getElementById("npcchangeinput");

    for (let i = 0; i < npcnamelist.length; i++) {
      if (SugarCube.State.variables.NPCName[i].description === cmbBox) {
        input.value = SugarCube.State.variables.NPCName[i][cmbBox2];
        break;
      }
    }
  },
  examcurrent: function () {
    var selectedValue = document.getElementById("select_exam").value;
    document.getElementById("input_exam").value = SugarCube.State.variables[selectedValue];
  },
  talentcurrent: function () {
    var selectedValue = document.getElementById("select_talent").value;
    document.getElementById("input_talent").value = SugarCube.State.variables[selectedValue];
  },
  arousalpicked: function () {
    document.getElementById("arousal_preview").innerHTML =
      document.getElementById("arousal_val").value + "%";
  },
  update_pregnancy: function () {
    this.setButtonText("pc_pregnancy", "MC = " + mycode.pc_pregnant);
    this.setButtonText("npc_pregnancy", "NPC = " + mycode.total_npc_pregnant);
  },
  update_school_rep: function () {
    const selected = document.getElementById("select_school_rep").value;
    document.getElementById("input_school_rep").value = SugarCube.State.variables[selected];
  },
  update_pregnancy_list_named_npc: function () {
    const selectElement = document.getElementById("named_npc_pregnancy_manager");
    selectElement.innerHTML = "";

    SugarCube.State.variables.NPCName.forEach((npc, index) => {
      if (npc.pregnancy.timer != null) {
        const option = new Option(npc.description, index);
        selectElement.appendChild(option);
      }
    });
  },
  update_pregnancy_day_named_npc: function () {
    const selectElement = document.getElementById("named_npc_pregnancy_manager").value;
    if (!selectElement) return;

    document.getElementById("named_npc_pregnancy_input").value =
      (SugarCube.State.variables.NPCName[selectElement].pregnancy.timerEnd -
        SugarCube.State.variables.NPCName[selectElement].pregnancy.timer) /
      3;

    document.getElementById("named_npc_pregnancy_toggle").checked =
      mycode.named_npc_pregnancy_locked.includes(selectElement);
  },
  update_pregnancy_list_npc: function () {
    const selectElement = document.getElementById("npc_pregnancy_manager");
    selectElement.innerHTML = "";

    for (const key in SugarCube.State.variables.storedNPCs) {
      const option = new Option(
        SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother,
        key
      );
      selectElement.appendChild(option);
    }
  },

  update_pregnancy_day_npc: function () {
    const selectElement = document.getElementById("npc_pregnancy_manager").value;
    if (!selectElement) return;

    document.getElementById("npc_pregnancy_input").value =
      (SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timerEnd -
        SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timer) /
      3;

    document.getElementById("npc_pregnancy_toggle").checked =
      mycode.npc_pregnancy_locked.includes(selectElement);
  },
  //not yet optimized
  update_pregnancy_list_mc: function () {
    var selectElement = document.getElementById("mc_pregnancy_manager");
    var selectHole = document.getElementById("mc_pregnancy_hole").value;
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
    if (SugarCube.State.variables.sexStats[selectHole].pregnancy.type == "parasite") {
      for (var key in SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus) {
        const option = document.createElement("option");
        option.value = key;
        option.text = SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[key].creature;
        selectElement.appendChild(option);
      }
    } else if (SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd != null) {
      const option = document.createElement("option");
      option.value = "baby";
      option.text = "baby";
      selectElement.appendChild(option);
    }
  },
  //not yet optimized
  update_pregnancy_day_mc: function () {
    var selectElement = document.getElementById("mc_pregnancy_manager").value;
    var selectHole = document.getElementById("mc_pregnancy_hole").value;
    var mc_pregnancy_input = document.getElementById("mc_pregnancy_input");
    var mc_pregnancy_toggle = document.getElementById("mc_pregnancy_toggle");
    if (!selectElement) return;
    var pregType = SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
    if (pregType == "parasite") {
      mc_pregnancy_input.value =
        SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft;
    } else {
      mc_pregnancy_input.value =
        (SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd -
          SugarCube.State.variables.sexStats[selectHole].pregnancy.timer) /
        3;
    }
    var isExist = mycode.mc_pregnancy_locked.findIndex((name) => name == selectElement);
    var isExist2 =
      isExist === -1
        ? 0
        : mycode.mc_pregnancy_locked_hole[isExist] != selectHole
        ? 1
        : mycode.mc_pregnancy_locked_type[isExist] != pregType
        ? 2
        : 3;
    if (isExist2 === 3) {
      mc_pregnancy_toggle.checked = true;
    } else {
      mc_pregnancy_toggle.checked = false;
    }
  },
  //not yet optimized
  update_mc_tentacle: function () {
    var selectElement = document.getElementById("mc_tentacle_select");
    var selectlocation = document.getElementById("mc_tentacle_location").value;
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
    for (var key in SugarCube.State.variables.container[selectlocation].creatures) {
      if (SugarCube.State.variables.container[selectlocation].creatures[key] != null) {
        const option = document.createElement("option");
        option.value = key;
        option.text = SugarCube.State.variables.container[selectlocation].creatures[key].creature;
        selectElement.appendChild(option);
      }
    }
    firstload.update_mc_tentacle_input();
  },

  update_mc_tentacle_input: function () {
    var selectElement = document.getElementById("mc_tentacle_select").value;
    if (!selectElement) return;
    var selectlocation = document.getElementById("mc_tentacle_location").value;
    document.getElementById("mc_tentacle_input").value =
      SugarCube.State.variables.container[selectlocation].creatures[selectElement].stats.speed;
  },
  update_mc_baby_info: function () {
    var selectElement = document.getElementById("mc_baby_select").value;
    var selectAction = document.getElementById("mc_baby_action_select").value;
    var mc_baby_input = document.getElementById("mc_baby_input");
    var child = SugarCube.State.variables.children[selectElement];

    if (!child) return;

    document
      .getElementById("mc_baby_tooltip")
      .querySelector(
        "span"
      ).textContent = `Name: ${child.name}, Father: ${child.father}, Mother: ${child.mother}, Location: ${child.birthLocation}`;

    if (selectAction === "name") {
      mc_baby_input.type = "text";
      mc_baby_input.value = child[selectAction] || "";
    } else {
      mc_baby_input.type = "checkbox";
      mc_baby_input.checked = Boolean(child[selectAction]);
    }
  },

  update_mc_baby_list_options: 0,
  update_mc_baby_list: function () {
    const babySelect = document.getElementById("mc_baby_select");
    const babyActionSelect = document.getElementById("mc_baby_action_select");
    const babyInput = document.getElementById("mc_baby_input");

    babySelect.innerHTML = "";

    Object.keys(SugarCube.State.variables.children).forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.text = key;
      babySelect.appendChild(option);
    });

    firstload.update_mc_baby_info();

    if (firstload.update_mc_baby_list_options === 0) {
      firstload.update_mc_baby_list_options = 1;

      babyInput.style.display = "";

      babyActionSelect.innerHTML = "";

      Object.keys(babyOptions).forEach((key) => {
        const option = document.createElement("option");
        option.value = babyOptions[key];
        option.text = babyOptionsText[key];
        babyActionSelect.appendChild(option);
      });
    }
  },
  update_mc_baby_list: function () {
    const babySelect = document.getElementById("mc_baby_select");
    const babyActionSelect = document.getElementById("mc_baby_action_select");
    const babyInput = document.getElementById("mc_baby_input");

    babySelect.innerHTML = "";

    Object.entries(SugarCube.State.variables.children).forEach(([key]) => {
      babySelect.append(new Option(key, key));
    });

    firstload.update_mc_baby_info();

    if (!firstload.update_mc_baby_list_options) {
      firstload.update_mc_baby_list_options = 1;

      babyInput.style.display = "";

      babyActionSelect.innerHTML = "";
      Object.entries(babyOptions).forEach(([key, value]) => {
        babyActionSelect.append(new Option(babyOptionsText[key], value));
      });
    }
  },
  //not yet optimized
  update_mc_abortion_list: function () {
    var locations = document.getElementById("mc_abortion_location").value;
    var abortionSelect = document.getElementById("mc_abortion_select");
    var totalFetus = SugarCube.State.variables.sexStats[locations].pregnancy.fetus.length;
    while (abortionSelect.firstChild) {
      abortionSelect.removeChild(abortionSelect.firstChild);
    }
    for (var i = 0; i < totalFetus; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      abortionSelect.appendChild(option);
    }
  },
  //not yet optimized

  update_named_npc_abortion_list: function () {
    var npcSelect = document.getElementById("named_npc_abortion_chara_select").value;
    var abortionSelect = document.getElementById("named_npc_abortion_select");
    for (let i = 0; i < npcnamelist.length; i++) {
      if (SugarCube.State.variables.NPCName[i].description === npcSelect) {
        var totalFetus = 0;
        if (typeof SugarCube.State.variables.NPCName[i].pregnancy.fetus === "object")
          totalFetus = SugarCube.State.variables.NPCName[i].pregnancy.fetus.length;
      }
    }

    while (abortionSelect.firstChild) {
      abortionSelect.removeChild(abortionSelect.firstChild);
    }

    for (var i = 0; i < totalFetus; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      abortionSelect.appendChild(option);
    }
  },
  //not yet optimized

  update_npc_abortion_list: function () {
    if (!typeof SugarCube.State.variables.storedNPCs.pregnancy_0 === "object") return false;
    var abortionCharaSelect = document.getElementById("npc_abortion_chara_select");
    while (abortionCharaSelect.firstChild) {
      abortionCharaSelect.removeChild(abortionCharaSelect.firstChild);
    }
    var number = 1;
    for (var key in SugarCube.State.variables.storedNPCs) {
      const option = document.createElement("option");
      option.value = key;
      option.text =
        number + ". " + SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother;
      abortionCharaSelect.appendChild(option);
      number++;
    }
    for (var key in SugarCube.State.variables.cheatPlus.storedNPCs) {
      const option = document.createElement("option");
      option.value = key;
      option.text =
        number +
        ". " +
        SugarCube.State.variables.cheatPlus.storedNPCs[key].pregnancy.fetus[0].mother;
      abortionCharaSelect.appendChild(option);
      number++;
    }
  },
  //not yet optimized

  update_npc_fetus_abortion_list: function () {
    var abortionSelect = document.getElementById("npc_abortion_select");
    var abortionCharaSelect = document.getElementById("npc_abortion_chara_select").value;
    if (abortionCharaSelect.match(/pregnancy/)) {
      var totalFetus =
        SugarCube.State.variables.storedNPCs[abortionCharaSelect].pregnancy.fetus.length;
    } else if (abortionCharaSelect.match(/stored/)) {
      var totalFetus =
        SugarCube.State.variables.cheatPlus.storedNPCs[abortionCharaSelect].pregnancy.fetus.length;
    }
    while (abortionSelect.firstChild) {
      abortionSelect.removeChild(abortionSelect.firstChild);
    }
    for (var i = 0; i < totalFetus; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;
      abortionSelect.appendChild(option);
    }
  },
  update_cheat_state: function () {
    const button = document.getElementById("in_game_cheat");
    if (
      (SugarCube.State.variables.debug === 1 && button.innerHTML === "Enable") ||
      (SugarCube.State.variables.debug === 0 && button.innerHTML === "Disable")
    ) {
      mycode.in_game_cheat();
    }
  },

  update_farm_assault_day: function () {
    const assaultTime = document.getElementById("assault_time");
    if (SugarCube.State.variables.farm_attack_timer) {
      assaultTime.value = SugarCube.State.variables.farm_attack_timer;
    }
  },

  update_farm_buildtime: function () {
    const buildTime = document.getElementById("build_time");
    if (SugarCube.State.variables.farm?.build_timer) {
      buildTime.value = SugarCube.State.variables.farm.build_timer;
    }
  },

  update_farm_animals_like: function () {
    const farm = SugarCube.State.variables.farm;
    if (farm) {
      const animal = document.getElementById("animal_choice").value;
      document.getElementById("animal_input").value = farm.beasts?.[animal] ?? "";
    }
  },

  update_array_checker: function () {
    document.getElementById("auto_check_status").innerHTML = SugarCube.State.variables.cheatPlus
      .arrayCheck
      ? "found"
      : "not found";
  },

  randomEncounterUpdate: function () {
    document.getElementById("randomEncounterSet").innerHTML =
      SugarCube.State.variables.alluremod === 0 ? "Disabled" : "Enabled";
  },
};

var alt_fetch = {
  update_pregnancy_mc: function () {
    firstload.update_pregnancy_list_mc();
    firstload.update_pregnancy_day_mc();
  },
};

function loadall() {
  if (SugarCube.State.variables.passage === "Start") return;

  document.getElementById("moneyinput").value = SugarCube.State.variables.money;

  let interval = 1;
  isFetching = true;
  totalFetchFunction = Object.keys(firstload).filter(
    (key) => typeof firstload[key] === "function"
  ).length;
  currentFetch = 0;

  Object.keys(firstload).forEach((functionName, index) => {
    if (typeof firstload[functionName] === "function") {
      setTimeout(() => {
        firstload[functionName]();
        currentFetch++;
      }, interval);
      interval += 1;
    }
  });
}
