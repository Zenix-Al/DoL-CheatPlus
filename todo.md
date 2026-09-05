list of rough architecture and inconsitency i notice before i told ai to make plan for it :
- The project seems to be a userscript for a game called "DoL Cheat Plus" or "DoL Companion Panel".
- The lack of build path for injector, it still require manual copy paste of the built userscript to the injector folder, which is not ideal for automation.
- cheats and features folder are doing the same, needs to be organized better.
- cheats folder doing more than defining cheats, other than cheats or helper should be in core, utils or somewhere else, not in cheats folder.
- same goes for features folder, we need to determine if we should keep it or move it to core or utils, or even merge it with cheats folder.
- what the hell diagnostics folder for?
- the docs is still sucks, many md is scattered across src folder, we need to move them to docs folder and organize them better.
- Better builder. we need those, needs to see my other project as reference to make a better builder, the current one is not good enough.
- make agents.md, rules.md so ai wont be stupid when working on the project, and also make it easier for new contributors to understand the project.
- when docs done, from how to make cheats, how to make feature if it still there, how to make cheat outside sugarcube, the architecture of the prject, how to use the builder, how to use the injector, how to use the cheat panel, how to use the cheat panel in different browsers, how to test the cheat panel, how to debug the cheat panel, how to contribute to the project, etc. we need update the readme to point to the docs folder and make it easier for new contributors to understand the project.


overall the final product isnt get affected by this, but the project structure and organization is a mess, and it will be hard for new contributors to understand the project and contribute to it. we need to fix this before we can move forward with the project.