import { moduleId } from '../constants';
import { deepGetByPaths } from '../utils';

export default class ItemTweaks {
    static get baseAttributePath() {
        return "system.modifiers";
    }

    static getPath(modifier) {
        return `${this.baseAttributePath}.${modifier}`;
    }

    static init(lw) {
        lw.register(moduleId, 'CONFIG.Item.sheetClasses.valuable["witcher.WitcherItemSheet"].cls.prototype.activateListeners', this.activateExtendedListeners, "WRAPPER");
        lw.register(moduleId, 'CONFIG.Item.sheetClasses.valuable["witcher.WitcherItemSheet"].cls.prototype._updateObject', this.onUpdate, "WRAPPER");
        lw.register(moduleId, 'CONFIG.Actor.sheetClasses.character["witcher.WitcherActorSheet"].cls.prototype._onInlineEdit', this.onInventoryUpdate, "WRAPPER");
        lw.register(moduleId, 'CONFIG.Actor.sheetClasses.character["witcher.WitcherActorSheet"].cls.prototype._addItem', this.addItemWithModifiers, "WRAPPER");
        lw.register(moduleId, 'CONFIG.Actor.sheetClasses.character["witcher.WitcherActorSheet"].cls.prototype._onItemDelete', this.onItemDelete, "WRAPPER");
        lw.register(moduleId, 'CONFIG.Actor.sheetClasses.character["witcher.WitcherActorSheet"].cls.prototype.getData', this.getExtendedData, "WRAPPER");
    }

    static getExtendedData(wrapped) {
        const data = wrapped();
        let actor = data.actor;
        data.activeEffects = actor.getList("effect").filter(mod => !mod.system.itemId);
        data.itemModifiers = actor.getList("effect").filter(mod => mod.system.itemId);

        return data;
    }

    static activateExtendedListeners(wrapped, html) {
        wrapped(html);

        html.find(".add-attached-modifier-stat").on("click", ItemTweaks._onAddModifier.bind(this, "stats", "stat"));
        html.find(".add-attached-modifier-skill").on("click", ItemTweaks._onAddModifier.bind(this, "skills", "skill"));
        html.find(".add-attached-modifier-derived").on("click", ItemTweaks._onAddModifier.bind(this, "derived", "derivedStat"));

        html.find(".attached-modifiers-edit").on("change", ItemTweaks._onEditModifier.bind(this, "stats"));
        html.find(".attached-modifiers-edit-skills").on("change", ItemTweaks._onEditModifier.bind(this, "skills"));
        html.find(".attached-modifiers-edit-derived").on("change", ItemTweaks._onEditModifier.bind(this, "derived"));

        html.find(".remove-attached-modifier-stat").on("click", ItemTweaks._onDeleteModifier.bind(this, "stats"));
        html.find(".remove-attached-modifier-skill").on("click", ItemTweaks._onDeleteModifier.bind(this, "skills"));
        html.find(".remove-attached-modifier-derived").on("click", ItemTweaks._onDeleteModifier.bind(this, "derived"));
    }

    static async onUpdate(wrapped, event, formData) {
        await wrapped(event, formData);
        ItemTweaks.updateAttachedModifier(this.item, this.actor);
    }

    static async onInventoryUpdate(wrapped, event) {
        let promise = await wrapped(event);

        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        if (item.system.modifiers) {
            ItemTweaks.updateAttachedModifier(item, this.actor)
        }

        return promise;
    }


    static _onAddModifier(modifier, key, event) {
        event.preventDefault();

        const path = ItemTweaks.getPath(modifier);
        let current = deepGetByPaths(this.item, path)
        let newModifierList = current ? current : [];

        newModifierList.push({ id: ItemTweaks.genId(), [key]: "none", modifier: 0 })
        this.item.update({ [path]: newModifierList });
    }

    static _onEditModifier(modifier, event) {
        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let field = element.dataset.field;
        let value = element.value;

        const path = ItemTweaks.getPath(modifier);
        let modifiers = deepGetByPaths(this.item, path)
        let objIndex = modifiers.findIndex((obj => obj.id == itemId));
        modifiers[objIndex][field] = value

        this.item.update({ [[path]]: modifiers });
    }

    static _onDeleteModifier(modifier, event) {
        event.preventDefault();

        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;

        const path = ItemTweaks.getPath(modifier);
        let modifiers = deepGetByPaths(this.item, path)

        let newModifierList = modifiers.filter(item => item.id !== itemId)
        this.item.update({ [path]: newModifierList });
    }

    static _onRemoveModifierStat(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newModifierList = this.item.system.modifiers.stats.filter(item => item.id !== itemId)
        this.item.update({ 'system.modifiers.modifiers.stats': newModifierList });
    }

    static _onRemoveModifierSkill(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newModifierList = this.item.system.modifiers.skills.filter(item => item.id !== itemId)
        this.item.update({ 'system.modifiers.skills': newModifierList });
    }

    static _onRemoveModifierDerived(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".list-item").dataset.id;
        let newModifierList = this.item.system.modifiers.derived.filter(item => item.id !== itemId)
        this.item.update({ 'system.modifiers.derived': newModifierList });
    }

    static updateAttachedModifier(item, actor) {
        if (actor && item) {
            let mod = actor.getList("effect").find(mod => mod.system.itemId == item.id);
            if (mod) {
                let isActive = item.system.hasOwnProperty('equipped') ? item.system.equipped : true;
                const systemData = mergeObject(item.system.modifiers, {
                    isActive: isActive,
                    description: item.system.description,
                });
                mod.update({
                    name: item.name,
                    img: item.img,
                    system: systemData
                });
            }
        }
    }


    static genId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    static async addItemWithModifiers(wrapped, actor, Additem, numberOfItem, forcecreate = false) {
        await wrapped(actor, Additem, numberOfItem, forcecreate);
        if (actor === this.actor) {
            let foundItem = (actor.items).find(item => item.name == Additem.name);
            if (foundItem && foundItem.system.hasOwnProperty("modifiers")) {
                let modifierExists = actor.getList("effect").some(mod => mod.name == foundItem.name);
                if (!modifierExists) {
                    let isActive = foundItem.system.hasOwnProperty('equipped') ? foundItem.system.equipped : true;
                    let systemData = mergeObject(foundItem.system.modifiers, {
                        isActive: isActive,
                        description: foundItem.system.description,
                        itemId: foundItem.id
                    });
                    let itemData = {
                        name: foundItem.name,
                        img: foundItem.img,
                        type: "effect",
                        system: systemData
                    }
                    await Item.create(itemData, { parent: this.actor })
                }
            }
        }
    }


    static async onItemDelete(wrapped, event) {
        event.preventDefault();
        let itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) {
            let effect = this.actor.getList("effect").find(effect => effect.name == item.name);
            if (effect) {
                await effect.delete();
            }
        }
        return await wrapped(event);
    }
}