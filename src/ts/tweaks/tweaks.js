
import WitcherSpellExtendedData from '../models/WitcherSpellExtended';
import WitcherValuableExtendedData from '../models/WitcherValuableExtended';
import SpellTweaks from './SpellTweaks';
import TemplateTweaks from './TemplateTweaks';
import ItemTweaks from './ItemTweaks';

export function initTweaks() {
  CONFIG.Item.dataModels.spell = WitcherSpellExtendedData;
  CONFIG.Item.dataModels.valuable = WitcherValuableExtendedData;

  TemplateTweaks.preloadTemplates();
}

export function readyTweaks() {
  const lw = globalThis.libWrapper;
  WitcherItemTweaks.initWrappers(lw);
}

class WitcherItemTweaks {
  static initWrappers(lw) {
    SpellTweaks.init(lw);
    TemplateTweaks.init(lw);
    ItemTweaks.init(lw);
  }
}