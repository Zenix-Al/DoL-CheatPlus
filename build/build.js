const fs = require("fs");
const path = require("path");
const uglifyJS = require("uglify-js");
const CleanCSS = require("clean-css");

const requiredFiles = fs.readFileSync("src/required.ini", "utf-8").split(/\r?\n/);

// Step 1: Check if all required files exist
for (const file of requiredFiles) {
  const filePath = path.join("src", file.trim()); // Ensure correct path
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${filePath}`);
    process.exit(1);
  }
}
// Ensure _compiled and its subfolders exist
const folders = [
  "_compiled",
  "_compiled/nwjs/www/cheat",
  "_compiled/dolp",
  "_compiled/vanilla",
  "_compiled/online",
  "_compiled/publish",
];
folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`✅ Created folder: ${folder}`);
  }
});
console.log("All required files are present.");

// Step 2: Minify CSS
const cssInput = fs.readFileSync("src/script/main.css", "utf-8");

const minifiedCSS = new CleanCSS().minify(cssInput).styles;
fs.writeFileSync("_compiled/main.min.css", minifiedCSS);
console.log("Minified CSS created.");

// Step 3: Minify & Combine JS
const jsFiles = [
  "src/script/main.js",
  "src/script/mycode_toggle.js",
  "src/script/mycode.js",
  "src/script/cheat_init.js",
  "src/script/info_fetcher.js",
  "src/script/listener.js",
  "src/script/storage.js",
  "src/script/execute.js",
].map((file) => fs.readFileSync(file, "utf-8")); // Read each file properly

const combinedJS = uglifyJS.minify(jsFiles);

if (combinedJS.error) {
  console.error("JS Minification Error:", combinedJS.error);
  process.exit(1);
}

fs.writeFileSync("_compiled/main.min.js", combinedJS.code);
console.log("Minified JS created.");

// Step 5: Read info.ini values
const infoLines = fs.readFileSync("src/info.ini", "utf-8").split(/\r?\n/);
const cheatVer = infoLines[0].trim();
const testedOn = infoLines[1].trim();

// Step 6: Create `base.js`
let baseJS = `var convertStringIndexArrayToObject;\n`;
baseJS += `var DEBUG=false;\n`;

baseJS += `setTimeout(async function() {\n`;
baseJS += `var cheatVer="${cheatVer}";\n`;
baseJS += `var testedOn="${testedOn}";\n`;
baseJS += `var isServer=0;\n`;

baseJS += fs.readFileSync("src/interface/interface.js", "utf-8"); // inject renderUI and injectCSS
baseJS += `\n`;
baseJS += `injectCSS(\`${minifiedCSS}\`);\n`;

baseJS += fs.readFileSync("_compiled/main.min.js", "utf-8"); // load the core logic
baseJS += `\n}, 2000)`;
baseScript = `<script>${baseJS}</script>`;
fs.writeFileSync("_compiled/base.js", baseJS);
console.log("Base HTML created.");

// Step 7: Create offline version
console.log("Injecting html version...");
const gameHTML = fs.readFileSync("src/game/game.html", "utf-8");
const finalOfflineHTML = gameHTML + baseScript;

fs.writeFileSync("_compiled/vanilla/DoL Vanilla - Cheat Plus.html", finalOfflineHTML);
console.log("Final html injection compiled.");

// Step 8: Prepare NW.js Cheat
console.log("Preparing NW.js cheat...");

fs.writeFileSync("_compiled/nwjs/www/cheat/cheat.html", baseScript);

fs.copyFileSync("src/script/nwjs/restore.bat", "_compiled/nwjs/www/cheat/restore.bat");
fs.copyFileSync("src/script/nwjs/inject-cheat.bat", "_compiled/nwjs/www/cheat/inject-cheat.bat");

console.log("NW.js cheat setup completed.");

// Step 9: make online version

console.log("Compiling online version...");

fs.copyFileSync("src/script/online/header.js", "_compiled/online/main.js");
fs.appendFileSync("_compiled/online/main.js", "\n(function() {\n");
fs.appendFileSync("_compiled/online/main.js", baseJS);
fs.appendFileSync("_compiled/online/main.js", "})();\n");

console.log("Online version compiled!");

// Step 10: Create offline version using dolp
console.log("Injecting html modded version...");
const modGameHTML = fs.readFileSync("src/game/game_mod.html", "utf-8");
const finalModOfflineHTML = modGameHTML + baseScript;

fs.writeFileSync("_compiled/dolp/DoLP - Cheat Plus.html", finalModOfflineHTML);
console.log("Final html modded injection compiled.");

// Delete any existing changelog in _compiled
fs.readdirSync("_compiled").forEach((file) => {
  if (file.startsWith("changelog -") && file.endsWith(".md")) {
    fs.unlinkSync(`_compiled/${file}`);
    console.log(`Deleted: ${file}`);
  }
});

// Make new changelog
fs.copyFileSync("changelog.md", `_compiled/changelog - ${cheatVer}.md`);
console.log("New changelog copied!");

// Delete any existing current game version in _compiled
fs.readdirSync("_compiled/publish").forEach((file) => {
  if (file.startsWith("modded game version -")) {
    fs.unlinkSync(`_compiled/publish/${file}`);
    console.log(`Deleted: ${file}`);
  }
});
//current game version
fs.writeFileSync(`_compiled/publish/modded game version - ${testedOn}`, "");
console.log("Current game version copied!");
