//generate interface (ids, inputs, textInputs)
//quick
function init_interface() {
  generatetext(
    ["", "", "", "info_cheat"],
    ["text", "text", "text", "tooltip"],
    ["Tested on :" + testedOn, "Current ver :" + curVer, isCheatWorkSymbol, isCheatWork],
    "quick-content"
  );

  generatetext([""], ["newline"], [""], "quick-content");
  generatetext([""], ["header"], ["Quick cheat"], "quick-content");
  generatetext(
    ["", "arousal_val", "arousal_preview", "arousal_player", "arousal_enemy"],
    ["text", "range", "button", "button", "button"],
    ["Arousal", 100, 0, "Player", "Enemy"],
    "quick-content"
  );
  generatetext(
    ["", "hesoyam", "kill_player"],
    ["text", "button", "button"],
    ["Player state", "Recover", "Ruin"],
    "quick-content"
  );
  generatetext(
    ["", "enemycalm", "kill_enemy"],
    ["text", "button", "button"],
    ["Enemy state", "Recover", "Ruin"],
    "quick-content"
  );
  generatetext(
    ["", "crimecurrent", "sheesh", "jk-lol"],
    ["text", "button", "button", "button"],
    ["Crime : ", "0", "-100", "+100"],
    "quick-content"
  );
  generatetext(["", "vow-virgin"], ["text", "button"], ["chruch vow", "Virgin"], "quick-content");
  generatetext(
    ["", "clean_cum", "dirty_cum", "clean_cum_uretus"],
    ["text", "button", "button", "button"],
    ["Hygiene", "Clean", "dirty", "clean uretus cum"],
    "quick-content"
  );
  generatetext(
    ["", "in_game_cheat", "alt_cheat"],
    ["text", "button", "button"],
    ["In game cheat", "Enable", ""],
    "quick-content"
  );
  generatetext(
    ["", "randomEncounterSet"],
    ["text", "button"],
    ["Random encounter", "Enabled"],
    "quick-content"
  );
  generatetext([""], ["newline"], [""], "quick-content");

  generatetext([""], ["header"], ["Unlimited Toggles"], "quick-content");
  generatetext(
    ["", "maxchruchtask", "maxanimaltask"],
    ["text", "button", "button"],
    ["Tasks", "Chruch", "Stray"],
    "quick-content"
  );
  generatetext(
    ["", "edenshrooms", "edengarden", "edenspring", "edentimer"],
    ["text", "button", "button", "button", "button"],
    ["Eden Tasks", "Shroom", "Garden", "Spring", "Timer"],
    "quick-content"
  );
  generatetext(
    ["", "everyone_horny"],
    ["text", "button"],
    ["Everyone is horny", "Horny"],
    "quick-content"
  );
  generatetext(["", "farm_safe"], ["text", "button"], ["Farm safety", "Safe"], "quick-content");
  generatetext(
    ["", "unlicum", "unliarousal", "intenseCum"],
    ["text", "button", "button", "button"],
    ["Unlimited", "cum", "arousal", "intense cum"],
    "quick-content"
  );
  generatetext(
    ["", "virginity", "purity"],
    ["text", "button", "button"],
    ["Maintain pure", "virgin", "pure"],
    "quick-content"
  );
  generatetext(
    ["", "invincibleAngel", "invincibleAngelInfo"],
    ["text", "button", "tooltip"],
    [
      "Invincible Angel",
      "Activate",
      "it will prevent angel build progress lower or become fallen.(combine it with pure cheat)",
    ],
    "quick-content"
  );
  generatetext(
    ["", "interact_child", "info_interact_child"],
    ["text", "button", "tooltip"],
    ["Auto Child Interact ", "Auto", "you must visit your baby first to trigger it."],
    "quick-content"
  );
  generatetext(
    ["", "pc_pregnancy", "npc_pregnancy", "pregnancy_detection"],
    ["text", "button", "button", "button"],
    ["pregnancy detection ", "pc=0", "NPC=0", "Activate"],
    "quick-content"
  );
  generatetext(
    ["", "invinityNPCPregnancy", "invinityNPCPregnancyInfo"],
    ["text", "button", "tooltip"],
    [
      "Infinite NPC pregnancy ",
      "Activate",
      "It will store pregnancy on the cheat untill it reach 1 day before give birth.",
    ],
    "quick-content"
  );
  generatetext(
    ["", "allNPCInstaPregnant", "allNPCInstaPregnantInfo"],
    ["text", "button", "tooltip"],
    [
      "NPC max pregnancy rate",
      "Activate",
      "NPC has 100% pregnancy rate. some npc might cannot impregnated at all. Multiple pregnancy allows you to impregnated everyone multiple times.",
    ],
    "quick-content"
  );
  generatetext(
    ["", "allNPCMultiplePregnancy", "allNPCMultiplePregnancyInfo"],
    ["text", "button", "tooltip"],
    ["NPC multiple pregnancys", "Activate", "Allows you to impregnated NPCs multiple times."],
    "quick-content"
  );
  //generatetext(['', 'demonForcedPregnancy', 'demonForcedPregnancyInof'], ['text', 'button', 'tooltip'], ['Demon sex','Activate','It will make you temporarely demon during sex(demon ability to force pregnancy).'], 'quick-content');

  generatetext([""], ["newline"], [""], "quick-content");
  if (isServer === 1) {
    generatetext([""], ["header"], ["Server"], "quick-content");
    if (curVer != testedOn)
      generatetext(
        ["", "server_save_info"],
        ["text", "tooltip"],
        [
          "caution! game version is different",
          "Lower version or moded version could potentially cause problem.",
        ],
        "quick-content"
      );
    generatetext(
      ["", "save_data", "load_data", "serversaveinfo"],
      ["text", "button", "button", "tooltip"],
      [
        "Server Save",
        "Export",
        "Import",
        "this will export all of your save data (1-10) to the local server, allows you to import it anywhere else in the same local network",
      ],
      "quick-content"
    );
    generatetext([""], ["newline"], [""], "quick-content");
  }

  generatetext([""], ["newline"], [""], "quick-content");
  generatetext(
    ["", downloadSite, sourceCode],
    ["text", "link", "link"],
    ["cheat ver : " + cheatVer + " " + cheatVerType, "Check for update", "Source Code"],
    "quick-content"
  );
  //stats
  generatetext([""], ["header"], ["Stats"], "stats-content");
  generatetext(
    ["hesoyam", "kill_player"],
    ["button", "button"],
    ["Recover", "Ruin"],
    "stats-content"
  );
  generatetext(
    ["statpick", "statinput", "statset"],
    ["select", "input", "button"],
    [
      [
        "pain",
        "arousal",
        "tiredness",
        "stress",
        "trauma",
        "control",
        "drunk",
        "drugged",
        "hallucinogen",
      ],
      "",
      "set",
    ],
    "stats-content"
  );
  generatetext([""], ["newline"], [""], "stats-content");

  generatetext([""], ["header"], ["Enemy stats"], "stats-content");
  generatetext(
    ["enemycalm", "kill_enemy"],
    ["button", "button"],
    ["Recover", "Ruin"],
    "stats-content"
  );
  generatetext(
    ["statpicke", "statinpute", "statsete"],
    ["select", "input", "button"],
    [["enemyhealth", "enemytrust", "enemyanger"], "", "set"],
    "stats-content"
  );
  generatetext([""], ["newline"], [""], "stats-content");
  generatetext([""], ["header"], ["Player"], "stats-content");
  generatetext(
    ["", "moneyinput", "moneyset"],
    ["text", "input", "button"],
    ["Money", "", "set"],
    "stats-content"
  );
  generatetext(["", "sprayset"], ["text", "button"], ["Unlimited spray", "set"], "stats-content");
  generatetext(
    ["", "bodycurrent", "bodypick", "bodyset"],
    ["text", "button", "select", "button"],
    ["Body Size : ", "", ["Tiny", "Small", "Normal", "Large"], "set"],
    "stats-content"
  );
  generatetext(
    ["", "bodytypecurrent", "bodytypepick", "bodytypeset"],
    ["text", "button", "select", "button"],
    ["Natural features : ", "", ["Masculine", "Feminine", "Androgynous"], "set"],
    "stats-content"
  );
  generatetext(["", "ballsset"], ["text", "button"], ["Balls : ", "Remove"], "stats-content");
  generatetext(
    ["", "virginitypick", "virginitycurrent", "virginityset", "virginpure"],
    ["text", "select", "button", "button", "button"],
    [
      "Virginity : ",
      ["anal", "oral", "penile", "vaginal", "temple", "handholding", "kiss"],
      "",
      "Restore",
      "pure",
    ],
    "stats-content"
  );
  generatetext(
    ["", "sheesh", "jk-lol"],
    ["text", "button", "button"],
    ["Crime", "-100", "+100"],
    "stats-content"
  );
  generatetext(
    ["", "parasitename", "bodyparts", "infect", "desinfect"],
    ["text", "select", "select", "button", "button"],
    ["Parasite", parasitename, bodyparts, "infect", "remove"],
    "stats-content"
  );
  generatetext([""], ["newline"], [""], "stats-content");
  generatetext([""], ["header"], ["Characteristics"], "stats-content");
  generatetext(
    ["charapick", "charainput", "charaset"],
    ["select", "input", "button"],
    [characteristics, "", "set"],
    "stats-content"
  );
  generatetext(["", "lactatingset"], ["text", "button"], ["lactating : ", "Yes"], "stats-content");
  generatetext(
    ["", "milkinput", "milkset", "milkrefil"],
    ["text", "input", "button", "button"],
    ["milk volume", "", "set", "Refil"],
    "stats-content"
  );
  generatetext(
    ["", "cuminput", "cumset", "cumrefil"],
    ["text", "input", "button", "button"],
    ["cum volume", "", "set", "Refil"],
    "stats-content"
  );
  generatetext([""], ["newline"], [""], "stats-content");
  generatetext([""], ["header"], ["Fame"], "stats-content");
  generatetext(
    ["fame_name", "input_fame12", "set_fame12"],
    ["select", "input", "button"],
    [fame, "", "Set"],
    "stats-content"
  );
  generatetext([""], ["newline"], [""], "stats-content");
  generatetext([""], ["header"], ["School"], "stats-content");
  generatetext(
    ["", "select_exam", "input_exam", "set_exam"],
    ["text", "select", "input", "button"],
    ["Exam", exam, "", "Set"],
    "stats-content"
  );
  generatetext(
    ["", "select_school_rep", "input_school_rep", "set_school_rep"],
    ["text", "select", "input", "button"],
    ["School reputation", school_rep, "", "Set"],
    "stats-content"
  );
  generatetext([""], ["newline"], [""], "stats-content");
  generatetext([""], ["header"], ["Talent"], "stats-content");
  generatetext(
    ["", "select_talent", "input_talent", "set_talent"],
    ["text", "select", "input", "button"],
    ["Talent", talent_skill, "", "Set"],
    "stats-content"
  );
  generatetext(
    ["", "select_hentai_skill", "input_hentai_skill", "set_hentai_skill"],
    ["text", "select", "input", "button"],
    ["Ero Talent", hentaiSkill, "", "Set"],
    "stats-content"
  );
  //misc
  generatetext([""], ["header"], ["NPC"], "misc-content");
  generatetext(
    ["", "npcnames", "npctraits", "npcchangeinput", "changetraitbro"],
    ["text", "select", "select", "input", "button"],
    ["NPC manager", npcnamelist, npctrait, "", "Set"],
    "misc-content"
  );
  generatetext(
    ["", "max_harmony", "max_Ferocity"],
    ["text", "button", "button"],
    ["wolfpack", "max harmony", "max Ferocity"],
    "misc-content"
  );
  generatetext([""], ["newline"], [""], "misc-content");
  generatetext([""], ["header"], ["Pregnancy Manager"], "misc-content");
  generatetext(
    ["", "pregnancy_manager_time_tooltip"],
    ["header", "tooltip"],
    ["Pregnancy time", "day"],
    "misc-content"
  );
  generatetext(
    [
      "",
      "named_npc_pregnancy_manager",
      "named_npc_pregnancy_input",
      "named_npc_pregnancy_toggle",
      "named_npc_pregnancy_set",
    ],
    ["text", "select", "input", "checkbox", "button"],
    ["Named NPC", ["placeholder"], "", "lock preg", "Set"],
    "misc-content"
  );
  generatetext(
    [
      "",
      "npc_pregnancy_manager",
      "npc_pregnancy_input",
      "npc_pregnancy_toggle",
      "npc_pregnancy_set",
    ],
    ["text", "select", "input", "checkbox", "button"],
    ["NPC", ["placeholder"], "", "lock preg", "Set"],
    "misc-content"
  );
  generatetext(
    [
      "",
      "mc_pregnancy_hole",
      "mc_pregnancy_manager",
      "mc_pregnancy_input",
      "mc_pregnancy_toggle",
      "mc_pregnancy_set",
    ],
    ["text", "select", "select", "input", "checkbox", "button"],
    ["Player", ["vagina", "anus"], ["placeholder"], "", "lock preg", "Set"],
    "misc-content"
  );
  generatetext([""], ["header"], ["MC Offspring"], "misc-content");
  generatetext(
    [
      "",
      "mc_tentacle_location",
      "mc_tentacle_select",
      "mc_tentacle_input",
      "mc_tentacle_set",
      "mc_tentacle_tooltip",
    ],
    ["text", "select", "select", "input", "button", "tooltip"],
    [
      "Tentacle Speed",
      ["home", "lake", "farm"],
      ["placeholder"],
      "",
      "Set",
      "The lower the better",
    ],
    "misc-content"
  );
  generatetext(
    [
      "",
      "mc_baby_select",
      "mc_baby_tooltip",
      "mc_baby_action_select",
      "mc_baby_input",
      "mc_baby_set",
      "purgeNPCBaby",
      "purgeNPCBabyInfo",
    ],
    ["text", "select", "tooltip", "select", "checkbox", "button", "button", "tooltip"],
    [
      "Baby",
      ["placeholder"],
      "placeholder",
      babyOptions,
      "",
      "Set",
      "Purge",
      "Purging your baby also inclduing Named npc (eg. alex).",
    ],
    "misc-content"
  );

  generatetext([""], ["header"], ["Abortion"], "misc-content");
  generatetext(
    ["", "mc_abortion_location", "mc_abortion_select", "mc_abortion_checkbox", "mc_abortion_set"],
    ["text", "select", "select", "checkbox", "button"],
    ["MC", ["anus", "vagina"], ["placeholder"], "", "Set"],
    "misc-content"
  );
  generatetext(
    [
      "",
      "named_npc_abortion_chara_select",
      "named_npc_abortion_select",
      "named_npc_abortion_checkbox",
      "named_npc_abortion_set",
    ],
    ["text", "select", "select", "checkbox", "button"],
    ["Named NPC", npcnamelist, babyOptions, "", "Set"],
    "misc-content"
  );
  generatetext(
    [
      "",
      "npc_abortion_chara_select",
      "npc_abortion_select",
      "npc_abortion_checkbox",
      "npc_abortion_set",
      "npc_abortion_purge",
    ],
    ["text", "select", "select", "checkbox", "button", "button"],
    ["NPC", ["placeholder"], ["placeholder"], "", "Set", "Purge"],
    "misc-content"
  );

  generatetext([""], ["newline"], [""], "misc-content");
  generatetext([""], ["header"], ["Farm"], "misc-content");
  generatetext(
    ["", "placeholder_fruits", "check_fruit_selling"],
    ["text", "button", "button"],
    ["Vegetables in process", "Fruits here", "Check"],
    "misc-content"
  );
  generatetext(
    ["", "assault_time", "set_assault_time"],
    ["text", "input", "button"],
    ["Assault day", "", "set"],
    "misc-content"
  );
  generatetext(
    ["", "build_time", "set_build_time"],
    ["text", "input", "button"],
    ["build time", "", "set"],
    "misc-content"
  );
  generatetext(
    ["", "animal_choice", "animal_input", "set_animal_like"],
    ["text", "select", "input", "button"],
    ["animals like", animals, "", "set"],
    "misc-content"
  );
  generatetext([""], ["newline"], [""], "misc-content");
  generatetext([""], ["header"], ["Misc"], "misc-content");
  generatetext(
    ["", "VrelCoinsUsage"],
    ["text", "button"],
    ["Vrel Coins Usage 0", "Set"],
    "misc-content"
  );
  generatetext([""], ["newline"], [""], "misc-content");
  generatetext([""], ["header"], ["accessibility"], "misc-content");
  generatetext(
    ["", "Enable_cheat_history", "info_cheat_history"],
    ["text", "button", "tooltip"],
    [
      "Enable history button",
      "Enable",
      "will enable history button beside cheat button. recommended for mobile user.",
    ],
    "misc-content"
  );
  generatetext(
    ["", "Enable_sidebar_button", "info_sidebar_button"],
    ["text", "button", "tooltip"],
    [
      "Enable sidebar button",
      "Enable",
      "will enable sidebar button beside cheat button. recommended for mobile user.",
    ],
    "misc-content"
  );
  generatetext(
    ["", "simple_cheat_button", "info_cheat_button"],
    ["text", "button", "tooltip"],
    [
      "simple cheat button",
      "Enable",
      "will makes cheat button simpler. recommended for mobile user.",
    ],
    "misc-content"
  );
  generatetext([""], ["newline"], [""], "misc-content");
  generatetext([""], ["header"], ["Debug"], "misc-content");
  generatetext(
    ["", "tmpText", "ArrayChecker", "infoArrayChecker", "infoArrayChecker2"],
    ["text", "input", "button", "tooltip", "tooltip"],
    [
      "Array error fix",
      "",
      "Check",
      "This is array checker, this is useful if you use server save/in game export save feature. Due to server save export and in game save export is using json format to export, array with string index will left blank, making some data in your save file gone.",
      "How to use : open browser console by pressing f12 and press check and paste it in the browser console and then press enter.",
    ],
    "misc-content"
  );
  generatetext(
    ["", "auto_check_status", "checkArray", "infoCheckArray"],
    ["text", "button", "button", "tooltip"],
    ["Auto Array Check", "unknown", "Scan", "check for further array error(might cause lag)"],
    "misc-content"
  );
  generatetext(
    ["", "search_type", "search_value", "search123", "search456"],
    ["text", "select", "input", "button", "button"],
    ["Search", [0, 1, 2], "", "Deep", "quick"],
    "misc-content"
  );
  generatetext(["search_result"], ["textarea"], ["placeholder"], "misc-content");
  generatetext(
    ["", "stringJS", "stringValue", "stingJSSet", "stingJSHelp"],
    ["text", "input", "input", "button", "tooltip"],
    [
      "String to JS",
      "",
      "",
      "Set",
      '1st input is the js path example "SugarCube.State.variables", the 2nd one is value. Be cautious you might edit wrong variable that might cause the game broken.',
    ],
    "misc-content"
  );
  generatetext(
    ["", "testAll", "Test every function"],
    ["text", "button", "tooltip"],
    ["Test cheats", "Test", "will test all functions"],
    "misc-content"
  );
  var element = document.getElementById("tmpText");
  element.classList.add("tmpText");
}
