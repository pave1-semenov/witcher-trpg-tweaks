const fields = foundry.data.fields;

class WitcherSpellExtendedData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            class: new fields.StringField(),
            level: new fields.StringField(),
            source: new fields.StringField(),
            domain: new fields.StringField(),
            stamina: new fields.NumberField(),
            staminaIsVar: new fields.BooleanField(),
            effect: new fields.StringField(),
            range: new fields.StringField(),
            duration: new fields.StringField(),
            defence: new fields.StringField(),
            components: new fields.StringField(),
            alteranteComponents: new fields.StringField(),
            preparationTime: new fields.StringField(),
            dificultyCheck: new fields.StringField(),
            danger: new fields.StringField(),
            liftRequirement: new fields.StringField(),
            sideEffect: new fields.StringField(),
            createTemplate: new fields.StringField(),
            createTemplate: new fields.BooleanField(),
            templateSize: new fields.StringField(),
            templateType: new fields.StringField(),
            causeDamages: new fields.BooleanField(),
            damage: new fields.BooleanField(),
            effects: new fields.ArrayField(new fields.SchemaField({
                id: new fields.StringField(),
                name: new fields.StringField(),
            })),
            hasMacro: new fields.BooleanField(),
            macro: new fields.StringField()
            
        }
    }
}

export default WitcherSpellExtendedData;