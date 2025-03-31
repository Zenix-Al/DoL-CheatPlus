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
const folders = ["_compiled", "_compiled/nwjs", "_compiled/offline", "_compiled/online"];
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
  "src/script/sync.js",
  "src/script/storage.js",
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

// Step 6: Create `base.html`
let baseHTML = `<style>\n${minifiedCSS}\n</style>\n`;
baseHTML += fs.readFileSync("src/interface/index.html", "utf-8");
baseHTML += `<script>\n`;
baseHTML += `var convertStringIndexArrayToObject;\n`;
baseHTML += `var DEBUG=false;\n`;
baseHTML += `setTimeout(function() {\n`;
baseHTML += `var cheatVer="${cheatVer}";\n`;
baseHTML += `var testedOn="${testedOn}";\n`;
baseHTML += `var isServer=0;\n`;
baseHTML += fs.readFileSync("_compiled/main.min.js", "utf-8");
baseHTML += `\n}, 2000);\n</script>\n`;

fs.writeFileSync("_compiled/base.html", baseHTML);
console.log("Base HTML created.");

// Step 7: Create offline version
console.log("Injecting html version...");
let offlineHTML = fs.readFileSync("_compiled/base.html", "utf-8");
const gameHTML = fs.readFileSync("src/game/game.html", "utf-8");
const finalOfflineHTML = gameHTML + offlineHTML;

fs.writeFileSync("_compiled/offline/game.html", finalOfflineHTML);
console.log("Final html injection compiled.");

// Step 8: Prepare NW.js Cheat
console.log("Preparing NW.js cheat...");

fs.copyFileSync("_compiled/base.html", "_compiled/nwjs/cheat.html");

fs.copyFileSync("src/script/nwjs/restore.bat", "_compiled/nwjs/restore.bat");
fs.copyFileSync("src/script/nwjs/inject-cheat.bat", "_compiled/nwjs/inject-cheat.bat");

console.log("NW.js cheat setup completed.");

// Step 9: make online version

console.log("Compiling online version...");

fs.copyFileSync("src/script/online/header.js", "_compiled/online/main.js");

let css = fs
  .readFileSync("_compiled/main.min.css", "utf-8")
  .replace(/\\/g, "\\\\") // Escape backslashes
  .replace(/"/g, '\\"') // Escape double quotes
  .replace(/\n/g, "\\n"); // Escape new lines

let interfaceScript = fs.readFileSync("src/script/online/interface.js", "utf-8");
interfaceScript += `\nvar customcss = document.createElement("style");\n`;
interfaceScript += `customcss.textContent = "${css}";\n`;
interfaceScript += `document.head.appendChild(customcss);\n`;

fs.appendFileSync("_compiled/online/main.js", "\n(function() {\n");
fs.appendFileSync("_compiled/online/main.js", interfaceScript + "\n");

fs.appendFileSync("_compiled/online/main.js", `var convertStringIndexArrayToObject;\n`);
fs.appendFileSync("_compiled/online/main.js", `setTimeout(function() {\n`);
fs.appendFileSync("_compiled/online/main.js", `var DEBUG=false;\n`);
fs.appendFileSync("_compiled/online/main.js", `var isServer=0;\n`);
fs.appendFileSync("_compiled/online/main.js", `var cheatVer="${cheatVer}";\n`);
fs.appendFileSync("_compiled/online/main.js", `var testedOn="${testedOn}";\n`);

fs.appendFileSync("_compiled/online/main.js", fs.readFileSync("_compiled/main.min.js", "utf-8"));

fs.appendFileSync("_compiled/online/main.js", "\n}, 1000);\n");
fs.appendFileSync("_compiled/online/main.js", "})();\n");

console.log("Online version compiled!");

// Step 10: Create offline version using dolp
console.log("Injecting html modded version...");
let html = fs.readFileSync("_compiled/base.html", "utf-8");
const modGameHTML = fs.readFileSync("src/game/game_mod.html", "utf-8");
const finalModOfflineHTML = gameHTML + offlineHTML;

fs.writeFileSync("_compiled/offline/game-DoLP.html", finalModOfflineHTML);
console.log("Final html modded injection compiled.");
