let mycode = {
  runitallRestore: function () {
    functionbundle = {};
    this.toggleActive = [];
    showToast("Error detected in toggle cheat, resetting.");

    Object.assign(this, {
      errorFunctions: 0,
      progressFunctions: 0,
      totalFunctions: 0,
    });

    reactivateToggles();
    showToast("Complete.");
  },

  runitall: function () {
    if (isLoad) return;
    if (totalFunctions !== progressFunctions) {
      errorFunctions++;
      if (errorFunctions > 5) {
        this.runitallRestore();
      }
      return;
    }
    errorFunctions = 0;
    progressFunctions = 0;
    totalFunctions = 0;

    const keys = Object.keys(functionbundle);
    if (!keys.length) return;

    let index = 0;
    function executeNext() {
      if (index >= keys.length) return;
      const key = keys[index++];
      if (typeof functionbundle[key] === "function") {
        functionbundle[key]();
        progressFunctions++;
      }
      requestAnimationFrame(executeNext); // More efficient than many setTimeouts
    }
    executeNext();

    clickCounter--;
    if (clickCounter > 0) {
      setTimeout(() => this.runitall(), 10);
    }

    // Check if daily toggle should run
    this.checkDateDaily();
  },

  toggleActive: [],
  toggleDeactivated: false,
  toggle: function (id, name) {
    const button = document.getElementById(id);
    const isActive = !!this.toggleActive[id]; // Convert to boolean

    this.toggleDeactivated = isActive;
    console.log(id, " ", name);

    if (isActive) {
      delete functionbundle[id];
      delete SugarCube.State.variables.cheatPlus.toggles[id];
      delete this.toggleActive[id];
      console.log("Deactive!");
    } else {
      if (!reactivatingToggles) extra_notif = true;
      functionbundle[id] = this[id].bind(this);
      functionbundle[id]();
      SugarCube.State.variables.cheatPlus.toggles[id] = id;
      this.toggleActive[id] = true;
      console.log("Active!");
      extra_notif = false;
    }

    if (button) button.innerHTML = name + (isActive ? "" : "&#10003;");
    this.toggleDeactivated = false;
  },

  checkDateDaily: function () {
    const date = Math.floor(SugarCube.State.variables.timeStamp / 86400);
    if (curDate !== date) {
      curDate = date;
      this.runitallDaily();
    }
  },

  toggleActiveDaily: {},
  runitallDaily: function () {
    Object.keys(dailyfunctionbundle).forEach((key) => {
      if (typeof dailyfunctionbundle[key] === "function") {
        dailyfunctionbundle[key]();
      }
    });
  },

  toggleDaily: function (id, name) {
    const button = document.getElementById(id);
    const isActive = !!this.toggleActiveDaily[id];

    if (isActive) {
      delete dailyfunctionbundle[id];
      delete SugarCube.State.variables.cheatPlus.toggles[id];
      delete this.toggleActiveDaily[id];
      if (button) button.innerHTML = name;
      console.log("Deactive!");
    } else {
      if (!reactivatingToggles) extra_notif = true;
      dailyfunctionbundle[id] = this[id].bind(this);
      SugarCube.State.variables.cheatPlus.toggles[id] = id;
      this.toggleActiveDaily[id] = true;
      if (button) button.innerHTML = name + "&#10003;";
      dailyfunctionbundle[id]();
      console.log("Active!");
      extra_notif = false;
    }
  },

  everyone_horny: function () {
    for (let i = 0; i < npcnamelist.length; i++) {
      if (SugarCube.State.variables.NPCName[i].description != "Ivory Wraith")
        SugarCube.State.variables.NPCName[i].lust = 100;
    }
  },

  edenspring: function () {
    SugarCube.State.variables.edenspring = 4;
  },
  edengarden: function () {
    SugarCube.State.variables.edengarden = 4;
  },
  edentimer: function () {
    SugarCube.State.variables.edendays = 0;
  },
  edenshrooms: function () {
    SugarCube.State.variables.edenshrooms = 4;
  },
  checkArrayTreshold: 0,
  checkArray: function () {
    this.checkArrayTreshold++;
    if (this.checkArrayTreshold <= 10) {
      return;
    }
    this.checkArrayTreshold = 0;
    SugarCube.State.variables.cheatPlus.arrayCheck = false;
    function processValue(value) {
      if (Array.isArray(value) && value.length == 0) {
        var check = Object.keys(value);
        if (check.length > 0) {
          SugarCube.State.variables.cheatPlus.arrayCheck = true;
          showToast("Broken array has been found!");
          return;
          logBrokenArrayValues(value);
        }
      } else if (Array.isArray(value)) {
        logArrayValues(value);
      } else if (typeof value === "object" && value !== null) {
        logObjectValues(value);
      }
    }
    function logObjectValues(obj) {
      for (const key in obj) {
        const value = obj[key];
        processValue(value);
      }
    }

    function logArrayValues(obj) {
      for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        processValue(value);
      }
    }

    function logBrokenArrayValues(obj) {
      var check = Object.keys(obj);
      for (const key of check) {
        const value = obj[key];
        processValue(value);
      }
    }
    logObjectValues(SugarCube.State.variables);
  },
  maxchruchtask: function () {
    SugarCube.State.variables.temple_garden = 100;
    SugarCube.State.variables.temple_quarters = 100;
    SugarCube.State.variables.grace = 100;
  },
  maxanimaltask: function () {
    SugarCube.State.variables.stray_happiness = 100;
  },
  purity: function () {
    SugarCube.State.variables.purity = 1000;
  },
  farm_safe: function () {
    SugarCube.State.variables.farm.aggro = 0;
  },
  interact_child: function () {
    for (var key in SugarCube.State.variables.children) {
      if (SugarCube.State.variables.children[key].localVariables.event == true) {
        SugarCube.State.variables.children[key].localVariables.interactions += 1;
        SugarCube.State.variables.children[key].localVariables.interactionsTotal += 1;
        SugarCube.State.variables.children[key].localVariables.event = false;
      }
    }
  },
  total_npc_pregnant: 0,
  pc_pregnant: 0,
  pregnancy_detection: function () {
    function count_npc() {
      var total = Object.keys(SugarCube.State.variables.storedNPCs).length;
      total += Object.keys(SugarCube.State.variables.cheatPlus.storedNPCs).length;
      for (var i = 0; i < SugarCube.State.variables.NPCName.length; i++) {
        if (SugarCube.State.variables.NPCName[i]?.pregnancy?.fetus?.length > 0) {
          total++;
        }
      }
      return total;
    }

    function count_pc() {
      return (
        SugarCube.State.variables.sexStats.vagina.pregnancy.fetus.length +
        SugarCube.State.variables.sexStats.anus.pregnancy.fetus.length
      );
    }

    if (this.total_npc_pregnant == 0) {
      this.total_npc_pregnant = count_npc();
      var tmp_npc = this.total_npc_pregnant;
      this.pc_pregnant = count_pc();
      var tmp_pc = count_pc();
    } else {
      var tmp_npc = count_npc();
      var tmp_pc = count_pc();
    }

    if (tmp_npc > this.total_npc_pregnant) {
      showToast("NPC is impregnated!");
      this.invinityNPCPregnancy();
      this.total_npc_pregnant = tmp_npc;
    } else if (tmp_npc < this.total_npc_pregnant) {
      showToast("NPC's baby has been born!");
      this.invinityNPCPregnancy();
      this.total_npc_pregnant = tmp_npc;
    }
    if (tmp_pc > this.pc_pregnant) {
      showToast("MC is impregnated!");
      this.pc_pregnant = tmp_pc;
    } else if (tmp_pc < this.pc_pregnant) {
      showToast("your baby has been born!!");
      this.pc_pregnant = tmp_pc;
    }
  },
  named_npc_pregnancy_manager_toggle: function () {
    for (const key in this.named_npc_pregnancy_locked) {
      var total =
        SugarCube.State.variables.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timerEnd -
        this.named_npc_pregnancy_locked_day[key] * 3;
      if (total < 0) total = 0;
      SugarCube.State.variables.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timer =
        total;
    }
  },
  npc_pregnancy_manager_toggle: function () {
    for (const key in this.npc_pregnancy_locked) {
      var total =
        SugarCube.State.variables.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timerEnd -
        this.npc_pregnancy_locked_day[key] * 3;
      if (total < 0) total = 0;
      SugarCube.State.variables.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timer = total;
    }
  },
  mc_pregnancy_manager_toggle: function () {
    var lap = 0;
    for (const key in this.mc_pregnancy_locked) {
      if (this.mc_pregnancy_locked_type[lap] == "parasite") {
        SugarCube.State.variables.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.fetus[
          key
        ].daysLeft = this.mc_pregnancy_locked_day[lap];
      } else {
        var timeEnd =
          SugarCube.State.variables.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.timerEnd;
        var time = timeEnd - this.mc_pregnancy_locked_day[lap] * 3;
        console.log(time);
        if (time < 0) time = 0;
        SugarCube.State.variables.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.timer =
          time;
      }
    }
  },
  invincibleAngel: function () {
    if (extra_notif)
      if (SugarCube.State.variables.demon > 0) {
        showToast("Youre a demon!");
        timedToast("but, okay", 3000);
      } else if (SugarCube.State.variables.fallenangel > 0) {
        showToast("Im sorry, youre already a fallen angel.");
        timedToast("im turning this off", 3000);
        buttonActions["invincibleAngel"]();
        return;
      }
    if (SugarCube.State.variables.penisstate != 0 || SugarCube.State.variables.vaginastate != 0) {
      if (SugarCube.State.variables.cheatPlus.angelMode) return;
      SugarCube.State.variables.cheatPlus.angel = SugarCube.State.variables.angel;
      SugarCube.State.variables.angel = 0;
      SugarCube.State.variables.angelbuild = 100;
      SugarCube.State.variables.cheatPlus.angelMode = true;
    } else if (SugarCube.State.variables.cheatPlus.angelMode) {
      SugarCube.State.variables.cheatPlus.angelMode = false;
      SugarCube.State.variables.angel = SugarCube.State.variables.cheatPlus.angel;
    }
  },
  invinityNPCPregnancy: function () {
    var priorityQueue = 0;
    var waitQueue = 0;
    var limit = 8;
    var tmp = {};
    var store = {};
    var dateLeft = 0;
    var gameTime = SugarCube.State.variables.timeStamp;
    var date = (gameTime - (gameTime % 86400)) / 86400;
    if (SugarCube.State.variables.cheatPlus.storedNPCsDate !== 0) {
      dateLeft = (date - SugarCube.State.variables.cheatPlus.storedNPCsDate) * 3;
    }
    SugarCube.State.variables.cheatPlus.storedNPCsDate = date;
    for (const key1 in SugarCube.State.variables.storedNPCs) {
      var left =
        SugarCube.State.variables.storedNPCs[key1].pregnancy.timerEnd -
        SugarCube.State.variables.storedNPCs[key1].pregnancy.timer;
      if (left <= 3 && priorityQueue <= limit) {
        tmp["stored_" + priorityQueue] = SugarCube.State.variables.storedNPCs[key1];
        if (priorityQueue == 8)
          showToast("NPC about to give abirth, you cant bustin nuts in people for today!");
        priorityQueue++;
      } else if (left > 3 || priorityQueue > limit) {
        store["stored_" + waitQueue] = SugarCube.State.variables.storedNPCs[key1];
        waitQueue++;
      }
    }
    for (const key2 in SugarCube.State.variables.cheatPlus.storedNPCs) {
      var timerEnd = SugarCube.State.variables.cheatPlus.storedNPCs[key2].pregnancy.timerEnd;
      var timer = SugarCube.State.variables.cheatPlus.storedNPCs[key2].pregnancy.timer;
      if (dateLeft > 0) {
        SugarCube.State.variables.cheatPlus.storedNPCs[key2].pregnancy.timer += dateLeft;
        if (SugarCube.State.variables.cheatPlus.storedNPCs[key2].pregnancy.timer > timerEnd)
          SugarCube.State.variables.cheatPlus.storedNPCs[key2].pregnancy.timer = timerEnd;
      }
      var left = timerEnd - timer;
      if (left <= 3 && priorityQueue <= limit) {
        tmp["stored_" + priorityQueue] = SugarCube.State.variables.cheatPlus.storedNPCs[key2];
        if (priorityQueue == 8)
          showToast("NPC about to give abirth, you cant bustin nuts in people for today!");
        priorityQueue++;
      } else if (left > 3 || priorityQueue > limit) {
        store["stored_" + waitQueue] = SugarCube.State.variables.cheatPlus.storedNPCs[key2];
        waitQueue++;
      }
    }
    SugarCube.State.variables.storedNPCs = tmp;
    SugarCube.State.variables.cheatPlus.storedNPCs = store;
  },
  updateUserDivine: function () {
    if (SugarCube.State.variables.penisstate != 0 || SugarCube.State.variables.vaginastate != 0)
      return;
    if (SugarCube.State.variables.demon > 0) {
      SugarCube.State.variables.cheatPlus.trueDivine = "demon";
    } else if (SugarCube.State.variables.angel > 0) {
      SugarCube.State.variables.cheatPlus.trueDivine = "angel";
    }
  },
  initNPCinstapreg: false,
  allNPCInstaPregnant: function () {
    if (mycode.toggleDeactivated) {
      SugarCube.State.variables.baseNpcPregnancyChance =
        SugarCube.State.variables.cheatPlus.baseNpcPregnancyChance;
      if (SugarCube.State.variables.baseNpcPregnancyChance > 16)
        SugarCube.State.variables.baseNpcPregnancyChance = 16;
      mycode.initNPCinstapreg = false;
      return;
    }
    if (!mycode.initNPCinstapreg) {
      mycode.initNPCinstapreg = true;
      SugarCube.State.variables.cheatPlus.baseNpcPregnancyChance =
        SugarCube.State.variables.baseNpcPregnancyChance;
      SugarCube.State.variables.baseNpcPregnancyChance = 19;
    }
    for (var i = 0; i < SugarCube.State.variables.NPCList.length; i++) {
      if (SugarCube.State.variables.NPCList[i].pregnancyAvoidance > 0) {
        SugarCube.State.variables.NPCList[i].pregnancyAvoidance = 0;
      }
    }
  },
  allNPCMultiplePregnancy: function () {
    for (var i = 0; i < SugarCube.State.variables.NPCList.length; i++) {
      if (SugarCube.State.variables.NPCList[i].pregnancy === 1) {
        SugarCube.State.variables.NPCList[i].pregnancy = 0;
      }
    }
  },
  tmpArousal: 0,
  orgasmdown: 0,
  unlicum: function () {
    if (SugarCube.State.variables.semen_amount < SugarCube.State.variables.semen_volume) {
      SugarCube.State.variables.semen_amount = SugarCube.State.variables.semen_volume;
      SugarCube.State.variables.orgasmcount = 0;
    }
  },
  intenseCum: function () {
    if (
      SugarCube.State.variables.orgasmcurrent != 0 &&
      !SugarCube.State.variables.cheatPlus.unlicumMode
    ) {
      SugarCube.State.variables.cheatPlus.orgasmcount = 0;
      mycode.tmpArousal = SugarCube.State.variables.arousal;
      SugarCube.State.variables.orgasmdown = 1000;
      mycode.orgasmdown = 1000;
      SugarCube.State.variables.cheatPlus.unlicumMode = true;
    } else if (
      SugarCube.State.variables.orgasmdown < mycode.orgasmdown &&
      SugarCube.State.variables.cheatPlus.unlicumMode
    ) {
      mycode.orgasmdown = SugarCube.State.variables.orgasmdown;
      SugarCube.State.variables.arousal = mycode.tmpArousal;
      SugarCube.State.variables.cheatPlus.orgasmCount++;
      if (SugarCube.State.variables.cheatPlus.orgasmCount > 2) {
        SugarCube.State.variables.cheatPlus.unlicumMode = false;
        SugarCube.State.variables.orgasmdown = -1;
        mycode.orgasmdown = -1;
        SugarCube.State.variables.cheatPlus.orgasmCount = 0;
        SugarCube.State.variables.orgasmcurrent = 0;
      }
    }
  },
  unliarousal: function () {
    SugarCube.State.variables.arousal = 10000;
  },
};
