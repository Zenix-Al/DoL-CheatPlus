# Cheat Factory Browser Smoke Checklist

Checklist version: 1  
Last updated: 2026-08-29

Use this checklist for behavior that the local Node/JSDOM suite cannot prove.
Create a fresh evidence copy for each release candidate; do not commit personal
save data or a complete game-state dump.

## Environment

- CheatPlus revision:
- DoL version/build:
- Browser and version:
- Userscript manager and version:
- Page URL/domain:
- Minimal save fixture or starting passage:

## Smoke cases

- [ ] Userscript injects once and opens/closes its Shadow DOM UI.
- [ ] Reinjecting or revisiting does not duplicate the launcher, controls, or listeners.
- [ ] Money accepts a finite value, rejects invalid input, and refreshes visible state.
- [ ] A frame toggle activates once, keeps running, disables cleanly, and restores once.
- [ ] A daily toggle runs once per game day and remains stopped after disable.
- [ ] Save, load, and save-slot switching preserve centrally configured CheatPlus state.
- [ ] A documented legacy toggle key migrates once to its stable descriptor ID.
- [ ] A repeatedly failing toggle is quarantined without disabling a healthy toggle.
- [ ] Named/stored NPC, pregnancy, fetus, and offspring controls handle current game shapes.
- [ ] Compatibility globals required by supported external pages/scripts remain available.
- [ ] Local-server Export reports the tracked `save_data` limitation or works after its fix.
- [ ] Local-server Import reports the tracked `load_data` limitation or works after its fix.

## Evidence

| Case | Pass/fail | Observation or issue link |
| ---- | --------- | ------------------------- |
|      |           |                           |

Record exact controls, observed and intended results, and whether failures are
deterministic. A checked box without the environment and observation is not
release evidence.
# Developer diagnostics

- [ ] Open Misc and confirm only “Show Developer Tools” is initially visible for
      the Developer Tools row.
- [ ] Reveal the tools and run diagnostics in a healthy game; confirm the report
      contains only counts, probe IDs, statuses, and controlled messages.
- [ ] Induce one unavailable-path/partial-failure condition and confirm remaining
      probes still report results.
- [ ] Use Copy Report with clipboard permission, then deny/unavailable clipboard
      access and confirm the report field is selected as fallback.
- [ ] Record representative game values before and after diagnostics and confirm
      they are unchanged.
- [ ] Close and reopen the modal; confirm Developer Tools returns to hidden state
      and no duplicate listeners, timers, aliases, or scheduler entries appear.
