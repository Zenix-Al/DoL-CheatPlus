<a name="readme-top"></a>
<br />

<div align="center">
  <h1 align="center">DoL Companion Panel</h1>
  <p align="center">
    <strong>Quality-of-life interface panel + variable inspector for Degrees of Lewdity</strong>
    <br />
    Works with vanilla, DoL Plus, and many online/modded versions.
    <br /><br />
    <a href="https://github.com/Zenix-Al/DoL-CheatPlus">View on GitHub</a>
    ·
    <a href="https://github.com/Zenix-Al/DoL-CheatPlus/issues">Report Bug / Suggest Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#supported-versions">Supported Versions</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

## About The Project

DoL Companion Panel is a userscript that adds an extra floating control panel and quick-access tools to Degrees of Lewdity.

It helps with inspecting variables, adjusting commonly-used values quickly, managing repetitive tasks, and giving better visibility into game state — especially useful during long play sessions or when testing mods.

> **Note**: This is **not** an in-game cheat menu replacement.  
> It runs entirely client-side via Tampermonkey / Violentmonkey / userscript manager.

## Features

- Floating side panel with tabs: Quick Actions · Stats · Misc
- Quick stat modifiers (pain, arousal, stress, control, trauma, etc.)
- Body / appearance overrides (size, gender body type, balls, lactating, milk/cum volume…)
- Pregnancy overview & timers (player + named NPCs + stored NPCs)
- Fame, school rep, crime counters, church vow status
- NPC trait editor
- Wolf pack harmony/ferocity controls
- Farm assault/build timers & animal affection
- Variable search / value inspector (very useful for debugging or finding hidden flags)
- History navigation buttons (optional)
- …and various small conveniences that make long playthroughs less tedious

More features are added whenever I feel like playing and notice something annoying :P

## Getting Started

### Prerequisites

- A userscript manager:
  - Tampermonkey (Chrome / Edge / Firefox / Opera)
  - Violentmonkey (recommended for better privacy & performance)
- Degrees of Lewdity running in browser (online or local)

### Installation (easiest way – userscript)

1. Install Tampermonkey / Violentmonkey
2. Go to the latest release page:  
   https://github.com/Zenix-Al/DoL-CheatPlus/releases
3. Download the `.user.js` file from the latest release (usually called `DoL-Companion.user.js` or similar)
4. The extension should ask you to install it → confirm
5. Open any supported DoL version (see below)

Done. A small **floating button** should appear (you can drag it).

## Supported Versions

| Version                  | URL pattern                          | Status     | Notes                              |
|--------------------------|--------------------------------------|------------|------------------------------------|
| Vanilla                  | `https://vanilla.dolmods.net/*`      | Working    | Main test target                   |
| DoL Plus                 | `https://dolp.dolmods.net/*`         | Working    | Most popular online version        |
| Bees / Firemod / others  | `*.dolmods.net/*`                    | Should work| Usually compatible                 |
| Local HTML / NW.js       | local files                          | Partial    | May need manual injection          |

## Usage

1. Load any supported DoL page
2. Look for the small floating button (default top-right, draggable)
3. Click it → panel opens
4. Use **Ctrl + Shift + C** to toggle (configurable in some versions)

The panel has three tabs:

- **Quick** → most used toggles & one-click actions
- **Stat** → detailed player/enemy stat editing
- **Misc** → NPC manager, pregnancy, farm, debug tools…

Have fun exploring~ ♡

## Roadmap

- [ ] Better mobile/responsive layout
- [ ] More DoL version auto-detection
- [ ] Optional dark/light theme toggle
- [ ] Export/import panel settings
- [ ] More farm / tentacle / baby related shortcuts
- [ ] Maybe a mini changelog inside the panel

## Contributing

Love it? Hate it? Found a bug?  
→ Open an issue or make a PR — both are super welcome.

Even just telling me “hey this thing broke after update 0.5.x” helps a ton.

If you enjoy using it, starring the repo is the easiest way to say thanks ♡

<p align="right">(<a href="#readme-top">back to top</a>)</p>
