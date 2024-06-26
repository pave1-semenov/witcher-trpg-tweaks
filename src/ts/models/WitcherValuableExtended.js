const fields = foundry.data.fields;


class WitcherValuableExtendedData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            quantity: new fields.NumberField({initial: 1}),
            weight: new fields.NumberField(),
            cost: new fields.NumberField(),
            isHidden: new fields.BooleanField(),
            description: new fields.StringField(),
            type: new fields.StringField(),
            avail: new fields.StringField(),
            effect: new fields.StringField(),
            conceal: new fields.StringField(),
            quality: new fields.StringField(),
            modifiers: createModifiersSchema(),
            equipped: new fields.BooleanField({initial: false})
        }
    }
}

function createModifiersSchema() {
    return new fields.SchemaField({
        itemId: new fields.StringField(),
        description: new fields.StringField(),
        isActive: new fields.BooleanField({initial: true}),
        stats: new fields.ArrayField(new fields.SchemaField({
            id: new fields.StringField(),
            stat: new fields.StringField(),
            modifier: new fields.StringField(),
        })),
        derived: new fields.ArrayField(new fields.SchemaField({
            id: new fields.StringField(),
            derivedStat: new fields.StringField(),
            modifier: new fields.StringField(),
        })),
        skills: new fields.ArrayField(new fields.SchemaField({
            id: new fields.StringField(),
            skill: new fields.StringField(),
            modifier: new fields.StringField(),
        }))
    })
}

export default WitcherValuableExtendedData;