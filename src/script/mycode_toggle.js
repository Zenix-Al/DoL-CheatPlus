let mycode = {
  runitallRestore: function () {
    functionbundle = {};
    toggleActive = [];
    showToast("Error detected in toggle cheat, resetting.");
    errorFunctions = 0;
    progressFunctions = 0;
    totalFunctions = 0;
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
    totalFunctions = keys.length;
    let index = 0;
    function executeNext() {
      if (index >= keys.length) return;
      const key = keys[index++];
      if (typeof functionbundle[key] === "function") {
        functionbundle[key]();
        progressFunctions++;
      }
      requestAnimationFrame(executeNext);
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
    if (!vars?.cheatPlus?.toggles || !id) return;
    const button = document.getElementById(id);
    const isActive = !!this.toggleActive[id]; // Convert to boolean

    this.toggleDeactivated = isActive;
    console.log(id, " ", name);

    if (isActive) {
      delete functionbundle[id];
      delete vars.cheatPlus.toggles[id];
      delete this.toggleActive[id];
      console.log("Deactive!");
    } else {
      if (!reactivatingToggles) extra_notif = true;
      functionbundle[id] = this[id].bind(this);
      functionbundle[id]();
      vars.cheatPlus.toggles[id] = id;
      this.toggleActive[id] = true;
      console.log("Active!");
      extra_notif = false;
    }

    if (button) button.innerHTML = name + (isActive ? "" : "&#10003;");
    this.toggleDeactivated = false;
  },

  checkDateDaily: function () {
    const date = Math.floor(vars?.timeStamp / 86400);
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
    if (!vars?.cheatPlus?.toggles || !id) return;
    const button = document.getElementById(id);
    const isActive = !!this.toggleActiveDaily[id];

    if (isActive) {
      delete dailyfunctionbundle[id];
      delete vars.cheatPlus.toggles[id];
      delete this.toggleActiveDaily[id];
      if (button) button.innerHTML = name;
      console.log("Deactive!");
    } else {
      if (!reactivatingToggles) extra_notif = true;
      dailyfunctionbundle[id] = this[id].bind(this);
      vars.cheatPlus.toggles[id] = id;
      this.toggleActiveDaily[id] = true;
      if (button) button.innerHTML = name + "&#10003;";
      dailyfunctionbundle[id]();
      console.log("Active!");
      extra_notif = false;
    }
  },

  everyone_horny: function () {
    if (vars.NPCName === undefined) return;
    for (let i = 0; i < npcnamelist.length; i++) {
      if (vars.NPCName[i].description != "Ivory Wraith") vars.NPCName[i].lust = 100;
    }
  },

  edenspring: function () {
    vars.edenspring = 4;
  },
  edengarden: function () {
    vars.edengarden = 4;
  },
  edentimer: function () {
    vars.edendays = 0;
  },
  edenshrooms: function () {
    vars.edenshrooms = 4;
  },
  checkArrayTreshold: 0,
  checkArray: function () {
    this.checkArrayTreshold++;
    if (this.checkArrayTreshold <= 10) {
      return;
    }
    this.checkArrayTreshold = 0;
    vars.cheatPlus.arrayCheck = false;
    function processValue(value) {
      if (Array.isArray(value) && value.length == 0) {
        var check = Object.keys(value);
        if (check.length > 0) {
          vars.cheatPlus.arrayCheck = true;
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
    logObjectValues(vars);
  },
  maxchruchtask: function () {
    vars.temple_garden = 100;
    vars.temple_quarters = 100;
    vars.grace = 100;
  },
  maxanimaltask: function () {
    vars.stray_happiness = 100;
  },
  purity: function () {
    vars.purity = 1000;
  },
  virginity: function () {
    if (vars?.player?.virginity === undefined) return;
    vars.player.virginity.penile = true;
    vars.player.virginity.vaginal = true;
  },
  farm_safe: function () {
    if (vars.farm === undefined) return;
    vars.farm.aggro = 0;
  },
  interact_child: function () {
    if (vars?.children && typeof vars.children === "object") {
      for (const key in vars.children) {
        const child = vars.children[key];
        const local = child?.localVariables;

        if (local?.event === true) {
          local.interactions = (local.interactions ?? 0) + 1;
          local.interactionsTotal = (local.interactionsTotal ?? 0) + 1;
          local.event = false;
        }
      }
    }
  },
  total_npc_pregnant: 0,
  pc_pregnant: 0,
  pregnancy_detection: function () {
    if (Object.keys(vars.storedNPCs).length === 0 || vars.NPCName === undefined) return;
    function count_npc() {
      var total = Object.keys(vars.storedNPCs).length;
      if (vars.cheatPlus?.storedNPCs !== undefined)
        total += Object.keys(vars.cheatPlus.storedNPCs).length;
      for (var i = 0; i < vars.NPCName.length; i++) {
        if (vars?.NPCName[i]?.pregnancy?.fetus?.length > 0) {
          total++;
        }
      }
      return total;
    }

    function count_pc() {
      if (
        vars.sexStats?.vagina?.pregnancy?.fetus === undefined ||
        vars.sexStats?.anus?.pregnancy?.fetus === undefined
      )
        return 0;
      return (
        vars.sexStats.vagina.pregnancy.fetus.length + vars.sexStats.anus.pregnancy.fetus.length
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
    if (
      this.named_npc_pregnancy_locked.length == 0 ||
      this.named_npc_pregnancy_locked_day.length == 0
    )
      return;
    for (const key in this.named_npc_pregnancy_locked) {
      var total =
        vars.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timerEnd -
        this.named_npc_pregnancy_locked_day[key] * 3;
      if (total < 0) total = 0;
      vars.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timer = total;
    }
  },
  npc_pregnancy_manager_toggle: function () {
    if (this.npc_pregnancy_locked.length == 0 || this.npc_pregnancy_locked_day.length == 0) return;
    for (const key in this.npc_pregnancy_locked) {
      var total =
        vars.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timerEnd -
        this.npc_pregnancy_locked_day[key] * 3;
      if (total < 0) total = 0;
      vars.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timer = total;
    }
  },
  mc_pregnancy_manager_toggle: function () {
    if (this.mc_pregnancy_locked.length == 0 || this.mc_pregnancy_locked_day.length == 0) return;
    var lap = 0;
    for (const key in this.mc_pregnancy_locked) {
      if (this.mc_pregnancy_locked_type[lap] == "parasite") {
        vars.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.fetus[key].daysLeft =
          this.mc_pregnancy_locked_day[lap];
      } else {
        var timeEnd = vars.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.timerEnd;
        var time = timeEnd - this.mc_pregnancy_locked_day[lap] * 3;
        console.log(time);
        if (time < 0) time = 0;
        vars.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.timer = time;
      }
    }
  },
  invincibleAngel: function () {
    if (extra_notif)
      if (vars?.demon > 0) {
        showToast("Youre a demon!");
        timedToast("but, okay", 3000);
      } else if (vars?.fallenangel > 0) {
        showToast("Im sorry, youre already a fallen angel.");
        timedToast("im turning this off", 3000);
        buttonActions["invincibleAngel"]();
        return;
      }
    if (vars?.penisstate != 0 || vars?.vaginastate != 0) {
      if (!vars?.cheatPlus?.angelMode) return;
      vars.cheatPlus.angel = vars.angel;
      vars.angel = 0;
      vars.angelbuild = 100;
      vars.cheatPlus.angelMode = true;
    } else if (!vars?.cheatPlus?.angelMode) {
      vars.cheatPlus.angelMode = false;
      vars.angel = vars.cheatPlus.angel;
    }
  },
  invinityNPCPregnancy: function () {
    if (vars?.cheatPlus?.storedNPCsDate) return;
    var priorityQueue = 0;
    var waitQueue = 0;
    var limit = 8;
    var tmp = {};
    var store = {};
    var dateLeft = 0;
    var gameTime = vars.timeStamp;
    var date = (gameTime - (gameTime % 86400)) / 86400;
    if (vars.cheatPlus.storedNPCsDate !== 0) {
      dateLeft = (date - vars.cheatPlus.storedNPCsDate) * 3;
    }
    vars.cheatPlus.storedNPCsDate = date;
    for (const key1 in vars.storedNPCs) {
      var left = vars.storedNPCs[key1].pregnancy.timerEnd - vars.storedNPCs[key1].pregnancy.timer;
      if (left <= 3 && priorityQueue <= limit) {
        tmp["stored_" + priorityQueue] = vars.storedNPCs[key1];
        if (priorityQueue == 8)
          showToast("NPC about to give abirth, you cant bustin nuts in people for today!");
        priorityQueue++;
      } else if (left > 3 || priorityQueue > limit) {
        store["stored_" + waitQueue] = vars.storedNPCs[key1];
        waitQueue++;
      }
    }
    for (const key2 in vars.cheatPlus.storedNPCs) {
      var timerEnd = vars.cheatPlus.storedNPCs[key2].pregnancy.timerEnd;
      var timer = vars.cheatPlus.storedNPCs[key2].pregnancy.timer;
      if (dateLeft > 0) {
        vars.cheatPlus.storedNPCs[key2].pregnancy.timer += dateLeft;
        if (vars?.cheatPlus.storedNPCs[key2].pregnancy.timer > timerEnd)
          vars.cheatPlus.storedNPCs[key2].pregnancy.timer = timerEnd;
      }
      var left = timerEnd - timer;
      if (left <= 3 && priorityQueue <= limit) {
        tmp["stored_" + priorityQueue] = vars.cheatPlus.storedNPCs[key2];
        if (priorityQueue == 8)
          showToast("NPC about to give abirth, you cant bustin nuts in people for today!");
        priorityQueue++;
      } else if (left > 3 || priorityQueue > limit) {
        store["stored_" + waitQueue] = vars.cheatPlus.storedNPCs[key2];
        waitQueue++;
      }
    }
    vars.storedNPCs = tmp;
    vars.cheatPlus.storedNPCs = store;
  },
  updateUserDivine: function () {
    if (vars?.penisstate != 0 || vars?.vaginastate != 0) return;
    if (vars?.demon > 0) {
      vars.cheatPlus.trueDivine = "demon";
    } else if (vars?.angel > 0) {
      vars.cheatPlus.trueDivine = "angel";
    }
  },
  initNPCinstapreg: false,
  allNPCInstaPregnant: function () {
    if (mycode.toggleDeactivated) {
      vars.baseNpcPregnancyChance = vars.cheatPlus.baseNpcPregnancyChance;
      if (vars?.baseNpcPregnancyChance > 16) vars.baseNpcPregnancyChance = 16;
      mycode.initNPCinstapreg = false;
      return;
    }
    if (!mycode.initNPCinstapreg) {
      mycode.initNPCinstapreg = true;
      vars.cheatPlus.baseNpcPregnancyChance = vars.baseNpcPregnancyChance;
      vars.baseNpcPregnancyChance = 19;
    }
    for (var i = 0; i < vars.NPCList.length; i++) {
      if (vars?.NPCList[i].pregnancyAvoidance > 0) {
        vars.NPCList[i].pregnancyAvoidance = 0;
      }
    }
  },
  allNPCMultiplePregnancy: function () {
    if (vars.NPCList === undefined) return;
    for (var i = 0; i < vars.NPCList.length; i++) {
      if (vars?.NPCList[i].pregnancy === 1) {
        vars.NPCList[i].pregnancy = 0;
      }
    }
  },
  tmpArousal: 0,
  orgasmdown: 0,
  unlicum: function () {
    if (vars.semen_amount < vars.semen_volume) {
      vars.semen_amount = vars.semen_volume;
      vars.orgasmcount = 0;
    }
  },
  intenseCum: function () {
    if (vars.orgasmcurrent != 0 && !vars.cheatPlus.unlicumMode) {
      vars.cheatPlus.orgasmcount = 0;
      mycode.tmpArousal = vars.arousal;
      vars.orgasmdown = 1000;
      mycode.orgasmdown = 1000;
      vars.cheatPlus.unlicumMode = true;
    } else if (vars.orgasmdown < mycode.orgasmdown && vars.cheatPlus.unlicumMode) {
      mycode.orgasmdown = vars.orgasmdown;
      vars.arousal = mycode.tmpArousal;
      vars.cheatPlus.orgasmCount++;
      if (vars.cheatPlus.orgasmCount > 2) {
        vars.cheatPlus.unlicumMode = false;
        vars.orgasmdown = -1;
        mycode.orgasmdown = -1;
        vars.cheatPlus.orgasmCount = 0;
        vars.orgasmcurrent = 0;
      }
    }
  },
  unliarousal: function () {
    vars.arousal = 10000;
  },
};
