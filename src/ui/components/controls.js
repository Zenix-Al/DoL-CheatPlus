import { byUiId } from '../helpers/dom-refs.js';

export function moveButton(direction) {
  const floatingButton = byUiId('floating-button');
  if (!floatingButton) return;

  if (direction === 'up') {
    floatingButton.classList.toggle('moved');
    byUiId('cheat-up').hidden = true;
    byUiId('cheat-down').hidden = false;
  } else if (direction === 'down') {
    floatingButton.classList.toggle('moved');
    byUiId('cheat-up').hidden = false;
    byUiId('cheat-down').hidden = true;
  }
}

export function Enable_cheat_history() {
  var button_back = byUiId('cheat-history-backwards');
  var button_forward = byUiId('cheat-history-forwards');
  var button_set =
    byUiId('Enable_cheat_history') || document.getElementById('Enable_cheat_history');
  if (!button_back || !button_forward || !button_set) return;

  if (button_back.hidden == true) {
    button_back.hidden = false;
    button_forward.hidden = false;
    button_set.innerHTML = 'Disable';
    if (window.mycode && typeof window.mycode.update_history === 'function')
      window.mycode.update_history();
  } else {
    button_back.hidden = true;
    button_forward.hidden = true;
    button_set.innerHTML = 'Enable';
  }
}

export function Enable_sidebar_button() {
  var button = byUiId('cheat-sidebar');
  var sidebar_button = document.getElementById('Enable_sidebar_button');
  if (!button || !sidebar_button) return;

  if (button.hidden == true) {
    button.hidden = false;
    sidebar_button.innerHTML = 'Disable';
  } else {
    button.hidden = true;
    sidebar_button.innerHTML = 'Enable';
  }
}

export function simple_cheat_button() {
  const cheatButton = byUiId('cheat-open');
  const simpleCheatButton = document.getElementById('simple_cheat_button');
  if (!cheatButton || !simpleCheatButton) return;

  const isDisabled = simpleCheatButton.innerHTML === 'Disable';
  simpleCheatButton.innerHTML = isDisabled ? 'Enable' : 'Disable';
  cheatButton.innerHTML = isDisabled ? 'Cheat' : '⚙';
  cheatButton.style.fontSize = isDisabled ? '' : '89%';
}
