import {
  getButtonActions,
  getFunctionBundle,
  getVars,
  getMycode,
  showToast,
  timedToast,
} from '../../services/cheat-runtime.js';

const toggleRuntime = {
  runitallRestore: function () {
    globalThis.functionbundle = {};
    this.toggleActive = [];
    showToast('Error detected in toggle cheat, resetting.');
    globalThis.errorFunctions = 0;
    globalThis.progressFunctions = 0;
    globalThis.totalFunctions = 0;
    globalThis.reactivateToggles();
    showToast('Complete.');
  },

  runitall: function () {
    if (globalThis.isLoad) return;
    if (globalThis.totalFunctions !== globalThis.progressFunctions) {
      globalThis.errorFunctions++;
      if (globalThis.errorFunctions > 5) {
        this.runitallRestore();
      }
      return;
    }
    globalThis.errorFunctions = 0;
    globalThis.progressFunctions = 0;
    globalThis.totalFunctions = 0;

    const bundle = getFunctionBundle();
    const keys = Object.keys(bundle);
    if (!keys.length) return;
    globalThis.totalFunctions = keys.length;
    let index = 0;

    function executeNext() {
      if (index >= keys.length) return;
      const key = keys[index++];
      if (typeof bundle[key] === 'function') {
        bundle[key]();
        globalThis.progressFunctions++;
      }
      requestAnimationFrame(executeNext);
    }

    executeNext();

    globalThis.clickCounter--;
    if (globalThis.clickCounter > 0) {
      setTimeout(() => this.runitall(), 10);
    }

    this.checkDateDaily();
  },

  toggleActive: [],
  toggleDeactivated: false,
  toggle: function (id, name) {
    const vars = getVars();
    if (!vars?.cheatPlus?.toggles || !id) return;
    const button = document.getElementById(id);
    const isActive = !!this.toggleActive[id];

    this.toggleDeactivated = isActive;

    if (isActive) {
      delete globalThis.functionbundle[id];
      delete vars.cheatPlus.toggles[id];
      delete this.toggleActive[id];
    } else {
      if (!globalThis.reactivatingToggles) globalThis.extra_notif = true;
      globalThis.functionbundle[id] = this[id].bind(this);
      globalThis.functionbundle[id]();
      vars.cheatPlus.toggles[id] = id;
      this.toggleActive[id] = true;
      globalThis.extra_notif = false;
    }

    if (button) button.innerHTML = name + (isActive ? '' : '&#10003;');
    this.toggleDeactivated = false;
  },

  checkDateDaily: function () {
    const vars = getVars();
    const date = Math.floor(vars?.timeStamp / 86400);
    if (globalThis.curDate !== date) {
      globalThis.curDate = date;
      this.runitallDaily();
    }
  },

  toggleActiveDaily: {},
  runitallDaily: function () {
    Object.keys(globalThis.dailyfunctionbundle).forEach((key) => {
      if (typeof globalThis.dailyfunctionbundle[key] === 'function') {
        globalThis.dailyfunctionbundle[key]();
      }
    });
  },

  toggleDaily: function (id, name) {
    const vars = getVars();
    if (!vars?.cheatPlus?.toggles || !id) return;
    const button = document.getElementById(id);
    const isActive = !!this.toggleActiveDaily[id];

    if (isActive) {
      delete globalThis.dailyfunctionbundle[id];
      delete vars.cheatPlus.toggles[id];
      delete this.toggleActiveDaily[id];
      if (button) button.innerHTML = name;
    } else {
      if (!globalThis.reactivatingToggles) globalThis.extra_notif = true;
      globalThis.dailyfunctionbundle[id] = this[id].bind(this);
      vars.cheatPlus.toggles[id] = id;
      this.toggleActiveDaily[id] = true;
      if (button) button.innerHTML = name + '&#10003;';
      globalThis.dailyfunctionbundle[id]();
      globalThis.extra_notif = false;
    }
  },

  everyone_horny: function () {
    const vars = getVars();
    if (vars.NPCName === undefined) return;
    for (let index = 0; index < globalThis.npcnamelist.length; index++) {
      if (vars.NPCName[index].description !== 'Ivory Wraith') vars.NPCName[index].lust = 100;
    }
  },

  edenspring: function () {
    getVars().edenspring = 4;
  },
  edengarden: function () {
    getVars().edengarden = 4;
  },
  edentimer: function () {
    getVars().edendays = 0;
  },
  edenshrooms: function () {
    getVars().edenshrooms = 4;
  },
  checkArrayTreshold: 0,
  checkArray: function () {
    const vars = getVars();
    this.checkArrayTreshold++;
    if (this.checkArrayTreshold <= 10) return;

    this.checkArrayTreshold = 0;
    vars.cheatPlus.arrayCheck = false;

    function processValue(value) {
      if (Array.isArray(value) && value.length === 0) {
        const check = Object.keys(value);
        if (check.length > 0) {
          vars.cheatPlus.arrayCheck = true;
          showToast('Broken array has been found!');
          return;
        }
      } else if (Array.isArray(value)) {
        logArrayValues(value);
      } else if (typeof value === 'object' && value !== null) {
        logObjectValues(value);
      }
    }

    function logObjectValues(obj) {
      for (const key in obj) {
        processValue(obj[key]);
      }
    }

    function logArrayValues(obj) {
      for (let index = 0; index < obj.length; index++) {
        processValue(obj[index]);
      }
    }

    logObjectValues(vars);
  },
  maxchruchtask: function () {
    const vars = getVars();
    vars.temple_garden = 100;
    vars.temple_quarters = 100;
    vars.grace = 100;
  },
  maxanimaltask: function () {
    getVars().stray_happiness = 100;
  },
  purity: function () {
    getVars().purity = 1000;
  },
  virginity: function () {
    const vars = getVars();
    if (vars?.player?.virginity === undefined) return;
    vars.player.virginity.penile = true;
    vars.player.virginity.vaginal = true;
  },
  farm_safe: function () {
    const vars = getVars();
    if (vars.farm === undefined) return;
    vars.farm.aggro = 0;
  },
  interact_child: function () {
    const vars = getVars();
    if (vars?.children && typeof vars.children === 'object') {
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
    const vars = getVars();
    if (Object.keys(vars.storedNPCs).length === 0 || vars.NPCName === undefined) return;

    function countNpc() {
      let total = Object.keys(vars.storedNPCs).length;
      if (vars.cheatPlus?.storedNPCs !== undefined) {
        total += Object.keys(vars.cheatPlus.storedNPCs).length;
      }
      for (let index = 0; index < vars.NPCName.length; index++) {
        if (vars?.NPCName[index]?.pregnancy?.fetus?.length > 0) total++;
      }
      return total;
    }

    function countPc() {
      if (
        vars.sexStats?.vagina?.pregnancy?.fetus === undefined ||
        vars.sexStats?.anus?.pregnancy?.fetus === undefined
      ) {
        return 0;
      }
      return (
        vars.sexStats.vagina.pregnancy.fetus.length + vars.sexStats.anus.pregnancy.fetus.length
      );
    }

    const nextNpc = countNpc();
    const nextPc = countPc();

    if (this.total_npc_pregnant === 0) {
      this.total_npc_pregnant = nextNpc;
      this.pc_pregnant = nextPc;
      return;
    }

    if (nextNpc > this.total_npc_pregnant) {
      showToast('NPC is impregnated!');
      this.invinityNPCPregnancy();
      this.total_npc_pregnant = nextNpc;
    } else if (nextNpc < this.total_npc_pregnant) {
      showToast("NPC's baby has been born!");
      this.invinityNPCPregnancy();
      this.total_npc_pregnant = nextNpc;
    }

    if (nextPc > this.pc_pregnant) {
      showToast('MC is impregnated!');
      this.pc_pregnant = nextPc;
    } else if (nextPc < this.pc_pregnant) {
      showToast('your baby has been born!!');
      this.pc_pregnant = nextPc;
    }
  },
  named_npc_pregnancy_manager_toggle: function () {
    const vars = getVars();
    if (
      this.named_npc_pregnancy_locked.length === 0 ||
      this.named_npc_pregnancy_locked_day.length === 0
    ) {
      return;
    }
    for (const key in this.named_npc_pregnancy_locked) {
      let total =
        vars.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timerEnd -
        this.named_npc_pregnancy_locked_day[key] * 3;
      if (total < 0) total = 0;
      vars.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timer = total;
    }
  },
  npc_pregnancy_manager_toggle: function () {
    const vars = getVars();
    if (this.npc_pregnancy_locked.length === 0 || this.npc_pregnancy_locked_day.length === 0) {
      return;
    }
    for (const key in this.npc_pregnancy_locked) {
      let total =
        vars.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timerEnd -
        this.npc_pregnancy_locked_day[key] * 3;
      if (total < 0) total = 0;
      vars.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timer = total;
    }
  },
  mc_pregnancy_manager_toggle: function () {
    const vars = getVars();
    if (this.mc_pregnancy_locked.length === 0 || this.mc_pregnancy_locked_day.length === 0) return;

    let offset = 0;
    for (const key in this.mc_pregnancy_locked) {
      if (this.mc_pregnancy_locked_type[offset] === 'parasite') {
        vars.sexStats[this.mc_pregnancy_locked_hole[offset]].pregnancy.fetus[key].daysLeft =
          this.mc_pregnancy_locked_day[offset];
      } else {
        const timeEnd = vars.sexStats[this.mc_pregnancy_locked_hole[offset]].pregnancy.timerEnd;
        let time = timeEnd - this.mc_pregnancy_locked_day[offset] * 3;
        if (time < 0) time = 0;
        vars.sexStats[this.mc_pregnancy_locked_hole[offset]].pregnancy.timer = time;
      }
      offset++;
    }
  },
  invincibleAngel: function () {
    const vars = getVars();
    const buttonActions = getButtonActions();
    if (globalThis.extra_notif) {
      if (vars?.demon > 0) {
        showToast('Youre a demon!');
        timedToast('but, okay', 3000);
      } else if (vars?.fallenangel > 0) {
        showToast('Im sorry, youre already a fallen angel.');
        timedToast('im turning this off', 3000);
        buttonActions['invincibleAngel']();
        return;
      }
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
    const vars = getVars();
    if (vars?.cheatPlus?.storedNPCsDate) return;
    let priorityQueue = 0;
    let waitQueue = 0;
    const limit = 8;
    const activeNpcStore = {};
    const waitingNpcStore = {};
    let dateLeft = 0;
    const gameTime = vars.timeStamp;
    const date = (gameTime - (gameTime % 86400)) / 86400;

    if (vars.cheatPlus.storedNPCsDate !== 0) {
      dateLeft = (date - vars.cheatPlus.storedNPCsDate) * 3;
    }
    vars.cheatPlus.storedNPCsDate = date;

    for (const key in vars.storedNPCs) {
      const left = vars.storedNPCs[key].pregnancy.timerEnd - vars.storedNPCs[key].pregnancy.timer;
      if (left <= 3 && priorityQueue <= limit) {
        activeNpcStore['stored_' + priorityQueue] = vars.storedNPCs[key];
        if (priorityQueue === 8) {
          showToast('NPC about to give abirth, you cant bustin nuts in people for today!');
        }
        priorityQueue++;
      } else {
        waitingNpcStore['stored_' + waitQueue] = vars.storedNPCs[key];
        waitQueue++;
      }
    }

    for (const key in vars.cheatPlus.storedNPCs) {
      const timerEnd = vars.cheatPlus.storedNPCs[key].pregnancy.timerEnd;
      const timer = vars.cheatPlus.storedNPCs[key].pregnancy.timer;
      if (dateLeft > 0) {
        vars.cheatPlus.storedNPCs[key].pregnancy.timer += dateLeft;
        if (vars.cheatPlus.storedNPCs[key].pregnancy.timer > timerEnd) {
          vars.cheatPlus.storedNPCs[key].pregnancy.timer = timerEnd;
        }
      }
      const left = timerEnd - timer;
      if (left <= 3 && priorityQueue <= limit) {
        activeNpcStore['stored_' + priorityQueue] = vars.cheatPlus.storedNPCs[key];
        if (priorityQueue === 8) {
          showToast('NPC about to give abirth, you cant bustin nuts in people for today!');
        }
        priorityQueue++;
      } else {
        waitingNpcStore['stored_' + waitQueue] = vars.cheatPlus.storedNPCs[key];
        waitQueue++;
      }
    }

    vars.storedNPCs = activeNpcStore;
    vars.cheatPlus.storedNPCs = waitingNpcStore;
  },
  updateUserDivine: function () {
    const vars = getVars();
    if (vars?.penisstate != 0 || vars?.vaginastate != 0) return;
    if (vars?.demon > 0) {
      vars.cheatPlus.trueDivine = 'demon';
    } else if (vars?.angel > 0) {
      vars.cheatPlus.trueDivine = 'angel';
    }
  },
  initNPCinstapreg: false,
  allNPCInstaPregnant: function () {
    const vars = getVars();
    const mycode = getMycode();
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
    for (let index = 0; index < vars.NPCList.length; index++) {
      if (vars?.NPCList[index].pregnancyAvoidance > 0) {
        vars.NPCList[index].pregnancyAvoidance = 0;
      }
    }
  },
  allNPCMultiplePregnancy: function () {
    const vars = getVars();
    if (vars.NPCList === undefined) return;
    for (let index = 0; index < vars.NPCList.length; index++) {
      if (vars?.NPCList[index].pregnancy === 1) {
        vars.NPCList[index].pregnancy = 0;
      }
    }
  },
  tmpArousal: 0,
  orgasmdown: 0,
  unlicum: function () {
    const vars = getVars();
    if (vars.semen_amount < vars.semen_volume) {
      vars.semen_amount = vars.semen_volume;
      vars.orgasmcount = 0;
    }
  },
  intenseCum: function () {
    const vars = getVars();
    const mycode = getMycode();
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
    getVars().arousal = 10000;
  },
};

export default toggleRuntime;
