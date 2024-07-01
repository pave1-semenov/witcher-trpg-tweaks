
import WitcherSpellExtendedData from './models/WitcherSpellExtended';
import WitcherValuableExtendedData from './models/WitcherValuableExtended';
import SpellMacros from './tweaks/SpellMacros';
import TemplateOverrides from './tweaks/TemplateOverrides';
import ItemModifiers from './tweaks/ItemModifiers';
import AutoFumbles from './tweaks/fumble/AutoFumbles';
import MeleeWeaponFumbleResolver from './tweaks/fumble/resolver/MeleeWeaponFumbleResolver';

export function initTweaks() {
  CONFIG.Item.dataModels.spell = WitcherSpellExtendedData;
  CONFIG.Item.dataModels.valuable = WitcherValuableExtendedData;

  TemplateOverrides.preloadTemplates();
}

export function readyTweaks() {
  const lw = globalThis.libWrapper;
  WitcherItemTweaks.initWrappers(lw);
  AutoFumbles.getInstance().init();
}

class WitcherItemTweaks {
  static initWrappers(lw) {
    SpellMacros.init(lw);
    TemplateOverrides.init(lw);
    ItemModifiers.init(lw);
  }
}

Hooks.on("renderChatLog", (_app, html, _data) => AutoFumbles.getInstance().attachChatListeners(html));