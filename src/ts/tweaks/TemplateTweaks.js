import { moduleId } from '../constants';

export default class TemplateTweaks {
    static init(lw) {
        lw.register(moduleId, 'CONFIG.Item.sheetClasses.spell["witcher.WitcherItemSheet"].cls.prototype.template', this.itemsTemplate, "MIXED");
        lw.register(moduleId, 'CONFIG.Actor.sheetClasses.character["witcher.WitcherActorSheet"].cls.prototype.template', this.characterTemplate, "OVERRIDE");
    }

    static itemsTemplate(wrapped) {
        let tmpl;
        const type = this.object.type;

        switch (this.object.type) {
            case 'valuable':
            case 'spell':
                tmpl = `modules/witcher-trpg-dae/templates/sheet/${type}-sheet.html`; break
            default: tmpl = wrapped();
        }

        return tmpl;
    }
    
    static characterTemplate(wrapped) {
        return `modules/${moduleId}/templates/sheet/actor-sheet.html`;
    }

    static async preloadTemplates() {
        const templatePath = [
            `modules/${moduleId}/templates/chunk/modifier.html`,
            `modules/${moduleId}/templates/chunk/inventory-valuable.html`,
            `modules/${moduleId}/templates/sheet/actor-sheet.html`,
            `modules/${moduleId}/templates/sheet/character-sheet.html`,
            `modules/${moduleId}/templates/sheet/spell-sheet.html`,
            `modules/${moduleId}/templates/sheet/valuable-sheet.html`,
            `modules/${moduleId}/templates/tab/tab-inventory.html`,
            `modules/${moduleId}/templates/tab/tab-background.html`,
        ];
        return loadTemplates(templatePath);
    }
}