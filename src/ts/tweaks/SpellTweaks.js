import { moduleId } from '../constants';

export default class SpellTweaks {
    static init(lw) {
        lw.register(moduleId, 'CONFIG.Actor.sheetClasses.character["witcher.WitcherActorSheet"].cls.prototype._onSpellRoll', SpellTweaks.macroSpell, "WRAPPER");
    }
    
    static async macroSpell(wrapped, event, itemId = null) {
        await wrapped(event, itemId);
        if (!itemId) {
            itemId = event.currentTarget.closest(".item").dataset.itemId;
        }
        let spellItem = this.actor.items.get(itemId);
        if (spellItem.system.hasMacro && spellItem.system.macro) {
            const macro = game.macros.getName(spellItem.system.macro);
            if (macro) {
                macro.execute();
            }
        }
    }
}