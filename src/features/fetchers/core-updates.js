import { byUiId as byId } from '../../ui/helpers/dom-refs.js';
import { getMycode } from '../../services/cheat-runtime.js';

const coreUpdates = {
  setButtonText: function (id, text) {
    const button = byId(id);
    if (button) button.innerHTML = text;
  },

  statpick: function () {
    const el = byId('statpick');
    if (!el) return;
    const inp = byId('statinput');
    if (inp) inp.value = SugarCube.State.variables[el.value];
  },
  statpicke: function () {
    const el = byId('statpicke');
    if (!el) return;
    const inp = byId('statinpute');
    if (inp) inp.value = SugarCube.State.variables[el.value];
  },
  spraystate: function () {
    this.setButtonText('sprayset', SugarCube.State.variables.infinitespray == 1 ? 'unset' : 'set');
  },
  bodycurrent: function () {
    const sizeNames = ['Tiny', 'Small', 'Normal', 'Large'];
    this.setButtonText('bodycurrent', sizeNames[SugarCube.State.variables.bodysize] || 'Unknown');
  },
  bodytypecurrent: function () {
    const genderMap = {
      m: 'Masculine',
      f: 'Feminine',
      a: 'Androgynous',
    };
    this.setButtonText(
      'bodytypecurrent',
      genderMap[SugarCube.State.variables.player.gender_body] || 'Unknown'
    );
  },
  ballscurrent: function () {
    SugarCube.State.variables.player.ballsExist
      ? this.setButtonText('ballsset', 'remove')
      : this.setButtonText('ballsset', 'add');
  },
  virginitycurrent: function () {
    const pick = byId('virginitypick');
    if (!pick) return;
    SugarCube.State.variables.player.virginity[pick.value]
      ? this.setButtonText('virginitycurrent', 'pure')
      : this.setButtonText('virginitycurrent', 'taken');
  },
  crimecurrent: function () {
    let total = 0;
    for (const key in SugarCube.State.variables.crime) {
      if (key !== 'events') total += SugarCube.State.variables.crime[key].current;
    }
    this.setButtonText('crimecurrent', total);
  },
  vowcurrent: function () {
    this.setButtonText(
      'vow-virgin',
      SugarCube.State.variables.player.virginity.temple ? 'Virgin' : 'Not Virgin'
    );
  },
  characurrent: function () {
    const pick = byId('charapick');
    if (!pick) return;
    const inp = byId('charainput');
    if (inp) inp.value = SugarCube.State.variables[pick.value];
  },
  lactatingcurrent: function () {
    SugarCube.State.variables.lactating
      ? this.setButtonText('lactatingset', 'No')
      : this.setButtonText('lactatingset', 'Yes');
  },
  milkcurrent: function () {
    const el = byId('milkinput');
    if (el) el.value = SugarCube.State.variables.milk_volume;
  },
  cumcurrent: function () {
    const el = byId('cuminput');
    if (el) el.value = SugarCube.State.variables.semen_volume;
  },
  famecurrent: function () {
    const sel = byId('fame_name');
    if (!sel) return;
    const inp = byId('input_fame12');
    if (inp) inp.value = SugarCube.State.variables.fame[sel.value];
  },
  npccurrent: function () {
    const nameEl = byId('npcnames');
    const traitEl = byId('npctraits');
    const input = byId('npcchangeinput');
    if (!nameEl || !traitEl || !input) return;
    const npc = SugarCube.State.variables.NPCName.find(
      (entry) => entry.description === nameEl.value
    );
    if (npc) input.value = npc[traitEl.value];
  },
  examcurrent: function () {
    const sel = byId('select_exam');
    if (!sel) return;
    const inp = byId('input_exam');
    if (inp) inp.value = SugarCube.State.variables[sel.value];
  },
  talentcurrent: function () {
    const sel = byId('select_talent');
    if (!sel) return;
    const inp = byId('input_talent');
    if (inp) inp.value = SugarCube.State.variables[sel.value];
  },
  arousalpicked: function () {
    const preview = byId('arousal_preview');
    const val = byId('arousal_val');
    if (preview && val) preview.innerHTML = val.value + '%';
  },
  update_pregnancy: function () {
    const mycode = (typeof getMycode === 'function' ? getMycode() : globalThis.mycode) || {};
    this.setButtonText('pc_pregnancy', 'MC = ' + (mycode.pc_pregnant ?? 0));
    this.setButtonText('npc_pregnancy', 'NPC = ' + (mycode.total_npc_pregnant ?? 0));
  },
  update_school_rep: function () {
    const sel = byId('select_school_rep');
    if (!sel) return;
    const inp = byId('input_school_rep');
    if (inp) inp.value = SugarCube.State.variables[sel.value];
  },
};

export default coreUpdates;
